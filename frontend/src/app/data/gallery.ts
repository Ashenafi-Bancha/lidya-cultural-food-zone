/**
 * Gallery content — fully frontend-stored so the section renders without the
 * backend (e.g. on Vercel). Images are optimized WebP bundled from
 * src/imports/gallery/. Grouped into MOMENTS and LIFE; `span` controls the
 * mosaic size in the grid.
 */

import orig1 from "@/imports/gallery/orig-1.webp";
import orig1t from "@/imports/gallery/orig-1_thumb.webp";
import orig2 from "@/imports/gallery/orig-2.webp";
import orig2t from "@/imports/gallery/orig-2_thumb.webp";
import orig3 from "@/imports/gallery/orig-3.webp";
import orig3t from "@/imports/gallery/orig-3_thumb.webp";
import orig4 from "@/imports/gallery/orig-4.webp";
import orig4t from "@/imports/gallery/orig-4_thumb.webp";
import orig5 from "@/imports/gallery/orig-5.webp";
import orig5t from "@/imports/gallery/orig-5_thumb.webp";
import orig6 from "@/imports/gallery/orig-6.webp";
import orig6t from "@/imports/gallery/orig-6_thumb.webp";
import fe1 from "@/imports/gallery/fe-1.webp";
import fe1t from "@/imports/gallery/fe-1_thumb.webp";
import fe2 from "@/imports/gallery/fe-2.webp";
import fe2t from "@/imports/gallery/fe-2_thumb.webp";
import fe3 from "@/imports/gallery/fe-3.webp";
import fe3t from "@/imports/gallery/fe-3_thumb.webp";
import fe4 from "@/imports/gallery/fe-4.webp";
import fe4t from "@/imports/gallery/fe-4_thumb.webp";
import fe5 from "@/imports/gallery/fe-5.webp";
import fe5t from "@/imports/gallery/fe-5_thumb.webp";
import fe6 from "@/imports/gallery/fe-6.webp";
import fe6t from "@/imports/gallery/fe-6_thumb.webp";
import fe7 from "@/imports/gallery/fe-7.webp";
import fe7t from "@/imports/gallery/fe-7_thumb.webp";
import fe8 from "@/imports/gallery/fe-8.webp";
import fe8t from "@/imports/gallery/fe-8_thumb.webp";
import fe9 from "@/imports/gallery/fe-9.webp";
import fe9t from "@/imports/gallery/fe-9_thumb.webp";
import fe10 from "@/imports/gallery/fe-10.webp";
import fe10t from "@/imports/gallery/fe-10_thumb.webp";
import fe11 from "@/imports/gallery/fe-11.webp";
import fe11t from "@/imports/gallery/fe-11_thumb.webp";
import fe12 from "@/imports/gallery/fe-12.webp";
import fe12t from "@/imports/gallery/fe-12_thumb.webp";
import fe13 from "@/imports/gallery/fe-13.webp";
import fe13t from "@/imports/gallery/fe-13_thumb.webp";
import fe14 from "@/imports/gallery/fe-14.webp";
import fe14t from "@/imports/gallery/fe-14_thumb.webp";
import fe15 from "@/imports/gallery/fe-15.webp";
import fe15t from "@/imports/gallery/fe-15_thumb.webp";
import fe16 from "@/imports/gallery/fe-16.webp";
import fe16t from "@/imports/gallery/fe-16_thumb.webp";
import fe17 from "@/imports/gallery/fe-17.webp";
import fe17t from "@/imports/gallery/fe-17_thumb.webp";
import fe18 from "@/imports/gallery/fe-18.webp";
import fe18t from "@/imports/gallery/fe-18_thumb.webp";
import fe19 from "@/imports/gallery/fe-19.webp";
import fe19t from "@/imports/gallery/fe-19_thumb.webp";
import fe20 from "@/imports/gallery/fe-20.webp";
import fe20t from "@/imports/gallery/fe-20_thumb.webp";

export interface GalleryPhoto {
  id: string;
  title: string;
  titleAm: string;
  description: string;
  descriptionAm: string;
  imageUrl: string;
  thumbUrl: string;
  span: string;
  group: "MOMENTS" | "LIFE";
  alt: string;
}

