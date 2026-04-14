import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        state: true,
        city: true,
        _count: {
          select: {
            shoppingLists: true,
            expenses: true,
            pricesReported: true,
            receiptScans: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { passwordHash, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone) updateData.phone = data.phone;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.firstName || data.lastName) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      updateData.displayName = `${data.firstName || user?.firstName || ''} ${data.lastName || user?.lastName || ''}`.trim();
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { state: true, city: true, subscription: true },
    });

    const { passwordHash, ...safe } = updated;
    return safe;
  }

  async updateLocation(userId: string, data: { stateId: string; cityId: string }) {
    // Validate city belongs to state
    const city = await this.prisma.city.findUnique({ where: { id: data.cityId } });
    if (!city || city.stateId !== data.stateId) {
      throw new BadRequestException('City does not belong to the selected state');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { stateId: data.stateId, cityId: data.cityId },
      include: { state: true, city: true },
    });

    const { passwordHash, ...safe } = updated;
    return safe;
  }
}
