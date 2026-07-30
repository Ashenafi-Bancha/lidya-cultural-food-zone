/**
 * Guest testimonials for the "What Our Guests Say" section — managed here in the
 * frontend. Up to 6 guests.
 *
 * PHOTOS: drop each guest's square photo in  src/imports/testimonials/
 *         (guest-1.jpg … guest-6.jpg, in the order below), then:
 *           1) uncomment the matching import below, and
 *           2) set that entry's `img:` to the imported variable.
 * Until a photo is added, an elegant gold monogram of the guest's initials shows.
 *
 * QUOTES: replace each placeholder with the guest's REAL words (English).
 * All ratings are 5 stars.
 */

import guest1 from "@/imports/testimonials/guest-1.png";
import guest2 from "@/imports/testimonials/guest-2.png";
import guest3 from "@/imports/testimonials/guest-3.png";
import guest4 from "@/imports/testimonials/guest-4.png";
// import guest5 from "@/imports/testimonials/guest-5.png";
// import guest6 from "@/imports/testimonials/guest-6.png";

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating?: number;      // always 5 here
  img?: string | null;  // imported photo, or null for a monogram
}

// Placeholder quotes below — awaiting each guest's real words.
export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Haile Gebreselassie",     quote: "— testimonial to be added —", rating: 5, img: guest1 },
  { id: "t2", name: "Adonay Berhane (Mada)",   quote: "— testimonial to be added —", rating: 5, img: guest2 },
  { id: "t3", name: "Gildo Kassa",             quote: "— testimonial to be added —", rating: 5, img: guest3 },
  { id: "t4", name: "Bereket Geberewa",        quote: "— testimonial to be added —", rating: 5, img: guest4 },
  { id: "t5", name: "Master Abinet",           quote: "— testimonial to be added —", rating: 5, img: null /* guest5 */ },
  { id: "t6", name: "K Money",                 quote: "— testimonial to be added —", rating: 5, img: null /* guest6 */ },
];