export const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    id: "orig-1", imageUrl: orig1, thumbUrl: orig1t, span: "col-span-2 row-span-2", group: "MOMENTS",
    title: "Addis Ababa Branch Opening", titleAm: "የአዲስ አበባ ቅርንጫፍ ምረቃ",
    description: "The grand opening of our Addis Ababa branch — carrying the warmth of Ethiopia's cultural cuisine to the capital.",
    descriptionAm: "የአዲስ አበባ ቅርንጫፋችን ታላቅ ምረቃ — የኢትዮጵያን ባህላዊ ምግብ ሙቀት ወደ ዋና ከተማ ማምጣት።",
    alt: "Addis Ababa branch opening ceremony at Lidya Cultural Food Zone",
  },
  {
    id: "orig-2", imageUrl: orig2, thumbUrl: orig2t, span: "col-span-2 row-span-1", group: "MOMENTS",
    title: "Inside Lidya", titleAm: "ልዲያ ውስጥ",
    description: "A warm, welcoming space wrapped in Ethiopian colour and hospitality.",
    descriptionAm: "በኢትዮጵያ ቀለምና እንግዳ ተቀባይነት የተከበበ ሞቅ ያለ ቦታ።",
    alt: "Interior dining hall at Lidya Cultural Food Zone",
  },
  {
    id: "orig-3", imageUrl: orig3, thumbUrl: orig3t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "A Cultural Setting", titleAm: "ባህላዊ ድባብ",
    description: "Every corner tells a story of Ethiopian heritage and pride.",
    descriptionAm: "እያንዳንዱ ጥግ የኢትዮጵያን ቅርስና ኩራት ታሪክ ይተርካል።",
    alt: "Cultural decor and setting at Lidya",
  },
  {
    id: "orig-4", imageUrl: orig4, thumbUrl: orig4t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "A Warm Welcome", titleAm: "ሞቅ ያለ አቀባበል",
    description: "Genuine Ethiopian hospitality, offered from the heart.",
    descriptionAm: "ከልብ የሚቀርብ እውነተኛ የኢትዮጵያ እንግዳ ተቀባይነት።",
    alt: "Warm welcome and hospitality at Lidya",
  },
  {
    id: "fe-1", imageUrl: fe1, thumbUrl: fe1t, span: "col-span-2 row-span-1", group: "MOMENTS",
    title: "A Welcome in Woven Colours", titleAm: "በሽመና ቀለማት የታጀበ አቀባበል",
    description: "Guests draped in traditional woven scarves gather at the entrance, roses in hand — the Lidya welcome begins before the first bite.",
    descriptionAm: "እንግዶች ባህላዊ የሽመና ሻርፕ ለብሰው በመግቢያው ላይ ተሰብስበዋል — የልዲያ አቀባበል ከመጀመሪያው ጉርሻ በፊት ይጀምራል።",
    alt: "Guests wearing traditional woven scarves welcomed at the entrance of Lidya",
  },
  {
    id: "fe-2", imageUrl: fe2, thumbUrl: fe2t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "Gathered in Celebration", titleAm: "ለክብረ በዓል ተሰባስበው",
    description: "Friends and guests come together before the hand-painted cultural mural — every visit becomes a celebration.",
    descriptionAm: "ወዳጆችና እንግዶች በእጅ በተሳለው ባህላዊ ሥዕል ፊት ተሰባስበዋል — እያንዳንዱ ጉብኝት ክብረ በዓል ይሆናል።",
    alt: "Group of guests posing before the cultural mural at Lidya",
  },
  {
    id: "fe-3", imageUrl: fe3, thumbUrl: fe3t, span: "col-span-1 row-span-2", group: "MOMENTS",
    title: "Honoured in Tradition", titleAm: "በባህል የተከበሩ",
    description: "Honoured guests wrapped in vivid hand-woven shawls beneath woven basket lanterns — tradition worn with pride.",
    descriptionAm: "የተከበሩ እንግዶች ደማቅ የእጅ ሽመና ጋቢ ለብሰው በተሸመኑ የቅርጫት መብራቶች ስር — ባህል በኩራት ይለበሳል።",
    alt: "Two guests draped in vivid traditional woven shawls at Lidya",
  },
  {
    id: "fe-6", imageUrl: fe6, thumbUrl: fe6t, span: "col-span-2 row-span-1", group: "MOMENTS",
    title: "Welcomed at the Door", titleAm: "በበሩ ላይ የተደረገ አቀባበል",
    description: "Guests received beneath the welcome banner, with woven mesobs and traditional displays lining the entrance.",
    descriptionAm: "እንግዶች በእንኳን ደህና መጡ ባነር ስር ተቀብለዋል፣ የተሸመኑ መሶቦችና ባህላዊ ማሳያዎች መግቢያውን አስውበዋል።",
    alt: "Guests standing at the decorated entrance of Lidya under the welcome banner",
  },
  {
    id: "fe-8", imageUrl: fe8, thumbUrl: fe8t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "The Sound of the Horns", titleAm: "የቀንደ መለከቱ ድምፅ",
    description: "Traditional horn players in embroidered vests sound the long bamboo trumpets — music that has welcomed guests for generations.",
    descriptionAm: "ባህላዊ የመለከት ተጫዋቾች የተጠለፈ ሸሚዝ ለብሰው ረጃጅም የቀርከሃ መለከቶችን ይነፋሉ — ለትውልዶች እንግዶችን የተቀበለ ሙዚቃ።",
    alt: "Musicians playing long traditional bamboo horns at Lidya",
  },
  {
    id: "fe-9", imageUrl: fe9, thumbUrl: fe9t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "Applause of Welcome", titleAm: "የአቀባበል ጭብጨባ",
    description: "Clapping hands and warm smiles in the street — the neighbourhood joins the celebration.",
    descriptionAm: "ጭብጨባና ሞቅ ያለ ፈገግታ በመንገዱ ላይ — ሰፈሩ ከክብረ በዓሉ ጋር ይቀላቀላል።",
    alt: "Guests clapping in welcome outside Lidya",
  },
  {
    id: "fe-10", imageUrl: fe10, thumbUrl: fe10t, span: "col-span-1 row-span-2", group: "MOMENTS",
    title: "Dressed for the Occasion", titleAm: "ለበዓሉ የተዋቡ",
    description: "A couple on the red carpet — she in a hand-embroidered habesha kemis, welcomed beneath the Lidya banner.",
    descriptionAm: "ጥንዶች በቀይ ምንጣፍ ላይ — እሷ በእጅ የተጠለፈ የሀበሻ ቀሚስ ለብሳ፣ በልዲያ ባነር ስር ተቀብለዋል።",
    alt: "Couple in elegant traditional dress on the red carpet at Lidya",
  },
  {
    id: "fe-12", imageUrl: fe12, thumbUrl: fe12t, span: "col-span-1 row-span-2", group: "MOMENTS",
    title: "Guests of Honour", titleAm: "የክብር እንግዶች",
    description: "Elegant guests before the welcome wall — every arrival at Lidya is received like family.",
    descriptionAm: "የተዋቡ እንግዶች በእንኳን ደህና መጡ ግድግዳ ፊት — በልዲያ እያንዳንዱ መምጣት እንደ ቤተሰብ ይቀበላል።",
    alt: "Three elegantly dressed guests before the welcome banner at Lidya",
  },
  {
    id: "fe-14", imageUrl: fe14, thumbUrl: fe14t, span: "col-span-2 row-span-2", group: "MOMENTS",
    title: "A Grand Cultural Welcome", titleAm: "ታላቅ ባህላዊ አቀባበል",
    description: "Dancers in fringed traditional dress, flute players, and a flower-crowned tent before the thatched entrance — a full ceremonial welcome at Lidya.",
    descriptionAm: "የተንዘረዘረ ባህላዊ ልብስ የለበሱ ጨፋሪዎች፣ የዋሽንት ተጫዋቾችና በአበባ የተጌጠ ድንኳን በሳር ክዳን መግቢያው ፊት — በልዲያ የተሟላ ባህላዊ አቀባበል።",
    alt: "Traditional dancers and musicians performing a ceremonial welcome outside Lidya",
  },
  {
    id: "fe-15", imageUrl: fe15, thumbUrl: fe15t, span: "col-span-1 row-span-1", group: "MOMENTS",
    title: "The Embrace of Friendship", titleAm: "የወዳጅነት እቅፍ",
    description: "Old friends reunite with an embrace before the cultural mural — Lidya is where people find each other again.",
    descriptionAm: "የቆዩ ወዳጆች በባህላዊው ሥዕል ፊት በእቅፍ ተገናኙ — ልዲያ ሰዎች እርስ በርስ የሚገናኙበት ስፍራ ነው።",
    alt: "Guests embracing in greeting inside Lidya",
  },
  {
    id: "fe-16", imageUrl: fe16, thumbUrl: fe16t, span: "col-span-1 row-span-2", group: "MOMENTS",
    title: "Roses at the Door", titleAm: "ጽጌረዳዎች በበሩ ላይ",
    description: "A hostess in white cultural dress offers a woven basket of roses beneath the blossom wall — beauty in every detail of the welcome.",
    descriptionAm: "ነጭ ባህላዊ ቀሚስ የለበሰች አስተናጋጅ ከአበባ ግድግዳው ስር የጽጌረዳ ቅርጫት ታቀርባለች — በአቀባበሉ እያንዳንዱ ዝርዝር ውስጥ ውበት።",
    alt: "Hostess in traditional dress holding a basket of roses at Lidya",
  },
  {
    id: "fe-17", imageUrl: fe17, thumbUrl: fe17t, span: "col-span-2 row-span-1", group: "MOMENTS",
    title: "An Evening of Elegance", titleAm: "የውበት ምሽት",
    description: "Guests dressed for a special evening arrive along the red carpet — celebrations at Lidya always begin in style.",
    descriptionAm: "ለልዩ ምሽት የተዋቡ እንግዶች በቀይ ምንጣፍ ላይ ይደርሳሉ — በልዲያ ክብረ በዓላት ሁሌም በውበት ይጀምራሉ።",
    alt: "Elegantly dressed guests arriving at Lidya",
  },
  {
    id: "orig-5", imageUrl: orig5, thumbUrl: orig5t, span: "col-span-2 row-span-1", group: "LIFE",
    title: "Gathered as Guests", titleAm: "እንደ እንግዳ ተሰብስበው",
    description: "Friends and family sharing food, story, and the joy of the table.",
    descriptionAm: "ጓደኞችና ቤተሰብ ምግብ፣ ወግና የማዕድ ደስታ ሲጋሩ።",
    alt: "Guests sharing a meal at Lidya",
  },
  {
    id: "orig-6", imageUrl: orig6, thumbUrl: orig6t, span: "col-span-2 row-span-1", group: "LIFE",
    title: "Life in the VIP Lounge", titleAm: "በVIP ማረፊያ ውስጥ ያለ ሕይወት",
    description: "Premium comfort and celebration in our VIP experience.",
    descriptionAm: "በVIP ተሞክሮአችን ውስጥ ልዩ ምቾትና ደስታ።",
    alt: "Life at Lidya VIP lounge",
  },
  {
    id: "fe-4", imageUrl: fe4, thumbUrl: fe4t, span: "col-span-1 row-span-2", group: "LIFE",
    title: "Friendship at Lidya", titleAm: "ወዳጅነት በልዲያ",
    description: "Smiles beside modern Ethiopian art — the dining room where friendships are made and renewed.",
    descriptionAm: "ከዘመናዊ የኢትዮጵያ ሥዕል አጠገብ ፈገግታ — ወዳጅነት የሚፈጠርበትና የሚታደስበት የመመገቢያ አዳራሽ።",
    alt: "Two smiling friends beside modern Ethiopian artwork inside Lidya",
  },
  {
    id: "fe-5", imageUrl: fe5, thumbUrl: fe5t, span: "col-span-1 row-span-1", group: "LIFE",
    title: "Conversations in the Lounge", titleAm: "በእንግዳ ማረፊያው ውስጥ ጭውውት",
    description: "Unhurried conversation in the lounge — hospitality at Lidya means time is always on the menu.",
    descriptionAm: "በእንግዳ ማረፊያው ያልተቸኮለ ጭውውት — በልዲያ እንግዳ ተቀባይነት ማለት ጊዜ ሁሌም ከምናሌው ላይ ነው።",
    alt: "Guests in relaxed conversation in the lounge at Lidya",
  },
  {
    id: "fe-7", imageUrl: fe7, thumbUrl: fe7t, span: "col-span-2 row-span-1", group: "LIFE",
    title: "Style Meets Heritage", titleAm: "ዘመናዊነት ከቅርስ ጋር",
    description: "Modern style and woven heritage side by side — at Lidya, every generation finds its place.",
    descriptionAm: "ዘመናዊ ስልትና የሽመና ቅርስ ጎን ለጎን — በልዲያ እያንዳንዱ ትውልድ ቦታውን ያገኛል።",
    alt: "Guests in modern and traditional dress before the mural at Lidya",
  },
  {
    id: "fe-11", imageUrl: fe11, thumbUrl: fe11t, span: "col-span-1 row-span-2", group: "LIFE",
    title: "Smiles of the House", titleAm: "የቤቱ ፈገግታዎች",
    description: "Woven scarves, embroidered jackets, and easy laughter — the everyday joy of an evening at Lidya.",
    descriptionAm: "የሽመና ሻርፕ፣ የተጠለፉ ጃኬቶችና ቀላል ሳቅ — በልዲያ ምሽት ያለው የየቀኑ ደስታ።",
    alt: "Two smiling guests in traditional attire inside Lidya",
  },
  {
    id: "fe-13", imageUrl: fe13, thumbUrl: fe13t, span: "col-span-1 row-span-2", group: "LIFE",
    title: "An Evening at Lidya", titleAm: "ምሽት በልዲያ",
    description: "Under handwoven lanterns, a guest pauses between courses — quiet style in a warm cultural room.",
    descriptionAm: "በእጅ በተሸመኑ መብራቶች ስር አንድ እንግዳ በምግቦች መካከል ቆም ብሏል — በሞቃት ባህላዊ አዳራሽ ውስጥ ጸጥ ያለ ውበት።",
    alt: "Guest with cultural scarf standing in the warm dining room of Lidya",
  },
  {
    id: "fe-18", imageUrl: fe18, thumbUrl: fe18t, span: "col-span-1 row-span-2", group: "LIFE",
    title: "A Table of Ethiopia", titleAm: "የኢትዮጵያ ገበታ",
    description: "Hostesses in cultural dress present clay bowls of traditional dishes beside the jebena — the flavours of Ethiopia laid out in colour.",
    descriptionAm: "ባህላዊ ልብስ የለበሱ አስተናጋጆች ከጀበናው አጠገብ የሸክላ ሳህኖችን በባህላዊ ምግቦች ሞልተው ያቀርባሉ — የኢትዮጵያ ጣዕሞች በቀለም ተዘርግተዋል።",
    alt: "Hostesses presenting traditional Ethiopian dishes in clay bowls at Lidya",
  },
  {
    id: "fe-19", imageUrl: fe19, thumbUrl: fe19t, span: "col-span-2 row-span-2", group: "LIFE",
    title: "Sisters Around the Mesob", titleAm: "እህቶች በመሶቡ ዙሪያ",
    description: "Four friends in traditional dress share injera from a bright woven mesob beneath the thatched hut — dining as Ethiopia has always known it: together.",
    descriptionAm: "አራት ወዳጆች ባህላዊ ልብስ ለብሰው ከሳር ጎጆው ስር ከደማቅ የተሸመነ መሶብ እንጀራ ይጋራሉ — ኢትዮጵያ ሁሌም እንደምታውቀው አመጋገብ፦ በአንድነት።",
    alt: "Four women in traditional dress sharing food from a woven mesob at Lidya",
  },
  {
    id: "fe-20", imageUrl: fe20, thumbUrl: fe20t, span: "col-span-1 row-span-1", group: "LIFE",
    title: "Honoured Guests at Home", titleAm: "የክብር እንግዶች እንደ ቤታቸው",
    description: "Honoured guests share a quiet moment together — at Lidya, every guest is received as family.",
    descriptionAm: "የክብር እንግዶች ጸጥ ያለ ጊዜ አብረው ያሳልፋሉ — በልዲያ እያንዳንዱ እንግዳ እንደ ቤተሰብ ይቀበላል።",
    alt: "Honoured guests seated together at Lidya",
  },
];
