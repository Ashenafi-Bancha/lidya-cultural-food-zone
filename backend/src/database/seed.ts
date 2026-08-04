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

  // ─── 3. Create Branches (order: Addis Ababa, Wolaita Sodo 1, Wolaita Sodo 2)─
  // Branches are listed by createdAt asc, so create Addis first.
  const addisCreatedAt = new Date('2020-01-01T00:00:00Z');
  const sodo1CreatedAt = new Date('2020-01-02T00:00:00Z');
  const sodo2CreatedAt = new Date('2020-01-03T00:00:00Z');

  const addisBranch = await prisma.branch.upsert({
    where: { id: 'branch-addis-0001-0000-000000000002' },
    update: {
      name: 'Addis Ababa',
      nameAm: 'አዲስ አበባ',
      label: 'Capital Branch',
      labelAm: 'የዋና ከተማ ቅርንጫፍ',
      address: 'Lebu, Music Sefer, Addis Ababa, Ethiopia',
      workingHoursAm: 'ሰኞ–እሁድ፡ 8:00 ጠዋት – 11:30 ማታ',
      noteAm: 'የኢትዮጵያን ባህላዊ ምግቦች ወደ አዲስ አበባ የሚያመጣ ቅርንጫፋችን።',
      createdAt: addisCreatedAt,
    },
    create: {
      id: 'branch-addis-0001-0000-000000000002',
      name: 'Addis Ababa',
      nameAm: 'አዲስ አበባ',
      label: 'Capital Branch',
      labelAm: 'የዋና ከተማ ቅርንጫፍ',
      address: 'Lebu, Music Sefer, Addis Ababa, Ethiopia',
      phone: '+251 11 663 4455',
      email: 'addis@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 8:00 AM - 11:30 PM',
      workingHoursAm: 'ሰኞ–እሁድ፡ 8:00 ጠዋት – 11:30 ማታ',
      note: 'Our capital outpost bringing the cultural cuisines of Ethiopia to Addis Ababa.',
      noteAm: 'የኢትዮጵያን ባህላዊ ምግቦች ወደ አዲስ አበባ የሚያመጣ ቅርንጫፋችን።',
      capacity: 80,
      createdAt: addisCreatedAt,
    },
  });

  const sodo1Branch = await prisma.branch.upsert({
    where: { id: 'branch-sodo-0001-0000-000000000001' },
    update: {
      name: 'Wolaita Sodo 1',
      nameAm: 'ወላይታ ሶዶ 1',
      label: 'Flagship',
      labelAm: 'ዋና ቅርንጫፍ',
      workingHoursAm: 'ሰኞ–እሁድ፡ 7:00 ጠዋት – 11:00 ማታ',
      noteAm: 'የመጀመሪያው ልዲያ ካልቸራል ፉድ ዞን።',
      createdAt: sodo1CreatedAt,
    },
    create: {
      id: 'branch-sodo-0001-0000-000000000001',
      name: 'Wolaita Sodo 1',
      nameAm: 'ወላይታ ሶዶ 1',
      label: 'Flagship',
      labelAm: 'ዋና ቅርንጫፍ',
      address: 'Green Land Area, Wolaita Sodo, Ethiopia',
      phone: '+251 46 551 2233',
      email: 'sodo@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 7:00 AM - 11:00 PM',
      workingHoursAm: 'ሰኞ–እሁድ፡ 7:00 ጠዋት – 11:00 ማታ',
      note: 'The original Lidya Cultural Food Zone.',
      noteAm: 'የመጀመሪያው ልዲያ ካልቸራል ፉድ ዞን።',
      capacity: 100,
      createdAt: sodo1CreatedAt,
    },
  });

  const sodo2Branch = await prisma.branch.upsert({
    where: { id: 'branch-sodo-0002-0000-000000000003' },
    update: {
      name: 'Wolaita Sodo 2',
      nameAm: 'ወላይታ ሶዶ 2',
      label: 'Wolaita Sodo',
      labelAm: 'ወላይታ ሶዶ',
      noteAm: 'ሁለተኛው የወላይታ ሶዶ ቅርንጫፍ።',
      createdAt: sodo2CreatedAt,
    },
    create: {
      id: 'branch-sodo-0002-0000-000000000003',
      name: 'Wolaita Sodo 2',
      nameAm: 'ወላይታ ሶዶ 2',
      label: 'Wolaita Sodo',
      labelAm: 'ወላይታ ሶዶ',
      address: 'Wolaita Sodo, Ethiopia',
      phone: '+251 46 551 2244',
      email: 'sodo2@lidyafoodzone.com',
      workingHours: 'Mon-Sun: 7:00 AM - 11:00 PM',
      workingHoursAm: 'ሰኞ–እሁድ፡ 7:00 ጠዋት – 11:00 ማታ',
      note: 'Our second home in Wolaita Sodo.',
      noteAm: 'ሁለተኛው የወላይታ ሶዶ ቅርንጫፍ።',
      capacity: 80,
      createdAt: sodo2CreatedAt,
    },
  });
  logger.info(`Branches seeded: ${addisBranch.name}, ${sodo1Branch.name}, ${sodo2Branch.name}`);

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
      desc: 'Freshly roasted Ethiopian highland coffee prepared tableside with incense and popcorn.',
      descAm: 'አዲስ የተጠበሰ የኢትዮጵያ ደጋ ቡና በጠረጴዛ አጠገብ ከጤስና ፋንዲሻ ጋር ይዘጋጃል።',
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
    { key: 'hero_tagline', value: 'Taste the Heritage of Ethiopia' },
    { key: 'hero_subtitle', value: 'A culinary journey through the rich traditions of Ethiopia' },
    { key: 'contact_phone', value: '+251 92 099 4499' },
    { key: 'contact_email', value: 'info@lidyaculturalfood.com' },
    { key: 'social_instagram', value: '' },
    { key: 'social_facebook', value: 'https://web.facebook.com/Lidyaculturalfoodzoneandcatering' },
  ];

  for (const setting of defaultSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  logger.info('Default website settings seeded');

  // ─── 6b. Seed Gallery (26 photos; images ship in the repo under /uploads) ─
  // Mirrors the frontend-bundled gallery so a fresh deploy starts fully
  // populated and stays admin-manageable. update:{} preserves admin edits.
  const galleryData: Array<{
    id: string; file: string; group: string; span: string;
    title: string; titleAm: string; description: string; descriptionAm: string; alt: string;
  }> = [
    { id: 'gallery-orig-1', file: 'gallery_orig-1', group: 'MOMENTS', span: 'col-span-2 row-span-2',
      title: 'Addis Ababa Branch Opening', titleAm: 'የአዲስ አበባ ቅርንጫፍ ምረቃ',
      description: "The grand opening of our Addis Ababa branch — carrying the warmth of Ethiopia's cultural cuisine to the capital.",
      descriptionAm: 'የአዲስ አበባ ቅርንጫፋችን ታላቅ ምረቃ — የኢትዮጵያን ባህላዊ ምግብ ሙቀት ወደ ዋና ከተማ ማምጣት።',
      alt: 'Addis Ababa branch opening ceremony at Lidya Cultural Food Zone' },
    { id: 'gallery-orig-2', file: 'gallery_orig-2', group: 'MOMENTS', span: 'col-span-2 row-span-1',
      title: 'Inside Lidya', titleAm: 'ልዲያ ውስጥ',
      description: 'A warm, welcoming space wrapped in Ethiopian colour and hospitality.',
      descriptionAm: 'በኢትዮጵያ ቀለምና እንግዳ ተቀባይነት የተከበበ ሞቅ ያለ ቦታ።',
      alt: 'Interior dining hall at Lidya Cultural Food Zone' },
    { id: 'gallery-orig-3', file: 'gallery_orig-3', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'A Cultural Setting', titleAm: 'ባህላዊ ድባብ',
      description: 'Every corner tells a story of Ethiopian heritage and pride.',
      descriptionAm: 'እያንዳንዱ ጥግ የኢትዮጵያን ቅርስና ኩራት ታሪክ ይተርካል።',
      alt: 'Cultural decor and setting at Lidya' },
    { id: 'gallery-orig-4', file: 'gallery_orig-4', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'A Warm Welcome', titleAm: 'ሞቅ ያለ አቀባበል',
      description: 'Genuine Ethiopian hospitality, offered from the heart.',
      descriptionAm: 'ከልብ የሚቀርብ እውነተኛ የኢትዮጵያ እንግዳ ተቀባይነት።',
      alt: 'Warm welcome and hospitality at Lidya' },
    { id: 'gallery-fe-1', file: 'gallery_fe-1', group: 'MOMENTS', span: 'col-span-2 row-span-1',
      title: 'A Welcome in Woven Colours', titleAm: 'በሽመና ቀለማት የታጀበ አቀባበል',
      description: 'Guests draped in traditional woven scarves gather at the entrance, roses in hand — the Lidya welcome begins before the first bite.',
      descriptionAm: 'እንግዶች ባህላዊ የሽመና ሻርፕ ለብሰው በመግቢያው ላይ ተሰብስበዋል — የልዲያ አቀባበል ከመጀመሪያው ጉርሻ በፊት ይጀምራል።',
      alt: 'Guests wearing traditional woven scarves welcomed at the entrance of Lidya' },
    { id: 'gallery-fe-2', file: 'gallery_fe-2', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'Gathered in Celebration', titleAm: 'ለክብረ በዓል ተሰባስበው',
      description: 'Friends and guests come together before the hand-painted cultural mural — every visit becomes a celebration.',
      descriptionAm: 'ወዳጆችና እንግዶች በእጅ በተሳለው ባህላዊ ሥዕል ፊት ተሰባስበዋል — እያንዳንዱ ጉብኝት ክብረ በዓል ይሆናል።',
      alt: 'Group of guests posing before the cultural mural at Lidya' },
    { id: 'gallery-fe-3', file: 'gallery_fe-3', group: 'MOMENTS', span: 'col-span-1 row-span-2',
      title: 'Honoured in Tradition', titleAm: 'በባህል የተከበሩ',
      description: 'Honoured guests wrapped in vivid hand-woven shawls beneath woven basket lanterns — tradition worn with pride.',
      descriptionAm: 'የተከበሩ እንግዶች ደማቅ የእጅ ሽመና ጋቢ ለብሰው በተሸመኑ የቅርጫት መብራቶች ስር — ባህል በኩራት ይለበሳል።',
      alt: 'Two guests draped in vivid traditional woven shawls at Lidya' },
    { id: 'gallery-fe-6', file: 'gallery_fe-6', group: 'MOMENTS', span: 'col-span-2 row-span-1',
      title: 'Welcomed at the Door', titleAm: 'በበሩ ላይ የተደረገ አቀባበል',
      description: 'Guests received beneath the welcome banner, with woven mesobs and traditional displays lining the entrance.',
      descriptionAm: 'እንግዶች በእንኳን ደህና መጡ ባነር ስር ተቀብለዋል፣ የተሸመኑ መሶቦችና ባህላዊ ማሳያዎች መግቢያውን አስውበዋል።',
      alt: 'Guests standing at the decorated entrance of Lidya under the welcome banner' },
    { id: 'gallery-fe-8', file: 'gallery_fe-8', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'The Sound of the Horns', titleAm: 'የቀንደ መለከቱ ድምፅ',
      description: 'Traditional horn players in embroidered vests sound the long bamboo trumpets — music that has welcomed guests for generations.',
      descriptionAm: 'ባህላዊ የመለከት ተጫዋቾች የተጠለፈ ሸሚዝ ለብሰው ረጃጅም የቀርከሃ መለከቶችን ይነፋሉ — ለትውልዶች እንግዶችን የተቀበለ ሙዚቃ።',
      alt: 'Musicians playing long traditional bamboo horns at Lidya' },
    { id: 'gallery-fe-9', file: 'gallery_fe-9', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'Applause of Welcome', titleAm: 'የአቀባበል ጭብጨባ',
      description: 'Clapping hands and warm smiles in the street — the neighbourhood joins the celebration.',
      descriptionAm: 'ጭብጨባና ሞቅ ያለ ፈገግታ በመንገዱ ላይ — ሰፈሩ ከክብረ በዓሉ ጋር ይቀላቀላል።',
      alt: 'Guests clapping in welcome outside Lidya' },
    { id: 'gallery-fe-10', file: 'gallery_fe-10', group: 'MOMENTS', span: 'col-span-1 row-span-2',
      title: 'Dressed for the Occasion', titleAm: 'ለበዓሉ የተዋቡ',
      description: 'A couple on the red carpet — she in a hand-embroidered habesha kemis, welcomed beneath the Lidya banner.',
      descriptionAm: 'ጥንዶች በቀይ ምንጣፍ ላይ — እሷ በእጅ የተጠለፈ የሀበሻ ቀሚስ ለብሳ፣ በልዲያ ባነር ስር ተቀብለዋል።',
      alt: 'Couple in elegant traditional dress on the red carpet at Lidya' },
    { id: 'gallery-fe-12', file: 'gallery_fe-12', group: 'MOMENTS', span: 'col-span-1 row-span-2',
      title: 'Guests of Honour', titleAm: 'የክብር እንግዶች',
      description: 'Elegant guests before the welcome wall — every arrival at Lidya is received like family.',
      descriptionAm: 'የተዋቡ እንግዶች በእንኳን ደህና መጡ ግድግዳ ፊት — በልዲያ እያንዳንዱ መምጣት እንደ ቤተሰብ ይቀበላል።',
      alt: 'Three elegantly dressed guests before the welcome banner at Lidya' },
    { id: 'gallery-fe-14', file: 'gallery_fe-14', group: 'MOMENTS', span: 'col-span-2 row-span-2',
      title: 'A Grand Cultural Welcome', titleAm: 'ታላቅ ባህላዊ አቀባበል',
      description: 'Dancers in fringed traditional dress, flute players, and a flower-crowned tent before the thatched entrance — a full ceremonial welcome at Lidya.',
      descriptionAm: 'የተንዘረዘረ ባህላዊ ልብስ የለበሱ ጨፋሪዎች፣ የዋሽንት ተጫዋቾችና በአበባ የተጌጠ ድንኳን በሳር ክዳን መግቢያው ፊት — በልዲያ የተሟላ ባህላዊ አቀባበል።',
      alt: 'Traditional dancers and musicians performing a ceremonial welcome outside Lidya' },
    { id: 'gallery-fe-15', file: 'gallery_fe-15', group: 'MOMENTS', span: 'col-span-1 row-span-1',
      title: 'The Embrace of Friendship', titleAm: 'የወዳጅነት እቅፍ',
      description: 'Old friends reunite with an embrace before the cultural mural — Lidya is where people find each other again.',
      descriptionAm: 'የቆዩ ወዳጆች በባህላዊው ሥዕል ፊት በእቅፍ ተገናኙ — ልዲያ ሰዎች እርስ በርስ የሚገናኙበት ስፍራ ነው።',
      alt: 'Guests embracing in greeting inside Lidya' },
    { id: 'gallery-fe-16', file: 'gallery_fe-16', group: 'MOMENTS', span: 'col-span-1 row-span-2',
      title: 'Roses at the Door', titleAm: 'ጽጌረዳዎች በበሩ ላይ',
      description: 'A hostess in white cultural dress offers a woven basket of roses beneath the blossom wall — beauty in every detail of the welcome.',
      descriptionAm: 'ነጭ ባህላዊ ቀሚስ የለበሰች አስተናጋጅ ከአበባ ግድግዳው ስር የጽጌረዳ ቅርጫት ታቀርባለች — በአቀባበሉ እያንዳንዱ ዝርዝር ውስጥ ውበት።',
      alt: 'Hostess in traditional dress holding a basket of roses at Lidya' },
    { id: 'gallery-fe-17', file: 'gallery_fe-17', group: 'MOMENTS', span: 'col-span-2 row-span-1',
      title: 'An Evening of Elegance', titleAm: 'የውበት ምሽት',
      description: 'Guests dressed for a special evening arrive along the red carpet — celebrations at Lidya always begin in style.',
      descriptionAm: 'ለልዩ ምሽት የተዋቡ እንግዶች በቀይ ምንጣፍ ላይ ይደርሳሉ — በልዲያ ክብረ በዓላት ሁሌም በውበት ይጀምራሉ።',
      alt: 'Elegantly dressed guests arriving at Lidya' },
    { id: 'gallery-orig-5', file: 'gallery_orig-5', group: 'LIFE', span: 'col-span-2 row-span-1',
      title: 'Gathered as Guests', titleAm: 'እንደ እንግዳ ተሰብስበው',
      description: 'Friends and family sharing food, story, and the joy of the table.',
      descriptionAm: 'ጓደኞችና ቤተሰብ ምግብ፣ ወግና የማዕድ ደስታ ሲጋሩ።',
      alt: 'Guests sharing a meal at Lidya' },
    { id: 'gallery-orig-6', file: 'gallery_orig-6', group: 'LIFE', span: 'col-span-2 row-span-1',
      title: 'Life in the VIP Lounge', titleAm: 'በVIP ማረፊያ ውስጥ ያለ ሕይወት',
      description: 'Premium comfort and celebration in our VIP experience.',
      descriptionAm: 'በVIP ተሞክሮአችን ውስጥ ልዩ ምቾትና ደስታ።',
      alt: 'Life at Lidya VIP lounge' },
    { id: 'gallery-fe-4', file: 'gallery_fe-4', group: 'LIFE', span: 'col-span-1 row-span-2',
      title: 'Friendship at Lidya', titleAm: 'ወዳጅነት በልዲያ',
      description: 'Smiles beside modern Ethiopian art — the dining room where friendships are made and renewed.',
      descriptionAm: 'ከዘመናዊ የኢትዮጵያ ሥዕል አጠገብ ፈገግታ — ወዳጅነት የሚፈጠርበትና የሚታደስበት የመመገቢያ አዳራሽ።',
      alt: 'Two smiling friends beside modern Ethiopian artwork inside Lidya' },
    { id: 'gallery-fe-5', file: 'gallery_fe-5', group: 'LIFE', span: 'col-span-1 row-span-1',
      title: 'Conversations in the Lounge', titleAm: 'በእንግዳ ማረፊያው ውስጥ ጭውውት',
      description: 'Unhurried conversation in the lounge — hospitality at Lidya means time is always on the menu.',
      descriptionAm: 'በእንግዳ ማረፊያው ያልተቸኮለ ጭውውት — በልዲያ እንግዳ ተቀባይነት ማለት ጊዜ ሁሌም ከምናሌው ላይ ነው።',
      alt: 'Guests in relaxed conversation in the lounge at Lidya' },
    { id: 'gallery-fe-7', file: 'gallery_fe-7', group: 'LIFE', span: 'col-span-2 row-span-1',
      title: 'Style Meets Heritage', titleAm: 'ዘመናዊነት ከቅርስ ጋር',
      description: 'Modern style and woven heritage side by side — at Lidya, every generation finds its place.',
      descriptionAm: 'ዘመናዊ ስልትና የሽመና ቅርስ ጎን ለጎን — በልዲያ እያንዳንዱ ትውልድ ቦታውን ያገኛል።',
      alt: 'Guests in modern and traditional dress before the mural at Lidya' },
    { id: 'gallery-fe-11', file: 'gallery_fe-11', group: 'LIFE', span: 'col-span-1 row-span-2',
      title: 'Smiles of the House', titleAm: 'የቤቱ ፈገግታዎች',
      description: 'Woven scarves, embroidered jackets, and easy laughter — the everyday joy of an evening at Lidya.',
      descriptionAm: 'የሽመና ሻርፕ፣ የተጠለፉ ጃኬቶችና ቀላል ሳቅ — በልዲያ ምሽት ያለው የየቀኑ ደስታ።',
      alt: 'Two smiling guests in traditional attire inside Lidya' },
    { id: 'gallery-fe-13', file: 'gallery_fe-13', group: 'LIFE', span: 'col-span-1 row-span-2',
      title: 'An Evening at Lidya', titleAm: 'ምሽት በልዲያ',
      description: 'Under handwoven lanterns, a guest pauses between courses — quiet style in a warm cultural room.',
      descriptionAm: 'በእጅ በተሸመኑ መብራቶች ስር አንድ እንግዳ በምግቦች መካከል ቆም ብሏል — በሞቃት ባህላዊ አዳራሽ ውስጥ ጸጥ ያለ ውበት።',
      alt: 'Guest with cultural scarf standing in the warm dining room of Lidya' },
    { id: 'gallery-fe-18', file: 'gallery_fe-18', group: 'LIFE', span: 'col-span-1 row-span-2',
      title: 'A Table of Ethiopia', titleAm: 'የኢትዮጵያ ገበታ',
      description: 'Hostesses in cultural dress present clay bowls of traditional dishes beside the jebena — the flavours of Ethiopia laid out in colour.',
      descriptionAm: 'ባህላዊ ልብስ የለበሱ አስተናጋጆች ከጀበናው አጠገብ የሸክላ ሳህኖችን በባህላዊ ምግቦች ሞልተው ያቀርባሉ — የኢትዮጵያ ጣዕሞች በቀለም ተዘርግተዋል።',
      alt: 'Hostesses presenting traditional Ethiopian dishes in clay bowls at Lidya' },
    { id: 'gallery-fe-19', file: 'gallery_fe-19', group: 'LIFE', span: 'col-span-2 row-span-2',
      title: 'Sisters Around the Mesob', titleAm: 'እህቶች በመሶቡ ዙሪያ',
      description: 'Four friends in traditional dress share injera from a bright woven mesob beneath the thatched hut — dining as Ethiopia has always known it: together.',
      descriptionAm: 'አራት ወዳጆች ባህላዊ ልብስ ለብሰው ከሳር ጎጆው ስር ከደማቅ የተሸመነ መሶብ እንጀራ ይጋራሉ — ኢትዮጵያ ሁሌም እንደምታውቀው አመጋገብ፦ በአንድነት።',
      alt: 'Four women in traditional dress sharing food from a woven mesob at Lidya' },
    { id: 'gallery-fe-20', file: 'gallery_fe-20', group: 'LIFE', span: 'col-span-1 row-span-1',
      title: 'Honoured Guests at Home', titleAm: 'የክብር እንግዶች እንደ ቤታቸው',
      description: 'Honoured guests share a quiet moment together — at Lidya, every guest is received as family.',
      descriptionAm: 'የክብር እንግዶች ጸጥ ያለ ጊዜ አብረው ያሳልፋሉ — በልዲያ እያንዳንዱ እንግዳ እንደ ቤተሰብ ይቀበላል።',
      alt: 'Honoured guests seated together at Lidya' },
  ];

  // Public gallery sorts createdAt desc — stamp descending so the array order
  // above is the display order.
  const galleryBase = new Date('2020-02-01T00:00:00Z').getTime();
  for (let i = 0; i < galleryData.length; i++) {
    const g = galleryData[i];
    const createdAt = new Date(galleryBase + (galleryData.length - i) * 60_000);
    await prisma.galleryItem.upsert({
      where: { id: g.id },
      update: {}, // preserve admin edits on re-seed
      create: {
        id: g.id, title: g.title, titleAm: g.titleAm,
        description: g.description, descriptionAm: g.descriptionAm,
        imageUrl: `/uploads/${g.file}.webp`, thumbUrl: `/uploads/${g.file}_thumb.webp`,
        span: g.span, group: g.group, alt: g.alt, createdAt,
      },
    });
  }
  // Retire the legacy locally-imported rows superseded by gallery-orig-*.
  await prisma.galleryItem.updateMany({
    where: { id: { startsWith: 'gallery-import-' }, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  logger.info(`Gallery seeded: ${galleryData.length} photos`);

  // ─── 7. Seed Starter Testimonials ────────────────────────────────────────
  // These are editable/replaceable in the admin dashboard once real guests are added.
  const testimonialsData = [
    { id: 'ts-guest-1', name: 'Haile Gebreselassie', order: 0,
      quote: "Dining at Lidya Cultural Food Zone was an unforgettable experience. The traditional Ethiopian dishes were incredibly delicious, the atmosphere was warm and authentic, and the hospitality made us feel like family. I can't wait to visit again!" },
    { id: 'ts-guest-2', name: 'Adonay Berhane (Mada)', order: 1,
      quote: "Every meal at Lidya tells a story of Ethiopian culture and tradition. The flavors are rich, the service is exceptional, and the cultural atmosphere makes every visit truly special. I highly recommend it to anyone looking for an authentic dining experience." },
    { id: 'ts-guest-3', name: 'Gildo Kassa', order: 2,
      quote: "Lidya Cultural Food Zone exceeded all my expectations. From the beautifully prepared food to the welcoming staff and vibrant cultural setting, everything was perfect. It's the first place I recommend to friends and visitors." },
    { id: 'ts-guest-4', name: 'Bereket Geberewa', order: 3,
      quote: "The food was absolutely amazing, the traditional coffee ceremony was unforgettable, and every detail reflected genuine Ethiopian hospitality. Lidya is more than a restaurant — it's a cultural experience worth sharing." },
    { id: 'ts-guest-5', name: 'Master Abinet', order: 4,
      quote: "If you want to experience the true taste of Ethiopia, Lidya Cultural Food Zone is the place to be. The fresh ingredients, authentic recipes, and friendly service make every visit memorable. I will definitely be coming back." },
    { id: 'ts-guest-6', name: 'K Money', order: 5,
      quote: "From the moment we walked in, we felt welcomed with genuine warmth. The food was exceptional, the cultural ambiance was beautiful, and every dish was prepared with care. Lidya is a destination everyone should experience at least once." },
  ];

  // Photos for the first four guests ship in the repo under /uploads.
  const testimonialPhotos: Record<string, string> = {
    'ts-guest-1': '/uploads/testimonial_ts-guest-1.webp',
    'ts-guest-2': '/uploads/testimonial_ts-guest-2.webp',
    'ts-guest-3': '/uploads/testimonial_ts-guest-3.webp',
    'ts-guest-4': '/uploads/testimonial_ts-guest-4.webp',
  };

  for (const { id, ...rest } of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id },
      update: {}, // preserve any admin edits / uploaded photos on re-seed
      create: { id, ...rest, rating: 5, isActive: true, imageUrl: testimonialPhotos[id] ?? null },
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

