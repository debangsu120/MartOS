import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default store
  const store = await prisma.store.upsert({
    where: { slug: 'boutiquemart' },
    update: {},
    create: {
      name: 'Boutique Mart',
      slug: 'boutiquemart',
      phone: '+91 9876543210',
      email: 'contact@boutiquemart.com',
      address: '123 Main Street, Mumbai, Maharashtra',
      gstNumber: '27AABCU9603R1ZM',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    },
  });
  console.log('Created store:', store.name);

  // Create roles
  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager', description: 'Store Manager', permissions: JSON.stringify(['*']) },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: 'cashier' },
    update: {},
    create: { name: 'cashier', description: 'Cashier', permissions: JSON.stringify(['sales', 'products:read']) },
  });

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@boutiquemart.com' },
    update: {},
    create: {
      email: 'manager@boutiquemart.com',
      password: hashedPassword,
      name: 'Arjun K.',
      phone: '+91 9876543210',
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: manager.id, roleId: managerRole.id } },
    update: {},
    create: { userId: manager.id, roleId: managerRole.id },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@boutiquemart.com' },
    update: {},
    create: {
      email: 'cashier@boutiquemart.com',
      password: hashedPassword,
      name: 'Priya S.',
      phone: '+91 9876543211',
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: cashier.id, roleId: cashierRole.id } },
    update: {},
    create: { userId: cashier.id, roleId: cashierRole.id },
  });

  // Link users to store
  await prisma.userStore.upsert({
    where: { userId_storeId: { userId: manager.id, storeId: store.id } },
    update: {},
    create: { userId: manager.id, storeId: store.id, isDefault: true },
  });

  await prisma.userStore.upsert({
    where: { userId_storeId: { userId: cashier.id, storeId: store.id } },
    update: {},
    create: { userId: cashier.id, storeId: store.id, isDefault: true },
  });

  console.log('Created users: manager@boutiquemart.com, cashier@boutiquemart.com');

  // Create categories
  const categories = [
    { name: 'Millet Snacks', slug: 'millet-snacks' },
    { name: 'Diabetic Friendly', slug: 'diabetic-friendly' },
    { name: 'Satvik Vegan', slug: 'satvik-vegan' },
    { name: 'Organic Grains', slug: 'organic-grains' },
    { name: 'Health Supplements', slug: 'health-supplements' },
    { name: 'Natural Sweeteners', slug: 'natural-sweeteners' },
    { name: 'Organic Oils', slug: 'organic-oils' },
    { name: 'Dairy Alternatives', slug: 'dairy-alternatives' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
      update: {},
      create: { storeId: store.id, name: cat.name, slug: cat.slug },
    });
  }
  console.log('Created categories');

  // Create sample products (30+ products)
  const products = [
    { name: 'Ragi Cookies', sku: 'RFC001', costPrice: 80, sellingPrice: 120, gstRate: 12, lowStockAlert: 20 },
    { name: 'Bajra Flakes', sku: 'BBF002', costPrice: 60, sellingPrice: 90, gstRate: 5, lowStockAlert: 30 },
    { name: 'Jowar Puffs', sku: 'SJP003', costPrice: 45, sellingPrice: 70, gstRate: 5, lowStockAlert: 25 },
    { name: 'Diabetic Atta', sku: 'DDA004', costPrice: 120, sellingPrice: 180, gstRate: 0, lowStockAlert: 15 },
    { name: 'Sugar Free Choco', sku: 'SFC005', costPrice: 90, sellingPrice: 140, gstRate: 18, lowStockAlert: 20 },
    { name: 'Almond Milk', sku: 'ALM006', costPrice: 150, sellingPrice: 220, gstRate: 12, lowStockAlert: 10 },
    { name: 'Tofu Block', sku: 'TFB007', costPrice: 80, sellingPrice: 120, gstRate: 0, lowStockAlert: 15 },
    { name: 'Quinoa Grain', sku: 'QNG008', costPrice: 200, sellingPrice: 300, gstRate: 5, lowStockAlert: 10 },
    { name: 'Ragi Noodles', sku: 'RFN009', costPrice: 70, sellingPrice: 110, gstRate: 12, lowStockAlert: 25 },
    { name: 'Bajra Upma Mix', sku: 'BUM010', costPrice: 55, sellingPrice: 85, gstRate: 5, lowStockAlert: 20 },
    { name: 'Jowar Sorghum Flour', sku: 'JSF011', costPrice: 65, sellingPrice: 95, gstRate: 0, lowStockAlert: 30 },
    { name: 'Organic Brown Rice', sku: 'OBR012', costPrice: 90, sellingPrice: 140, gstRate: 5, lowStockAlert: 25 },
    { name: 'Organic Moong Dal', sku: 'OMD013', costPrice: 110, sellingPrice: 165, gstRate: 5, lowStockAlert: 20 },
    { name: 'Organic Chana Dal', sku: 'OCD014', costPrice: 105, sellingPrice: 155, gstRate: 5, lowStockAlert: 20 },
    { name: 'Coconut Sugar', sku: 'CNS015', costPrice: 180, sellingPrice: 270, gstRate: 0, lowStockAlert: 15 },
    { name: 'Raw Honey', sku: 'RWH016', costPrice: 250, sellingPrice: 380, gstRate: 0, lowStockAlert: 10 },
    { name: 'Stevia Leaves', sku: 'STL017', costPrice: 120, sellingPrice: 180, gstRate: 0, lowStockAlert: 15 },
    { name: 'Cold Pressed Coconut Oil', sku: 'CCO018', costPrice: 220, sellingPrice: 340, gstRate: 5, lowStockAlert: 12 },
    { name: 'Mustard Oil', sku: 'MSO019', costPrice: 190, sellingPrice: 290, gstRate: 5, lowStockAlert: 15 },
    { name: 'Sesame Oil', sku: 'SSO020', costPrice: 200, sellingPrice: 310, gstRate: 5, lowStockAlert: 12 },
    { name: 'Groundnut Oil', sku: 'GNO021', costPrice: 180, sellingPrice: 275, gstRate: 5, lowStockAlert: 15 },
    { name: 'Oat Milk', sku: 'OAM022', costPrice: 140, sellingPrice: 210, gstRate: 12, lowStockAlert: 10 },
    { name: 'Soy Milk', sku: 'SYM023', costPrice: 100, sellingPrice: 150, gstRate: 12, lowStockAlert: 12 },
    { name: 'Cashew Milk', sku: 'CSM024', costPrice: 160, sellingPrice: 240, gstRate: 12, lowStockAlert: 10 },
    { name: 'Millet Energy Bar', sku: 'MEB025', costPrice: 50, sellingPrice: 80, gstRate: 12, lowStockAlert: 30 },
    { name: 'Protein Powder', sku: 'PPD026', costPrice: 350, sellingPrice: 520, gstRate: 18, lowStockAlert: 8 },
    { name: 'Vitamin D3 Tablets', sku: 'VDT027', costPrice: 180, sellingPrice: 280, gstRate: 12, lowStockAlert: 15 },
    { name: 'Omega 3 Capsules', sku: 'O3C028', costPrice: 250, sellingPrice: 380, gstRate: 12, lowStockAlert: 10 },
    { name: 'Green Tea Extract', sku: 'GTE029', costPrice: 200, sellingPrice: 300, gstRate: 18, lowStockAlert: 12 },
    { name: 'Turmeric Capsules', sku: 'TUC030', costPrice: 150, sellingPrice: 230, gstRate: 12, lowStockAlert: 15 },
    { name: 'Multivitamin Complex', sku: 'MVC031', costPrice: 280, sellingPrice: 420, gstRate: 18, lowStockAlert: 10 },
    { name: 'Probiotic Powder', sku: 'PPD032', costPrice: 320, sellingPrice: 480, gstRate: 18, lowStockAlert: 8 },
    { name: 'Chia Seeds', sku: 'CHS033', costPrice: 180, sellingPrice: 270, gstRate: 5, lowStockAlert: 15 },
    { name: 'Flax Seeds', sku: 'FLS034', costPrice: 160, sellingPrice: 240, gstRate: 5, lowStockAlert: 15 },
    { name: 'Sunflower Seeds', sku: 'SFS035', costPrice: 140, sellingPrice: 210, gstRate: 5, lowStockAlert: 20 },
    { name: 'Pumpkin Seeds', sku: 'PKS036', costPrice: 170, sellingPrice: 255, gstRate: 5, lowStockAlert: 15 },
    { name: 'Mixed Dry Fruits', sku: 'MDF037', costPrice: 400, sellingPrice: 600, gstRate: 5, lowStockAlert: 10 },
  ];

  const dbCategories = await prisma.category.findMany({ where: { storeId: store.id } });

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const categoryId = dbCategories[i % dbCategories.length].id;

    const product = await prisma.product.upsert({
      where: { storeId_sku: { storeId: store.id, sku: prod.sku } },
      update: {},
      create: {
        storeId: store.id,
        categoryId,
        name: prod.name,
        slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: prod.sku,
        costPrice: prod.costPrice,
        sellingPrice: prod.sellingPrice,
        mrp: prod.sellingPrice,
        gstRate: prod.gstRate,
        lowStockAlert: prod.lowStockAlert,
        isActive: true,
      },
    });

    // Create inventory
    await prisma.inventory.upsert({
      where: { storeId_productId: { storeId: store.id, productId: product.id } },
      update: {},
      create: {
        storeId: store.id,
        productId: product.id,
        quantity: Math.floor(Math.random() * 100) + 20,
      },
    });
  }
  console.log('Created products and inventory');

  // Create sample sales for dashboard metrics
  const allProducts = await prisma.product.findMany({ where: { storeId: store.id } });

  for (let day = 0; day < 7; day++) {
    const numSales = Math.floor(Math.random() * 5) + 2;
    for (let s = 0; s < numSales; s++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      const saleItems: any[] = [];
      let subtotal = 0;

      for (let i = 0; i < numItems; i++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const unitPrice = Number(product.sellingPrice);
        const costPrice = Number(product.costPrice);
        const discountPercent = Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 5 : 0;
        const discountAmount = (unitPrice * qty * discountPercent) / 100;
        const taxPercent = Number(product.gstRate);
        const taxAmount = ((unitPrice * qty - discountAmount) * taxPercent) / 100;
        const totalAmount = unitPrice * qty - discountAmount + taxAmount;

        saleItems.push({
          productId: product.id,
          quantity: qty,
          unitPrice,
          costPrice,
          discountPercent,
          discountAmount,
          taxPercent,
          taxAmount,
          totalAmount,
        });
        subtotal += totalAmount;
      }

      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - day);
      saleDate.setHours(Math.floor(Math.random() * 12) + 9);

      await prisma.sale.create({
        data: {
          storeId: store.id,
          userId: Math.random() > 0.5 ? manager.id : cashier.id,
          orderNumber: `ORD-${Date.now()}-${day}${s}`,
          subtotal,
          discountAmount: saleItems.reduce((sum, item) => sum + item.discountAmount, 0),
          taxAmount: saleItems.reduce((sum, item) => sum + item.taxAmount, 0),
          totalAmount: subtotal,
          paymentMethod: ['cash', 'card', 'upi'][Math.floor(Math.random() * 3)],
          paymentStatus: 'completed',
          status: 'completed',
          createdAt: saleDate,
          completedAt: saleDate,
          items: {
            create: saleItems,
          },
        },
      });
    }
  }
  console.log('Created sample sales');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });