import photo1   from "@/imports/image-1.png";
import photo2   from "@/imports/image-2.png";
import photo3   from "@/imports/image-3.png";
import photo4   from "@/imports/image-4.png";
import menu1    from "@/imports/lidya-menu1.jpg";
import menu2    from "@/imports/lidya-menu2.jpg";
import menu3    from "@/imports/lidya-menu3.jpg";
import menu4    from "@/imports/lidya-menu4.jpg";
import life1    from "@/imports/liday-life1.jpg";
import life2    from "@/imports/lidya-life2.jpg";
import { Icon } from "../components/Icons";
import {
  type GalleryItem,
  type MenuItem,
  galleryPhoto,
  galleryThumb,
  galleryVideo,
  galleryPoster,
  menuPhoto,
} from "./media";

export const NAV_LINKS = [
  { label: "Our Story",   id: "our-story"  },
  { label: "Menu",        id: "menu"        },
  { label: "Experience",  id: "experience"  },
  { label: "Lidya Buna",  id: "coffee"      },
  { label: "Gallery",     id: "gallery"     },
  { label: "Branches",    id: "branches"    },
  { label: "Services",    id: "services"    },
  { label: "Reservation", id: "reservation" },
  { label: "Contact",     id: "contact"     },
];

export const MENU_CATEGORIES = ["All", "Traditional Mains", "Coffee Ceremony", "Vegetarian & Fasting", "Drinks"];

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Kitfo",           cat: "Traditional Mains",    desc: "Minced prime beef with mitmita and niter kibbeh, served on injera with ayib and gomen.",              price: "380 ETB", img: menuPhoto("kitfo.jpg"),           fallbackImg: "https://images.unsplash.com/photo-1608500218861-01091cdc501e?w=600&h=400&fit=crop&auto=format", tag: "Signature" },
  { id: 2, name: "Tibs Firfir",     cat: "Traditional Mains",    desc: "Pan-seared lamb tossed with torn injera, rosemary, and berbere — bold and smoky.",                   price: "340 ETB", img: menuPhoto("tibs-firfir.jpg"),     fallbackImg: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&h=400&fit=crop&auto=format", tag: null },
  { id: 3, name: "Doro Wat",        cat: "Traditional Mains",    desc: "Slow-braised chicken in red berbere sauce with a whole boiled egg — the soul of celebration.",        price: "310 ETB", img: menuPhoto("doro-wat.jpg"),        fallbackImg: "https://images.unsplash.com/photo-1591386767153-987783380885?w=600&h=400&fit=crop&auto=format", tag: "Heritage" },
  { id: 4, name: "Shiro Beyaynetu", cat: "Vegetarian & Fasting", desc: "Full mesob spread of shiro, misir, tikel gomen, fasolia, and salad — the fasting experience.",       price: "220 ETB", img: menuPhoto("shiro-beyaynetu.jpg"), fallbackImg: "https://images.unsplash.com/photo-1765338915553-6e02fe63ff4f?w=600&h=400&fit=crop&auto=format", tag: "Fasting" },
  { id: 5, name: "Jebena Buna",     cat: "Coffee Ceremony",      desc: "Three rounds of freshly roasted Wolaita highland coffee with popcorn and incense.",                   price: "120 ETB", img: menuPhoto("jebena-buna.jpg"),     fallbackImg: "https://images.unsplash.com/photo-1631166092772-d07aed54b9a0?w=600&h=400&fit=crop&auto=format", tag: "Ceremony" },
  { id: 6, name: "Tej Honey Wine",  cat: "Drinks",               desc: "Traditional Ethiopian mead fermented to our ancestral recipe — lightly sweet and ancient.",           price: "90 ETB",  img: menuPhoto("tej.jpg"),             fallbackImg: "https://images.unsplash.com/photo-1643372672636-34d776a7e032?w=600&h=400&fit=crop&auto=format", tag: null },
  { id: 7, name: "Misir Alicha",    cat: "Vegetarian & Fasting", desc: "Red lentils simmered with turmeric, onion, and niter kibbeh until silky smooth.",                    price: "160 ETB", img: menuPhoto("misir-alicha.jpg"),    fallbackImg: "https://images.unsplash.com/photo-1597740751020-a45809a41967?w=600&h=400&fit=crop&auto=format", tag: null },
  { id: 8, name: "Awaze Tibs",      cat: "Traditional Mains",    desc: "Prime beef sautéed with awaze paste, tomatoes, and jalapeño — fiery and unapologetically Wolaita.",   price: "360 ETB", img: menuPhoto("awaze-tibs.jpg"),     fallbackImg: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop&auto=format", tag: "Spicy" },
  { id: 9,  name: "Lidya Special Plate 1", cat: "Traditional Mains", desc: "A special chef's selection featuring our signature flavors and traditional spices.",              price: "420 ETB", img: menu1,                            fallbackImg: menu1, tag: "New" },
  { id: 10, name: "Lidya Special Plate 2", cat: "Traditional Mains", desc: "A hearty combination of traditional mains served fresh daily.",                                   price: "400 ETB", img: menu2,                            fallbackImg: menu2, tag: "New" },
  { id: 11, name: "Lidya Special Plate 3", cat: "Traditional Mains", desc: "A carefully crafted cultural dish, slow-cooked to perfection.",                                   price: "380 ETB", img: menu3,                            fallbackImg: menu3, tag: "New" },
  { id: 12, name: "Lidya Special Plate 4", cat: "Traditional Mains", desc: "An authentic culinary experience bringing you the best of Wolaita.",                              price: "450 ETB", img: menu4,                            fallbackImg: menu4, tag: "New" },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { type: "image", thumb: photo2, src: photo2, alt: "Guests gathered for a meal at Lidya Cultural Food Zone",        span: "col-span-2 row-span-2" },
  { type: "image", thumb: photo1, src: photo1, alt: "Warm amber-lit dining room at Lidya restaurant",                span: "col-span-1 row-span-1" },
  { type: "image", thumb: life1, src: life1, alt: "Everyday life and hospitality at Lidya",                          span: "col-span-1 row-span-1" },
  { type: "image", thumb: photo3, src: photo3, alt: "Wolaita people in traditional cultural attire at an outdoor celebration", span: "col-span-1 row-span-2" },
  { type: "image", thumb: photo4, src: photo4, alt: "Wolaita group dressed in traditional cultural clothing",         span: "col-span-2 row-span-1" },
  { type: "image", thumb: life2, src: life2, alt: "Cultural experiences and joyful moments at Lidya",                span: "col-span-1 row-span-1" },
  { type: "image", thumb: "https://images.unsplash.com/photo-1643372672636-34d776a7e032?w=500&h=340&fit=crop&auto=format", src: "https://images.unsplash.com/photo-1643372672636-34d776a7e032?w=1400&h=900&fit=crop&auto=format", alt: "Handcrafted Ethiopian clay pottery vessels", span: "col-span-1 row-span-1" },
];

export const EXPERIENCES = [
  { title: "Coffee Ceremony",     desc: "Three sacred rounds of Wolaita highland coffee, roasted over open flame and brewed in handcrafted clay jebenas with incense.",      img: "https://images.unsplash.com/photo-1630861412229-67e2acb44b7a?w=500&h=380&fit=crop&auto=format", alt: "Ethiopian coffee ceremony" },
  { title: "Mesob Dining",        desc: "Share food from woven mesob baskets — a communal tradition that has bound Wolaita families for centuries.",                         img: photo2, alt: "Guests sharing a meal at Lidya Cultural Food Zone" },
  { title: "Cultural Attire",     desc: "Our staff wear traditional Wolaita woven textiles daily — a living act of cultural pride, not a costume.",                          img: photo3, alt: "Wolaita people in traditional cultural celebration attire" },
  { title: "Music & Dance Nights",desc: "Friday and Saturday evenings bring live Wolaita krar music, esa dance performances, and oral histories passed through song.",       img: photo1, alt: "Warm festive atmosphere at Lidya restaurant" },
  { title: "Pottery & Artifacts", desc: "Every corner tells a story through hand-thrown clay vessels, gourds, and woven artifacts from Wolaita artisans.",                  img: "https://images.unsplash.com/photo-1643372672636-34d776a7e032?w=500&h=380&fit=crop&auto=format", alt: "Traditional Ethiopian clay pottery" },
];

export const TESTIMONIALS = [
  { name: "Abebe Girma",         role: "Food Writer, Addis Fortune",           quote: "Lidya doesn't just serve food — it curates an encounter with Wolaita heritage. The kitfo alone is reason enough to drive from Addis.", avatar: "AG" },
  { name: "Sara Bekele",         role: "Travel Blogger, @sara_wanderseth",     quote: "I've traveled across Ethiopia and nothing compares to the warmth of Lidya's coffee ceremony. The mesob seating, the incense — pure magic.", avatar: "SB" },
  { name: "Tadesse Woldemariam", role: "Wolaita Sodo resident, regular guest", quote: "This is the place that makes us proud of our culture. Lidya represents Wolaita to the world better than any museum could.", avatar: "TW" },
  { name: "Dr. Meron Haile",     role: "Researcher, Addis Ababa University",   quote: "For my students visiting from abroad, Lidya is the first place I take them. Authentic, dignified, and absolutely delicious.", avatar: "MH" },
];

export const STATS = [
  { value: "10+",  label: "Years of Experience", Icon: Icon.Calendar },
  { value: "240+", label: "Signature Dishes",    Icon: Icon.Utensils },
  { value: "50K+", label: "Happy Guests",        Icon: Icon.Users    },
  { value: "3+",   label: "Branches",            Icon: Icon.MapPin   },
];

export function goto(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
