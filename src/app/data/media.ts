/**
 * Media paths for gallery photos/videos and menu food images.
 *
 * HOW TO ADD YOUR FILES (optimized for web):
 *
 * 1. GALLERY PHOTOS → public/media/gallery/photos/
 *    - Resize to max 1920px wide, export as JPEG (85%) or WebP (80%)
 *    - Optional smaller thumbs → public/media/gallery/thumbs/ (600px wide for faster grid)
 *
 * 2. GALLERY VIDEOS → public/media/gallery/videos/
 *    - Use MP4 (H.264), max 1080p, compress with HandBrake or similar (~5–15 MB per clip)
 *    - Add a poster frame → public/media/gallery/posters/ (same name, .jpg)
 *
 * 3. MENU FOOD PHOTOS → public/media/menu/
 *    - Name files to match dish slug: kitfo.jpg, doro-wat.jpg, etc.
 *    - 800×600px (4:3) is enough for menu cards
 *
 * Free tools: Squoosh (images), HandBrake (video), FFmpeg (video posters)
 */

export type GalleryMediaType = "image" | "video";

export interface GalleryItem {
  type: GalleryMediaType;
  thumb: string;
  src: string;
  poster?: string;
  alt: string;
  span: string;
}

export interface MenuItem {
  id: number;
  name: string;
  cat: string;
  desc: string;
  price: string;
  img: string;
  fallbackImg?: string;
  tag: string | null;
}

export const galleryPhoto = (file: string) => `/media/gallery/photos/${file}`;
export const galleryThumb = (file: string) => `/media/gallery/thumbs/${file}`;
export const galleryVideo = (file: string) => `/media/gallery/videos/${file}`;
export const galleryPoster = (file: string) => `/media/gallery/posters/${file}`;
export const menuPhoto = (file: string) => `/media/menu/${file}`;
