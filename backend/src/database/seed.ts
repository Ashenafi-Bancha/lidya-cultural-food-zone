import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from '../config/env'; // Load env variables
import { logger } from '../utils/logger';
import { prisma } from './prisma';

async function main() {
  logger.info('Starting database seeding...');

  // ─── 1. Create Root Admin (OWNER) ────────────────────────────────────────
  const ownerPasswordHash = await bcrypt.hash(
    process.env.SEED_OWNER_PASSWORD || 'ChangeMe@2025!',
    12
  );
  const owner = await prisma.user.upsert({
    where: { email: 'owner@lidyafoodzone.com' },
    update: {},
    create: {
      name: 'Lidya Owner',
      email: 'owner@lidyafoodzone.com',
      password: ownerPasswordHash,
      role: Role.OWNER,
    },
  });
  logger.info(`Root OWNER: ${owner.email}`);

  // ─── 2. Create Default Manager ───────────────────────────────────────────
  const managerPasswordHash = await bcrypt.hash(
    process.env.SEED_MANAGER_PASSWORD || 'Manager@2025!',
    12
  );
  const manager = await prisma.user.upsert({
    where: { email: 'manager@lidyafoodzone.com' },
    update: {},
    create: {
      name: 'Leta Manager',
      email: 'manager@lidyafoodzone.com',
      password: managerPasswordHash,
      role: Role.MANAGER,
    },
  });
  logger.info(`Manager: ${manager.email}`);

  // ─── 3. Create Branches ───────────────────────────────────────────────────
  const sodoBranch = await prisma.branch.upsert({
    where: { id: 'branch-sodo-0001-0000-000000000001' },
    update: {},
    create: {
      id: 'branch-sodo-0001-0000-000000000001',
      name: 'Wolaita Sodo',
      label: 'Flagship',
      address: 'Kebele 03, Main Street, Wolaita Sodo, SNNPR, Ethiopia',
      phone: '+251 46 551 2233',
      email: 'sodo@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 7:00 AM - 11:00 PM',
      note: 'The original Lidya Cultural Food Zone',
      capacity: 100,
    },
  });

  const addisBranch = await prisma.branch.upsert({
    where: { id: 'branch-addis-0001-0000-000000000002' },
    update: {},
    create: {
      id: 'branch-addis-0001-0000-000000000002',
      name: 'Addis Ababa',
      label: 'Capital Branch',
      address: 'Bole Road, Near Friendship Square, Addis Ababa, Ethiopia',
      phone: '+251 11 663 4455',
      email: 'addis@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 8:00 AM - 11:30 PM',
      note: 'Our capital outpost bringing Wolaita culture to Addis.',
      capacity: 80,
    },
  });
  logger.info(`Branches seeded: ${sodoBranch.name}, ${addisBranch.name}`);

  // ─── 4. Create Categories ─────────────────────────────────────────────────
  const categoriesData = [
    'Traditional Mains',
    'Coffee Ceremony',
    'Vegetarian & Fasting',
    'Drinks',
  ];
  const categoryMap = new Map<string, string>();

  for (let i = 0; i < categoriesData.length; i++) {
    const cat = await prisma.category.upsert({
      where: { name: categoriesData[i]! },
      update: { order: i },
      create: { name: categoriesData[i]!, order: i },
    });
    categoryMap.set(cat.name, cat.id);
  }
  logger.info('Categories seeded');

  // ─── 5. Create Menu Items ─────────────────────────────────────────────────
  const menuItemsData = [
    {
      name: 'Kitfo',
      cat: 'Traditional Mains',
      desc: 'Minced prime beef seasoned with mitmita and niter kibbeh, served raw, medium, or well done with ayib and gomen.',
      price: '580 ETB',
      tag: 'Signature',
    },
    {
      name: 'Tibs Firfir',
      cat: 'Traditional Mains',
      desc: 'Pan-seared lamb tossed with torn injera, caramelized onions and berbere, served sizzling hot.',
      price: '540 ETB',
      tag: null,
    },
    {
      name: 'Doro Wat',
      cat: 'Traditional Mains',
      desc: 'Slow-braised chicken drumsticks in rich red berbere sauce with hard-boiled eggs and clarified butter.',
      price: '510 ETB',
      tag: 'Heritage',
    },
    {
      name: 'Shiro Beyaynetu',
      cat: 'Vegetarian & Fasting',
      desc: 'Full mesob spread of shiro, misir, tikil gomen and fosolia served on a bed of sour injera.',
      price: '520 ETB',
      tag: 'Fasting',
    },
    {
      name: 'Jebena Buna',
      cat: 'Coffee Ceremony',
      desc: 'Three rounds of freshly roasted Wolaita highland coffee prepared tableside with incense and popcorn.',
      price: '520 ETB',
      tag: 'Ceremony',
    },
    {
      name: 'Soft Drink',
      cat: 'Drinks',
      desc: 'Refreshing assorted soft drinks served chilled.',
      price: '50 ETB',
      tag: null,
    },
    {
      name: 'Lidya Yogurt',
      cat: 'Drinks',
      desc: 'House-made fresh cultural yogurt, soothing and creamy.',
      price: '120 ETB',
      tag: 'Signature',
    },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.upsert({
      where: {
        // Composite uniqueness: name + categoryId (add @@unique to schema if desired)
        // Using a fallback find-or-create approach safe for current schema:
        id: `menu-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-seed`,
      },
      update: {},
      create: {
        id: `menu-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-seed`,
        name: item.name,
        description: item.desc,
        price: item.price,
        tag: item.tag,
        categoryId: categoryMap.get(item.cat)!,
        branchId: null, // Available at all branches
      },
    });
  }
  logger.info('Menu items seeded');

  // ─── 6. Seed Default Website Settings ────────────────────────────────────
  const defaultSettings = [
    { key: 'hero_tagline', value: 'Taste the Heritage of Wolaita' },
    { key: 'hero_subtitle', value: 'A culinary journey through the rich traditions of Southern Ethiopia' },
    { key: 'contact_phone', value: '+251 46 551 2233' },
    { key: 'contact_email', value: 'hello@lidyafoodzone.com' },
    { key: 'social_instagram', value: '' },
    { key: 'social_facebook', value: '' },
  ];

  for (const setting of defaultSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  logger.info('Default website settings seeded');

  logger.info('✅ Database seeding completed successfully!');
  logger.info('');
  logger.info('  OWNER login  →  owner@lidyafoodzone.com  /  ChangeMe@2025!');
  logger.info('  MANAGER login → manager@lidyafoodzone.com /  Manager@2025!');
  logger.info('  ⚠️  Change these passwords immediately after first login!');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

