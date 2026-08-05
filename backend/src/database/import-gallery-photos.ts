/**
 * One-off: import the 20 client photos from frontend/src/imports/gallery into
 * the gallery DB. Each image is optimized with sharp (WebP main + thumb) and
 * saved under /uploads. Idempotent — stable ids, re-running refreshes metadata.
 *
 * Run:  npx tsx src/database/import-gallery-photos.ts
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

const srcDir = path.join(process.cwd(), '..', 'frontend', 'src', 'imports', 'gallery');
const uploadsDir = path.join(process.cwd(), 'uploads');

interface Item {
  n: number;
  file: string;
  group: 'MOMENTS' | 'LIFE';
  span: string;
  title: string;
  titleAm: string;
  description: string;
  descriptionAm: string;
  alt: string;
}

const ITEMS: Item[] = [
  {
    n: 1, file: 'gallery-1.JPG', group: 'MOMENTS', span: 'col-span-2 row-span-1',
    title: 'A Welcome in Woven Colours',
    titleAm: 'በሽመና ቀለማት የታጀበ አቀባበል',
    description: 'Guests draped in traditional woven scarves gather at the entrance, roses in hand — the Lidya welcome begins before the first bite.',
    descriptionAm: 'እንግዶች ባህላዊ የሽመና ሻርፕ ለብሰው በመግቢያው ላይ ተሰብስበዋል — የሊዲያ አቀባበል ከመጀመሪያው ጉርሻ በፊት ይጀምራል።',
    alt: 'Guests wearing traditional woven scarves welcomed at the entrance of Lidya',
  },
  {
    n: 2, file: 'gallery-2.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-1',
    title: 'Gathered in Celebration',
    titleAm: 'ለክብረ በዓል ተሰባስበው',
    description: 'Friends and guests come together before the hand-painted cultural mural — every visit becomes a celebration.',
    descriptionAm: 'ወዳጆችና እንግዶች በእጅ በተሳለው ባህላዊ ሥዕል ፊት ተሰባስበዋል — እያንዳንዱ ጉብኝት ክብረ በዓል ይሆናል።',
    alt: 'Group of guests posing before the cultural mural at Lidya',
  },
  {
    n: 3, file: 'gallery-3.jpg', group: 'MOMENTS', span: 'col-span-1 row-span-2',
    title: 'Honoured in Tradition',
    titleAm: 'በባህል የተከበሩ',
    description: 'Honoured guests wrapped in vivid hand-woven shawls beneath woven basket lanterns — tradition worn with pride.',
    descriptionAm: 'የተከበሩ እንግዶች ደማቅ የእጅ ሽመና ጋቢ ለብሰው በተሸመኑ የቅርጫት መብራቶች ስር — ባህል በኩራት ይለበሳል።',
    alt: 'Two guests draped in vivid traditional woven shawls at Lidya',
  },
  {
    n: 4, file: 'gallery-4.JPG', group: 'LIFE', span: 'col-span-1 row-span-2',
    title: 'Friendship at Lidya',
    titleAm: 'ወዳጅነት በሊዲያ',
    description: 'Smiles beside modern Ethiopian art — the dining room where friendships are made and renewed.',
    descriptionAm: 'ከዘመናዊ የኢትዮጵያ ሥዕል አጠገብ ፈገግታ — ወዳጅነት የሚፈጠርበትና የሚታደስበት የመመገቢያ አዳራሽ።',
    alt: 'Two smiling friends beside modern Ethiopian artwork inside Lidya',
  },
  {
    n: 5, file: 'gallery-5.JPG', group: 'LIFE', span: 'col-span-1 row-span-1',
    title: 'Conversations in the Lounge',
    titleAm: 'በእንግዳ ማረፊያው ውስጥ ጭውውት',
    description: 'Unhurried conversation in the lounge — hospitality at Lidya means time is always on the menu.',
    descriptionAm: 'በእንግዳ ማረፊያው ያልተቸኮለ ጭውውት — በሊዲያ እንግዳ ተቀባይነት ማለት ጊዜ ሁሌም ከምናሌው ላይ ነው።',
    alt: 'Guests in relaxed conversation in the lounge at Lidya',
  },
  {
    n: 6, file: 'gallery-6.JPG', group: 'MOMENTS', span: 'col-span-2 row-span-1',
    title: 'Welcomed at the Door',
    titleAm: 'በበሩ ላይ የተደረገ አቀባበል',
    description: 'Guests received beneath the welcome banner, with woven mesobs and traditional displays lining the entrance.',
    descriptionAm: 'እንግዶች በእንኳን ደህና መጡ ባነር ስር ተቀብለዋል፣ የተሸመኑ መሶቦችና ባህላዊ ማሳያዎች መግቢያውን አስውበዋል።',
    alt: 'Guests standing at the decorated entrance of Lidya under the welcome banner',
  },
  {
    n: 7, file: 'gallery-7.JPG', group: 'LIFE', span: 'col-span-2 row-span-1',
    title: 'Style Meets Heritage',
    titleAm: 'ዘመናዊነት ከቅርስ ጋር',
    description: 'Modern style and woven heritage side by side — at Lidya, every generation finds its place.',
    descriptionAm: 'ዘመናዊ ስልትና የሽመና ቅርስ ጎን ለጎን — በሊዲያ እያንዳንዱ ትውልድ ቦታውን ያገኛል።',
    alt: 'Guests in modern and traditional dress before the mural at Lidya',
  },
  {
    n: 8, file: 'gallery-8.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-1',
    title: 'The Sound of the Horns',
    titleAm: 'የቀንደ መለከቱ ድምፅ',
    description: 'Traditional horn players in embroidered vests sound the long bamboo trumpets — music that has welcomed guests for generations.',
    descriptionAm: 'ባህላዊ የመለከት ተጫዋቾች የተጠለፈ ሸሚዝ ለብሰው ረጃጅም የቀርከሃ መለከቶችን ይነፋሉ — ለትውልዶች እንግዶችን የተቀበለ ሙዚቃ።',
    alt: 'Musicians playing long traditional bamboo horns at Lidya',
  },
  {
    n: 9, file: 'gallery-9.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-1',
    title: 'Applause of Welcome',
    titleAm: 'የአቀባበል ጭብጨባ',
    description: 'Clapping hands and warm smiles in the street — the neighbourhood joins the celebration.',
    descriptionAm: 'ጭብጨባና ሞቅ ያለ ፈገግታ በመንገዱ ላይ — ሰፈሩ ከክብረ በዓሉ ጋር ይቀላቀላል።',
    alt: 'Guests clapping in welcome outside Lidya',
  },
  {
    n: 10, file: 'gallery-10.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-2',
    title: 'Dressed for the Occasion',
    titleAm: 'ለበዓሉ የተዋቡ',
    description: 'A couple on the red carpet — she in a hand-embroidered habesha kemis, welcomed beneath the Lidya banner.',
    descriptionAm: 'ጥንዶች በቀይ ምንጣፍ ላይ — እሷ በእጅ የተጠለፈ የሀበሻ ቀሚስ ለብሳ፣ በሊዲያ ባነር ስር ተቀብለዋል።',
    alt: 'Couple in elegant traditional dress on the red carpet at Lidya',
  },
  {
    n: 11, file: 'gallery-11.JPG', group: 'LIFE', span: 'col-span-1 row-span-2',
    title: 'Smiles of the House',
    titleAm: 'የቤቱ ፈገግታዎች',
    description: 'Woven scarves, embroidered jackets, and easy laughter — the everyday joy of an evening at Lidya.',
    descriptionAm: 'የሽመና ሻርፕ፣ የተጠለፉ ጃኬቶችና ቀላል ሳቅ — በሊዲያ ምሽት ያለው የየቀኑ ደስታ።',
    alt: 'Two smiling guests in traditional attire inside Lidya',
  },
  {
    n: 12, file: 'gallery-12.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-2',
    title: 'Guests of Honour',
    titleAm: 'የክብር እንግዶች',
    description: 'Elegant guests before the welcome wall — every arrival at Lidya is received like family.',
    descriptionAm: 'የተዋቡ እንግዶች በእንኳን ደህና መጡ ግድግዳ ፊት — በሊዲያ እያንዳንዱ መምጣት እንደ ቤተሰብ ይቀበላል።',
    alt: 'Three elegantly dressed guests before the welcome banner at Lidya',
  },
  {
    n: 13, file: 'gallery-13.JPG', group: 'LIFE', span: 'col-span-1 row-span-2',
    title: 'An Evening at Lidya',
    titleAm: 'ምሽት በሊዲያ',
    description: 'Under handwoven lanterns, a guest pauses between courses — quiet style in a warm cultural room.',
    descriptionAm: 'በእጅ በተሸመኑ መብራቶች ስር አንድ እንግዳ በምግቦች መካከል ቆም ብሏል — በሞቃት ባህላዊ አዳራሽ ውስጥ ጸጥ ያለ ውበት።',
    alt: 'Guest with cultural scarf standing in the warm dining room of Lidya',
  },
  {
    n: 14, file: 'gallery-14.JPG', group: 'MOMENTS', span: 'col-span-2 row-span-2',
    title: 'A Grand Cultural Welcome',
    titleAm: 'ታላቅ ባህላዊ አቀባበል',
    description: 'Dancers in fringed traditional dress, flute players, and a flower-crowned tent before the thatched entrance — a full ceremonial welcome at Lidya.',
    descriptionAm: 'የተንዘረዘረ ባህላዊ ልብስ የለበሱ ጨፋሪዎች፣ የዋሽንት ተጫዋቾችና በአበባ የተጌጠ ድንኳን በሳር ክዳን መግቢያው ፊት — በሊዲያ የተሟላ ባህላዊ አቀባበል።',
    alt: 'Traditional dancers and musicians performing a ceremonial welcome outside Lidya',
  },
  {
    n: 15, file: 'gallery-15.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-1',
    title: 'The Embrace of Friendship',
    titleAm: 'የወዳጅነት እቅፍ',
    description: 'Old friends reunite with an embrace before the cultural mural — Lidya is where people find each other again.',
    descriptionAm: 'የቆዩ ወዳጆች በባህላዊው ሥዕል ፊት በእቅፍ ተገናኙ — ሊዲያ ሰዎች እርስ በርስ የሚገናኙበት ስፍራ ነው።',
    alt: 'Guests embracing in greeting inside Lidya',
  },
  {
    n: 16, file: 'gallery-16.JPG', group: 'MOMENTS', span: 'col-span-1 row-span-2',
    title: 'Roses at the Door',
    titleAm: 'ጽጌረዳዎች በበሩ ላይ',
    description: 'A hostess in white cultural dress offers a woven basket of roses beneath the blossom wall — beauty in every detail of the welcome.',
    descriptionAm: 'ነጭ ባህላዊ ቀሚስ የለበሰች አስተናጋጅ ከአበባ ግድግዳው ስር የጽጌረዳ ቅርጫት ታቀርባለች — በአቀባበሉ እያንዳንዱ ዝርዝር ውስጥ ውበት።',
    alt: 'Hostess in traditional dress holding a basket of roses at Lidya',
  },
  {
    n: 17, file: 'gallery-17.JPG', group: 'MOMENTS', span: 'col-span-2 row-span-1',
    title: 'An Evening of Elegance',
    titleAm: 'የውበት ምሽት',
    description: 'Guests dressed for a special evening arrive along the red carpet — celebrations at Lidya always begin in style.',
    descriptionAm: 'ለልዩ ምሽት የተዋቡ እንግዶች በቀይ ምንጣፍ ላይ ይደርሳሉ — በሊዲያ ክብረ በዓላት ሁሌም በውበት ይጀምራሉ።',
    alt: 'Elegantly dressed guests arriving at Lidya',
  },
  {
    n: 18, file: 'gallery-18.png', group: 'LIFE', span: 'col-span-1 row-span-2',
    title: 'A Table of Ethiopia',
    titleAm: 'የኢትዮጵያ ገበታ',
    description: 'Hostesses in cultural dress present clay bowls of traditional dishes beside the jebena — the flavours of Ethiopia laid out in colour.',
    descriptionAm: 'ባህላዊ ልብስ የለበሱ አስተናጋጆች ከጀበናው አጠገብ የሸክላ ሳህኖችን በባህላዊ ምግቦች ሞልተው ያቀርባሉ — የኢትዮጵያ ጣዕሞች በቀለም ተዘርግተዋል።',
    alt: 'Hostesses presenting traditional Ethiopian dishes in clay bowls at Lidya',
  },
  {
    n: 19, file: 'gallery-19.png', group: 'LIFE', span: 'col-span-2 row-span-2',
    title: 'Sisters Around the Mesob',
    titleAm: 'እህቶች በመሶቡ ዙሪያ',
    description: 'Four friends in traditional dress share injera from a bright woven mesob beneath the thatched hut — dining as Ethiopia has always known it: together.',
    descriptionAm: 'አራት ወዳጆች ባህላዊ ልብስ ለብሰው ከሳር ጎጆው ስር ከደማቅ የተሸመነ መሶብ እንጀራ ይጋራሉ — ኢትዮጵያ ሁሌም እንደምታውቀው አመጋገብ፦ በአንድነት።',
    alt: 'Four women in traditional dress sharing food from a woven mesob at Lidya',
  },
  {
    n: 20, file: 'gallery-20.png', group: 'LIFE', span: 'col-span-1 row-span-1',
    title: 'Honoured Guests at Home',
    titleAm: 'የክብር እንግዶች እንደ ቤታቸው',
    description: 'Honoured guests share a quiet moment together — at Lidya, every guest is received as family.',
    descriptionAm: 'የክብር እንግዶች ጸጥ ያለ ጊዜ አብረው ያሳልፋሉ — በሊዲያ እያንዳንዱ እንግዳ እንደ ቤተሰብ ይቀበላል።',
    alt: 'Honoured guests seated together at Lidya',
  },
];

async function main() {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const base = new Date('2020-02-01T00:00:00Z').getTime();

  for (const it of ITEMS) {
    const src = path.join(srcDir, it.file);
    if (!fs.existsSync(src)) { console.warn(`MISSING: ${it.file} — skipped`); continue; }

    const mainName = `gallery_fe-${it.n}.webp`;
    const thumbName = `gallery_fe-${it.n}_thumb.webp`;
    const mainBuf = await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const thumbBuf = await sharp(src).rotate().resize({ width: 700, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
    fs.writeFileSync(path.join(uploadsDir, mainName), mainBuf);
    fs.writeFileSync(path.join(uploadsDir, thumbName), thumbBuf);

    const data = {
      title: it.title, titleAm: it.titleAm,
      description: it.description, descriptionAm: it.descriptionAm,
      imageUrl: `/uploads/${mainName}`, thumbUrl: `/uploads/${thumbName}`,
      span: it.span, group: it.group, alt: it.alt,
      deletedAt: null as Date | null,
      // Public gallery sorts createdAt desc — give gallery-1 the newest stamp
      // (still older than the original items) so photos display 1 → 20.
      createdAt: new Date(base + (ITEMS.length - it.n) * 60_000),
    };
    await prisma.galleryItem.upsert({
      where: { id: `gallery-fe-${it.n}` },
      update: data,
      create: { id: `gallery-fe-${it.n}`, ...data },
    });
    console.log(`OK  gallery-${it.n}  [${it.group}]  ${it.title}  (${Math.round(mainBuf.length/1024)} KB main / ${Math.round(thumbBuf.length/1024)} KB thumb)`);
  }

  const count = await prisma.galleryItem.count({ where: { deletedAt: null } });
  console.log(`\nGallery now holds ${count} items.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
