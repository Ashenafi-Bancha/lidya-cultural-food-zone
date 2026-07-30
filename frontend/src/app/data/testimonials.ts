/**
 * Guest testimonials — fully frontend-stored so the section renders without
 * the backend (e.g. on Vercel). Photos are optimized WebP bundled from
 * src/imports/testimonials/. Quotes were provided by the client.
 */

import guest1 from "@/imports/testimonials/guest-1.webp";
import guest2 from "@/imports/testimonials/guest-2.webp";
import guest3 from "@/imports/testimonials/guest-3.webp";
import guest4 from "@/imports/testimonials/guest-4.webp";

export interface FrontendTestimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  imageUrl: string | null; // null renders a monogram of the guest's initials
}

export const TESTIMONIALS: FrontendTestimonial[] = [
  {
    id: "t1",
    name: "Haile Gebreselassie",
    quote:
      "Dining at Lidya Cultural Food Zone was an unforgettable experience. The traditional Ethiopian dishes were incredibly delicious, the atmosphere was warm and authentic, and the hospitality made us feel like family. I can't wait to visit again!",
    rating: 5,
    imageUrl: guest1,
  },
  {
    id: "t2",
    name: "Adonay Berhane (Mada)",
    quote:
      "Every meal at Lidya tells a story of Ethiopian culture and tradition. The flavors are rich, the service is exceptional, and the cultural atmosphere makes every visit truly special. I highly recommend it to anyone looking for an authentic dining experience.",
    rating: 5,
    imageUrl: guest2,
  },
  {
    id: "t3",
    name: "Gildo Kassa",
    quote:
      "Lidya Cultural Food Zone exceeded all my expectations. From the beautifully prepared food to the welcoming staff and vibrant cultural setting, everything was perfect. It's the first place I recommend to friends and visitors.",
    rating: 5,
    imageUrl: guest3,
  },
  {
    id: "t4",
    name: "Bereket Geberewa",
    quote:
      "The food was absolutely amazing, the traditional coffee ceremony was unforgettable, and every detail reflected genuine Ethiopian hospitality. Lidya is more than a restaurant — it's a cultural experience worth sharing.",
    rating: 5,
    imageUrl: guest4,
  },
  {
    id: "t5",
    name: "Master Abinet",
    quote:
      "If you want to experience the true taste of Ethiopia, Lidya Cultural Food Zone is the place to be. The fresh ingredients, authentic recipes, and friendly service make every visit memorable. I will definitely be coming back.",
    rating: 5,
    imageUrl: null,
  },
  {
    id: "t6",
    name: "K Money",
    quote:
      "From the moment we walked in, we felt welcomed with genuine warmth. The food was exceptional, the cultural ambiance was beautiful, and every dish was prepared with care. Lidya is a destination everyone should experience at least once.",
    rating: 5,
    imageUrl: null,
  },
];
