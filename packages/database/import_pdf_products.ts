import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

process.env.DATABASE_URL = 'postgresql://postgres.fqcghygmiermuorzcrzg:Ency1!clop%23%3Fedia@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1';

const prisma = new PrismaClient();

// Helper to convert arbitrary category name to slug
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🔄 Starting PDF product import...');
  
  const rawData = JSON.parse(fs.readFileSync('../../pdf_output.json', 'utf8'));
  const lines = rawData.lines as string[];

  // Skip the first 4 lines since they are headers: Category, Subcategory, Brand, Product
  const dataLines = lines.slice(4);

  const productsToImport: any[] = [];
  
  for (let i = 0; i < dataLines.length; i += 4) {
    if (i + 3 >= dataLines.length) break;
    
    productsToImport.push({
      categoryRaw: dataLines[i],
      subcategory: dataLines[i+1],
      brand: dataLines[i+2],
      name: dataLines[i+3],
    });
  }

  // Deduplicate products based on name
  const uniqueProducts = new Map();
  for (const p of productsToImport) {
    if (!uniqueProducts.has(p.name)) {
      uniqueProducts.set(p.name, p);
    }
  }

  const items = Array.from(uniqueProducts.values());
  console.log(`📦 Found ${items.length} unique products to import.`);

  // Create categories mapping
  const existingCategories = await prisma.category.findMany();
  const categoryMap = new Map(existingCategories.map(c => [c.name.toLowerCase(), c.id]));

  let newCount = 0;

  for (const item of items) {
    // Determine category properly. "Milk & Dairy" might map to "Dairy & Eggs" in our Seed
    let categoryName = item.categoryRaw;
    if (categoryName === 'Milk & Dairy') categoryName = 'Dairy & Eggs';
    if (categoryName === 'Grains') categoryName = 'Grains & Cereals';
    
    // Find or create category
    let categoryId = categoryMap.get(categoryName.toLowerCase());
    if (!categoryId) {
      const slug = toSlug(categoryName);
      const newCat = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: categoryName, slug, sortOrder: 99 },
      });
      categoryId = newCat.id;
      categoryMap.set(categoryName.toLowerCase(), categoryId);
      console.log(`Created new category: ${categoryName}`);
    }

    const productSlug = toSlug(item.name);
    
    await prisma.product.upsert({
      where: { slug: productSlug },
      update: {},
      create: {
        name: item.name,
        slug: productSlug,
        brand: item.brand,
        categoryId: categoryId,
        unit: 'per pack', // default parsing unit since PDF doesn't have it
      }
    });
    newCount++;
  }

  console.log(`✅ Successfully imported ${newCount} products from PDF.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
