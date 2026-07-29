import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from '../config/env'; // Load env variables
import { logger } from '../utils/logger';
import { prisma } from './prisma';

async function main() {
  logger.info('Starting database seeding...');

  // ─── 1. Create Root Admin (OWNER) ────────────────────────────────────────
  const ownerPasswordHash = await bcrypt.hash(
    process.env.SEED_OWNER_PASSWORD || 'LetaOwner@2026!',
    12
  );
  const owner = await prisma.user.upsert({
    where: { email: 'letaowner@lidyafoodzone.com' },
    update: {},
    create: {
      name: 'Owner',
      email: 'letaowner@lidyafoodzone.com',
      password: ownerPasswordHash,
      role: Role.OWNER,
    },
  });
  logger.info(`Root OWNER: ${owner.email}`);

  // ─── 2. Create Default Manager ───────────────────────────────────────────
  const managerPasswordHash = await bcrypt.hash(
    process.env.SEED_MANAGER_PASSWORD || 'TemuAdmin@2026!',
    12
  );
  const manager = await prisma.user.upsert({
    where: { email: 'temuadmin@lidyafoodzone.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'temuadmin@lidyafoodzone.com',
      password: managerPasswordHash,
      role: Role.MANAGER,
    },
  });
  logger.info(`Manager: ${manager.email}`);

  // ─── 3. Create Branches ───────────────────────────────────────────────────
  const sodoBranch = await prisma.branch.upsert({
    where: { id: 'branch-sodo-0001-0000-000000000001' },
    update: {
      nameAm: 'ወላይታ ሶዶ',
      labelAm: 'ዋና ቅርንጫፍ',
      workingHoursAm: 'ሰኞ–እሁድ፡ 7:00 ጠዋት – 11:00 ማታ',
      noteAm: 'የመጀመሪያው ልዲያ ካልቸራል ፉድ ዞን',
    },
    create: {
      id: 'branch-sodo-0001-0000-000000000001',
      name: 'Wolaita Sodo',
      nameAm: 'ወላይታ ሶዶ',
      label: 'Flagship',
      labelAm: 'ዋና ቅርንጫፍ',
      address: 'Kebele 03, Main Street, Wolaita Sodo, SNNPR, Ethiopia',
      phone: '+251 46 551 2233',
      email: 'sodo@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 7:00 AM - 11:00 PM',
      workingHoursAm: 'ሰኞ–እሁድ፡ 7:00 ጠዋት – 11:00 ማታ',
      note: 'The original Lidya Cultural Food Zone',
      noteAm: 'የመጀመሪያው ልዲያ ካልቸራል ፉድ ዞን',
      capacity: 100,
    },
  });

  const addisBranch = await prisma.branch.upsert({
    where: { id: 'branch-addis-0001-0000-000000000002' },
    update: {
      nameAm: 'አዲስ አበባ',
      labelAm: 'የዋና ከተማ ቅርንጫፍ',
      workingHoursAm: 'ሰኞ–እሁድ፡ 8:00 ጠዋት – 11:30 ማታ',
      noteAm: 'የወላይታን ባህል ወደ አዲስ አበባ የሚያመጣ ቅርንጫፋችን።',
    },
    create: {
      id: 'branch-addis-0001-0000-000000000002',
      name: 'Addis Ababa',
      nameAm: 'አዲስ አበባ',
      label: 'Capital Branch',
      labelAm: 'የዋና ከተማ ቅርንጫፍ',
      address: 'Bole Road, Near Friendship Square, Addis Ababa, Ethiopia',
      phone: '+251 11 663 4455',
      email: 'addis@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 8:00 AM - 11:30 PM',
      workingHoursAm: 'ሰኞ–እሁድ፡ 8:00 ጠዋት – 11:30 ማታ',
      note: 'Our capital outpost bringing Wolaita culture to Addis.',
      noteAm: 'የወላይታን ባህል ወደ አዲስ አበባ የሚያመጣ ቅርንጫፋችን።',
      capacity: 80,
    },
  });
  logger.info(`Branches seeded: ${sodoBranch.name}, ${addisBranch.name}`);

  // ─── 4. Create Categories (nested) ────────────────────────────────────────
  const categoryMap = new Map<string, string>();

  // Two major classes only: "Food" (first) then "Drinks". Each is a parent that
  // groups its sub-categories.
  const topLevelCategories = [
    { name: 'Food', nameAm: 'ምግብ', order: 0 },
    { name: 'Drinks', nameAm: 'መጠጦች', order: 1 },
  ];

  for (const cat of topLevelCategories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { nameAm: cat.nameAm, order: cat.order, parentId: null, deletedAt: null },
      create: { name: cat.name, nameAm: cat.nameAm, order: cat.order },
    });
    categoryMap.set(cat.name, created.id);
  }

  const foodId = categoryMap.get('Food')!;
  const drinksId = categoryMap.get('Drinks')!;

  // Sub-categories nested under "Food".
  const foodSubCategories = [
    { name: 'Breakfast', nameAm: 'ቁርስ', order: 0 },
    { name: 'Lunch and Dinner', nameAm: 'ምሳ እና እራት', order: 1 },
    { name: 'Desserts', nameAm: 'ጣፋጮች', order: 2 },
  ];

  for (const sub of foodSubCategories) {
    const created = await prisma.category.upsert({
      where: { name: sub.name },
      update: { nameAm: sub.nameAm, order: sub.order, parentId: foodId, deletedAt: null },
      create: { name: sub.name, nameAm: sub.nameAm, order: sub.order, parentId: foodId },
    });
    categoryMap.set(sub.name, created.id);
  }

  // Sub-categories nested under "Drinks".
  const drinkSubCategories = [
    { name: 'Hot Drinks', nameAm: 'ትኩስ መጠጦች', order: 0 },
    { name: 'Soft Drinks', nameAm: 'ለስላሳ መጠጦች', order: 1 },
    { name: 'Lidya Coffee', nameAm: 'ልዲያ ቡና', order: 2 },
  ];

  for (const sub of drinkSubCategories) {
    const created = await prisma.category.upsert({
      where: { name: sub.name },
      update: { nameAm: sub.nameAm, order: sub.order, parentId: drinksId, deletedAt: null },
      create: { name: sub.name, nameAm: sub.nameAm, order: sub.order, parentId: drinksId },
    });
    categoryMap.set(sub.name, created.id);
  }

  // Retire legacy categories from earlier seeds (soft-deleted so they drop out
  // of the API but existing data is preserved). Menu items are remapped below.
  await prisma.category.updateMany({
    where: { name: { in: ['Traditional Mains', 'Coffee Ceremony', 'Vegetarian & Fasting'] } },
    data: { deletedAt: new Date() },
  });

  logger.info('Categories seeded (nested)');

  // ─── 5. Create Menu Items ─────────────────────────────────────────────────
  const menuItemsData = [
    {
      name: 'Kitfo',
      nameAm: 'ክትፎ',
      cat: 'Lunch and Dinner',
      desc: 'Minced prime beef seasoned with mitmita and niter kibbeh, served raw, medium, or well done with ayib and gomen.',
      descAm: 'በሚጥሚጣና በንጥር ቅቤ የተቀመመ የተከተፈ የበሬ ስጋ፣ ጥሬ፣ ለብ ወይም ብስል ሆኖ ከአይብና ጎመን ጋር ይቀርባል።',
      price: '580 ETB',
      tag: 'Signature',
    },
    {
      name: 'Tibs Firfir',
      nameAm: 'ጥብስ ፍርፍር',
      cat: 'Lunch and Dinner',
      desc: 'Pan-seared lamb tossed with torn injera, caramelized onions and berbere, served sizzling hot.',
      descAm: 'የተጠበሰ የበግ ስጋ ከተቆራረጠ እንጀራ፣ ከተጠበሰ ሽንኩርትና በርበሬ ጋር ተማስሎ፣ ትኩስ ሆኖ ይቀርባል።',
      price: '540 ETB',
      tag: null,
    },
    {
      name: 'Doro Wat',
      nameAm: 'ዶሮ ወጥ',
      cat: 'Lunch and Dinner',
      desc: 'Slow-braised chicken drumsticks in rich red berbere sauce with hard-boiled eggs and clarified butter.',
      descAm: 'በበርበሬ ወጥ ቀስ ብሎ የበሰለ የዶሮ ስጋ ከተቀቀለ እንቁላልና ንጥር ቅቤ ጋር።',
      price: '510 ETB',
      tag: 'Heritage',
    },
    {
      name: 'Shiro Beyaynetu',
      nameAm: 'ሽሮ በያይነቱ',
      cat: 'Lunch and Dinner',
      desc: 'Full mesob spread of shiro, misir, tikil gomen and fosolia served on a bed of sour injera.',
      descAm: 'ሙሉ የመሶብ ድግስ — ሽሮ፣ ምስር፣ ጥቅል ጎመንና ፎሶሊያ በኮመጠጠ እንጀራ ላይ ይቀርባል።',
      price: '520 ETB',
      tag: 'Fasting',
    },
    {
      name: 'Jebena Buna',
      nameAm: 'ጀበና ቡና',
      cat: 'Lidya Coffee',
      desc: 'Three rounds of freshly roasted Wolaita highland coffee prepared tableside with incense and popcorn.',
      descAm: 'ሦስት ዙር አዲስ የተጠበሰ የወላይታ ደጋ ቡና በጠረጴዛ አጠገብ ከጤስና ፋንዲሻ ጋር ይዘጋጃል።',
      price: '520 ETB',
      tag: 'Ceremony',
    },
    {
      name: 'Soft Drink',
      nameAm: 'ለስላሳ መጠጥ',
      cat: 'Soft Drinks',
      desc: 'Refreshing assorted soft drinks served chilled.',
      descAm: 'የተለያዩ ቀዝቃዛ ለስላሳ መጠጦች።',
      price: '50 ETB',
      tag: null,
    },
    {
      name: 'Lidya Yogurt',
      nameAm: 'የልዲያ እርጎ',
      cat: 'Desserts',
      desc: 'House-made fresh cultural yogurt, soothing and creamy.',
      descAm: 'በቤት ውስጥ የተሰራ ትኩስ ባህላዊ እርጎ፣ ለስላሳና ክሬማ።',
      price: '120 ETB',
      tag: 'Signature',
    },
  ];

  for (const item of menuItemsData) {
    const id = `menu-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-seed`;
    const categoryId = categoryMap.get(item.cat)!;
    await prisma.menuItem.upsert({
      where: { id },
      // Remap category and refresh fields on re-seed so existing rows move to
      // the new category structure instead of staying on retired categories.
      update: {
        name: item.name,
        nameAm: item.nameAm,
        description: item.desc,
        descriptionAm: item.descAm,
        price: item.price,
        tag: item.tag,
        categoryId,
        deletedAt: null,
      },
      create: {
        id,
        name: item.name,
        nameAm: item.nameAm,
        description: item.desc,
        descriptionAm: item.descAm,
        price: item.price,
        tag: item.tag,
        categoryId,
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

  // ─── 7. Seed Starter Testimonials ────────────────────────────────────────
  // These are editable/replaceable in the admin dashboard once real guests are added.
  const testimonialsData = [
    {
      name: 'Abebe Girma',
      role: 'Food Writer, Addis Fortune',
      quote:
        "Lidya doesn't just serve food — it curates an encounter with Wolaita heritage. The kitfo alone is reason enough to drive from Addis.",
      order: 0,
    },
    {
      name: 'Sara Bekele',
      role: 'Travel Blogger, @sara_wanderseth',
      quote:
        "I've traveled across Ethiopia and nothing compares to the warmth of Lidya's coffee ceremony. The mesob seating, the incense — pure magic.",
      order: 1,
    },
    {
      name: 'Tadesse Woldemariam',
      role: 'Wolaita Sodo resident, regular guest',
      quote:
        'This is the place that makes us proud of our culture. Lidya represents Wolaita to the world better than any museum could.',
      order: 2,
    },
    {
      name: 'Dr. Meron Haile',
      role: 'Researcher, Addis Ababa University',
      quote:
        'For my students visiting from abroad, Lidya is the first place I take them. Authentic, dignified, and absolutely delicious.',
      order: 3,
    },
  ];

  for (const testimonial of testimonialsData) {
    const id = `testimonial-${testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-seed`;
    await prisma.testimonial.upsert({
      where: { id },
      update: {},
      create: { id, ...testimonial, rating: 5, isActive: true },
    });
  }
  logger.info('Starter testimonials seeded');

  logger.info('✅ Database seeding completed successfully!');
  logger.info('');
  logger.info('  OWNER login  →  letaowner@lidyafoodzone.com  /  LetaOwner@2026!');
  logger.info('  MANAGER login → temuadmin@lidyafoodzone.com /  TemuAdmin@2026!');
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

