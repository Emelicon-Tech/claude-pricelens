import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { MockAiService } from '../common/ai/mock-ai.service';

@Injectable()
export class ShoppingListsService {
  constructor(
    private prisma: PrismaService,
    private aiService: MockAiService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        _count: { select: { items: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                prices: {
                  include: { store: { include: { city: true } } },
                  orderBy: { amount: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!list || list.userId !== userId) throw new NotFoundException('Shopping list not found');

    // Calculate total per store
    const storeTotals = this.calculateStoreTotals(list.items);

    return { ...list, storeTotals };
  }

  async create(name: string, userId: string) {
    // Check free tier limit (1 list)
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    const isFree = !subscription || subscription.plan === 'FREE';

    if (isFree) {
      const listCount = await this.prisma.shoppingList.count({ where: { userId } });
      if (listCount >= 1) {
        throw new ForbiddenException({
          message: 'Free accounts can only have 1 shopping list. Upgrade to Pro for unlimited lists.',
          code: 'LIST_LIMIT_REACHED',
        });
      }
    }

    return this.prisma.shoppingList.create({
      data: { name, userId },
    });
  }

  async analyzeAndCreateList(file: Express.Multer.File, listName: string, userId: string) {
    const newList = await this.create(listName, userId);

    const extractedItems = await this.aiService.extractShoppingList(file.buffer, file.mimetype);

    for (const item of extractedItems) {
      // Find a matching product from our DB mock seeds
      // Simple substring match for the demo
      const firstWord = item.rawName.split(' ')[0];
      const product = await this.prisma.product.findFirst({
        where: { name: { contains: firstWord, mode: 'insensitive' } }
      });
      
      if (product) {
        await this.prisma.shoppingListItem.create({
          data: {
            shoppingListId: newList.id,
            productId: product.id,
            quantity: item.quantity,
            unit: item.unit,
          }
        });
      }
    }

    // Return the newly hydrated list with its store breakdown!
    return this.findOne(newList.id, userId);
  }

  async addItem(listId: string, data: { productId: string; quantity?: number }, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== userId) throw new NotFoundException('Shopping list not found');

    // Free tier: max 10 items
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    const isFree = !subscription || subscription.plan === 'FREE';
    if (isFree) {
      const itemCount = await this.prisma.shoppingListItem.count({ where: { shoppingListId: listId } });
      if (itemCount >= 10) {
        throw new ForbiddenException({
          message: 'Free accounts limited to 10 items per list. Upgrade to Pro for unlimited items.',
          code: 'ITEM_LIMIT_REACHED',
        });
      }
    }

    return this.prisma.shoppingListItem.upsert({
      where: { shoppingListId_productId: { shoppingListId: listId, productId: data.productId } },
      update: { quantity: data.quantity || 1 },
      create: {
        shoppingListId: listId,
        productId: data.productId,
        quantity: data.quantity || 1,
      },
      include: { product: true },
    });
  }

  async updateItem(listId: string, itemId: string, data: any, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== userId) throw new NotFoundException();

    return this.prisma.shoppingListItem.update({
      where: { id: itemId },
      data,
    });
  }

  async removeItem(listId: string, itemId: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== userId) throw new NotFoundException();

    return this.prisma.shoppingListItem.delete({ where: { id: itemId } });
  }

  async optimizeList(id: string, userId: string) {
    const list = await this.findOne(id, userId);

    const sortedStores = list.storeTotals || [];
    
    if (sortedStores.length < 2) {
      return {
        listId: id,
        recommendation: sortedStores[0] || null,
        allOptions: sortedStores,
        message: 'Based on current prices, the cheapest option is shown. Add more items to unlock full routing analytics.',
      };
    }

    const cheapest = sortedStores[0];
    const runnerUp = sortedStores[1];
    const savings = runnerUp.total - cheapest.total;

    // Provide the dynamic transport threshold optimization!
    let message = '';
    if (savings > 0) {
      message = `Dynamic Routing Analysis: Buying all items at ${cheapest.store.name} saves you ₦${savings.toLocaleString()} compared to ${runnerUp.store.name}. However, ONLY travel to the cheapest store if your physical transportation fare is strictly less than ₦${savings.toLocaleString()}. Ensure you weigh travel time against direct cash savings.`;
    } else {
      message = `Dynamic Routing Analysis: Both ${cheapest.store.name} and ${runnerUp.store.name} offer identical total basket costs for these items. Choose the one closest to your location to minimize transport fares.`;
    }

    return {
      listId: id,
      recommendation: cheapest,
      runnerUp,
      savings,
      allOptions: sortedStores,
      message,
    };
  }

  async delete(id: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== userId) throw new NotFoundException();

    return this.prisma.shoppingList.delete({ where: { id } });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private calculateStoreTotals(items: any[]) {
    const storeMap = new Map<string, { store: any; total: number; itemsAvailable: number }>();

    for (const item of items) {
      for (const price of item.product?.prices || []) {
        const storeId = price.storeId;
        if (!storeMap.has(storeId)) {
          storeMap.set(storeId, { store: price.store, total: 0, itemsAvailable: 0 });
        }
        const entry = storeMap.get(storeId)!;
        entry.total += Number(price.amount) * item.quantity;
        entry.itemsAvailable++;
      }
    }

    return Array.from(storeMap.values())
      .sort((a, b) => a.total - b.total)
      .map(s => ({
        ...s,
        total: Math.round(s.total),
        coverage: `${s.itemsAvailable}/${items.length} items`,
      }));
  }
}
