# Lidya Cultural Food Zone — Project Documentation

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [File Structure](#2-file-structure)
3. [How the App Works](#3-how-the-app-works)
4. [Customising Restaurant Information](#4-customising-restaurant-information)
5. [Customising Design & Styles](#5-customising-design--styles)
6. [Replacing Images](#6-replacing-images)
7. [Social Media & Contact Links](#7-social-media--contact-links)

---

## 1. Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18.3.1 | UI component framework |
| **TypeScript** | via Vite | Type-safe JavaScript |
| **Vite** | 6.3.5 | Build tool and dev server |
| **Tailwind CSS** | 4.1.12 | Utility-first CSS styling |
| **@tailwindcss/vite** | 4.1.12 | Vite plugin to process Tailwind |
| **@vitejs/plugin-react** | 4.7.0 | Vite plugin for React/JSX |
| **Google Fonts** | — | Playfair Display, Fraunces, Manrope typefaces |

> **No external animation or icon libraries are used at runtime.** All icons are hand-written inline SVGs. All animations are pure CSS `@keyframes` defined inside `<style>` blocks. This keeps the bundle small and avoids proxy/network timeouts.

---

## 2. File Structure

```
code/
├── src/
│   ├── app/
│   │   ├── App.tsx                  ← MAIN FILE — the entire website lives here
│   │   └── components/
│   │       └── figma/
│   │           └── ImageWithFallback.tsx   ← helper for imported images
│   │
│   ├── imports/                     ← YOUR UPLOADED IMAGES (logo + photos)
│   │   ├── image.png                ← Lidya Cultural Food Zone logo (circular badge)
│   │   ├── image-1.png              ← Restaurant interior — warm amber lighting
│   │   ├── image-2.png              ← Restaurant interior — guests dining, wall art
│   │   ├── image-3.png              ← Wolaita outdoor cultural celebration
│   │   └── image-4.png              ← Formal group in traditional Wolaita attire
│   │
│   └── styles/
│       ├── fonts.css                ← Google Fonts @import declarations
│       ├── theme.css                ← Design tokens (colors, radius, etc.)
│       ├── index.css                ← Tailwind @theme inline mapping (do not delete)
│       ├── globals.css              ← Global base styles
│       └── tailwind.css             ← Tailwind entry point
│
├── vite.config.ts                   ← Vite configuration (aliases, plugins)
├── package.json                     ← Dependencies and scripts
├── DOCUMENTATION.md                 ← This file
└── guidelines/
    └── Guidelines.md                ← Design system guidelines
```

### The most important file: `src/app/App.tsx`

This single file contains **the entire website** — all sections, all data, all components, all animations. It is structured as follows (in order):

```
imports
  └── React hooks, ImageWithFallback, logo, 4 photo imports

Icon object          — 16 inline SVG icon components
useReveal()          — scroll-reveal hook using IntersectionObserver
Data constants       — NAV_LINKS, MENU_ITEMS, GALLERY_ITEMS, EXPERIENCES, TESTIMONIALS, STATS
Font style objects   — serif, body, sans (shorthand for fontFamily inline styles)
HeroDecoration()     — floating cultural elements (coffee beans, injera, stars, etc.)
Reveal()             — wrapper component for scroll-triggered fade-in animations
Navbar()             — fixed top navigation with logo, links, Call Us, Facebook
Hero()               — full-screen hero section with parallax background
OurStory()           — brand story, founder quote, statistics
MenuSection()        — filterable menu grid
CulturalExperience() — horizontal scroll of experience cards
Gallery()            — masonry photo grid with lightbox
Branches()           — two location cards (Wolaita Sodo + Addis Ababa)
Testimonials()       — auto-rotating quote carousel
Reservation()        — booking form
Contact()            — contact form + info
Footer()             — links, social icons, newsletter
App()                — root component that assembles all sections
```

---

## 3. How the App Works

### Scroll Reveal Animations
Every major section uses the `Reveal` wrapper component. It uses a `useReveal()` hook that sets up an `IntersectionObserver`. When an element scrolls into view (past 12% threshold), it fades up from `translateY(28px)` to `translateY(0)` with opacity `0 → 1`. The animation runs once and disconnects.

```tsx
// Usage example — wrap any element:
<Reveal delay={0.2}>
  <h2>My heading</h2>
</Reveal>
```

### Parallax Hero Background
The hero background image scrolls at 28% of the page scroll speed (`scrollY * 0.28`) creating a depth effect. This is done with a plain scroll event listener updating `translateY` CSS transform.

### Hero Floating Elements
`HeroDecoration` renders 31 small cultural icons (coffee beans, injera circles, 4-pointed stars, drink teardrops, gems, dots) scattered across the full hero using `position: absolute` with `top`/`left` percentages. Each has a CSS animation — `hdBob`, `hdDrift`, `hdSpin`, or `hdTwinkle` — with staggered delays so they move independently.

### Menu Filtering
`MenuSection` maintains an `active` category state. Clicking a filter button updates `active`, and the displayed items are filtered from `MENU_ITEMS` with `.filter(i => i.cat === active)`.

### Gallery Lightbox
Each gallery thumbnail is a `<button>` that sets `lightbox` state to `{ img, fullImg, alt }`. When set, a full-screen overlay renders with the full-resolution image. Press `Escape` or click the overlay to close.

### Testimonials Carousel
`Testimonials` auto-advances every 5.2 seconds using `setInterval`. The active index drives which testimonial is displayed. Clicking a dot indicator jumps to that testimonial.

### Reservation & Contact Forms
Both forms are frontend-only (no server). On submit they show a confirmation message for ~4.5 seconds then reset. To wire them to a real backend, replace the `onSubmit` handlers in `Reservation()` and `Contact()` with actual API calls.

---

## 4. Customising Restaurant Information

All content data is stored as **constants near the top of `src/app/App.tsx`** (lines ~115–168). Edit these to update the website text without touching any component logic.

---

### 4.1 Restaurant Name & Tagline
**File:** `src/app/App.tsx`

Search for `"Lidya Cultural"` — it appears in:
- **Navbar** (~line 347): `<span>Lidya Cultural</span>` and `<span>Food Zone</span>`
- **Footer** (~line 890): same two spans
- **Hero** (~line 466): the `<h1>` heading text
- **Footer copyright** (~line 985): `© 2024 Lidya Cultural Food Zone`
- **Meta text** in various section intros

---

### 4.2 Branch Locations & Hours
**File:** `src/app/App.tsx` → `Branches()` function (~line 655)

```tsx
const branches = [
  {
    name: "Wolaita Sodo",
    label: "Flagship",
    address: "Kebele 03, Main Street, Wolaita Sodo, SNNPR, Ethiopia",
    phone: "+251 46 551 2233",
    email: "sodo@lidyafoodzone.com",
    hours: "Mon–Sun: 7:00 AM – 11:00 PM",
    note: "The original Lidya ...",
    img: photo1,          // ← change to a different imported photo
  },
  {
    name: "Addis Ababa",
    label: "Capital Branch",
    address: "Bole Road, Near Friendship Square, Addis Ababa, Ethiopia",
    phone: "+251 11 663 4455",
    email: "addis@lidyafoodzone.com",
    hours: "Mon–Sun: 8:00 AM – 11:30 PM",
    note: "Our capital outpost ...",
    img: photo2,
  },
];
```

Change any value directly. To add a third branch, duplicate one object and add it to the array (the grid will adapt).

---

### 4.3 Menu Items
**File:** `src/app/App.tsx` → `MENU_ITEMS` constant (~line 127)

Each item has this shape:

```tsx
{
  id: 1,
  name: "Kitfo",
  cat: "Traditional Mains",   // must match a value in MENU_CATEGORIES
  desc: "Minced prime beef ...",
  price: "380 ETB",
  img: "https://images.unsplash.com/...",  // Unsplash URL or imported image
  tag: "Signature",           // or null for no badge
}
```

**To add a new menu item:** copy any object, change its `id` to a new unique number, and fill in the details.

**To add a new category:** add the category name string to `MENU_CATEGORIES` (~line 125), then use it as `cat` on menu items.

**Tag badge colours** are defined in `MenuSection()`:
```tsx
const tagBg = {
  Signature: "#c25e2a",
  Heritage:  "#8b5a2b",
  Fasting:   "#4a7c59",
  Ceremony:  "#2a5c8a",
  Spicy:     "#8b2525",
};
```
Add a new key-colour pair to support new tag names.

---

### 4.4 Gallery Photos
**File:** `src/app/App.tsx` → `GALLERY_ITEMS` constant (~line 138)

```tsx
{ img: photo2, fullImg: photo2, alt: "Guests dining ...", span: "col-span-2 row-span-2" },
```

- `img` — the thumbnail source (imported image variable or Unsplash URL)
- `fullImg` — the lightbox full-resolution source (same as `img` for uploaded photos)
- `alt` — accessible description text
- `span` — Tailwind grid span classes controlling tile size in the mosaic

To replace a photo with one of your own, add `import myPhoto from "@/imports/my-photo.png"` at the top of the file alongside the existing imports, then use `myPhoto` as the `img` and `fullImg` value.

---

### 4.5 Cultural Experiences
**File:** `src/app/App.tsx` → `EXPERIENCES` constant (~line 148)

```tsx
{ title: "Coffee Ceremony", desc: "Three sacred rounds ...", img: "...", alt: "..." }
```

Five cards scroll horizontally. Edit `title`, `desc`, `img`, and `alt` for each. To add/remove cards, add/remove objects from the array.

---

### 4.6 Testimonials
**File:** `src/app/App.tsx` → `TESTIMONIALS` constant (~line 156)

```tsx
{ name: "Abebe Girma", role: "Food Writer, Addis Fortune", quote: "...", avatar: "AG" }
```

- `avatar` — two-letter initials shown in the coloured circle
- The carousel auto-rotates every 5.2 seconds

---

### 4.7 Statistics (Our Story section)
**File:** `src/app/App.tsx` → `STATS` constant (~line 163)

```tsx
{ value: "12",   label: "Years of service",  Icon: Icon.Calendar },
{ value: "240+", label: "Signature dishes",  Icon: Icon.Utensils },
{ value: "50K+", label: "Happy guests",      Icon: Icon.Users    },
{ value: "2",    label: "Cultural branches", Icon: Icon.MapPin   },
```

Change `value` and `label` freely.

---

### 4.8 Contact Details (Footer & Contact section)
**File:** `src/app/App.tsx`

Search for these literal strings and replace them everywhere they appear:

| What | Current value | Search term |
|------|--------------|-------------|
| Sodo phone | `+251 46 551 2233` | `46 551 2233` |
| Addis phone | `+251 11 663 4455` | `11 663 4455` |
| General email | `info@lidyafoodzone.com` | `info@lidyafoodzone` |
| Events email | `events@lidyafoodzone.com` | `events@lidyafoodzone` |
| Sodo address | `Kebele 03, Main Street, Wolaita Sodo` | `Kebele 03` |
| Addis address | `Bole Road, Near Friendship Square` | `Bole Road` |
| WhatsApp link | `wa.me/251465512233` | `wa.me/` |
| Telegram link | `t.me/lidyafoodzone` | `t.me/` |

---

### 4.9 Founder Story (Our Story section)
**File:** `src/app/App.tsx` → `OurStory()` function

The three paragraphs and the founder quote are hardcoded JSX inside `OurStory()`. Search for `"Lidya Eshetu"` to locate them.

---

## 5. Customising Design & Styles

### Colours
**File:** `src/styles/theme.css`

```css
:root {
  --background: #f5efe6;   /* page background (cream) */
  --foreground: #2a1a0e;   /* default text (dark brown) */
  --primary:    #c25e2a;   /* terracotta — buttons, accents */
  --accent:     #d4a843;   /* gold — highlights, borders */
}
```

Change any hex value here and all Tailwind classes like `bg-primary`, `text-accent`, `border-border` update automatically across the whole site.

### Fonts
**File:** `src/styles/fonts.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:...');
```

To swap a font, replace the Google Fonts URL and update the font family references in `App.tsx`:

```tsx
// At the top of App.tsx, three font style objects:
const serif = { fontFamily: "'Playfair Display', serif" };  // headings
const body  = { fontFamily: "'Fraunces', serif"         };  // body text
const sans  = { fontFamily: "'Manrope', sans-serif"     };  // UI labels
```

---

## 6. Replacing Images

All images are **ES module imports** at the top of `src/app/App.tsx`:

```tsx
import logoImg from "@/imports/image.png";
import photo1  from "@/imports/image-1.png";
import photo2  from "@/imports/image-2.png";
import photo3  from "@/imports/image-3.png";
import photo4  from "@/imports/image-4.png";
```

**To replace an image:**
1. Drop the new file into `src/imports/` (e.g. `my-new-photo.jpg`)
2. Add an import: `import myPhoto from "@/imports/my-new-photo.jpg";`
3. Use `myPhoto` wherever you want it as a `src` value

**Never use a string path like `src="/imports/image.png"` directly** — Vite hashes filenames at build time, so only ES module imports will resolve correctly in production.

| Variable | File | Currently used in |
|----------|------|-------------------|
| `logoImg` | `image.png` | Navbar, Footer |
| `photo1` | `image-1.png` | Gallery, Branches (Sodo), Cultural Experience |
| `photo2` | `image-2.png` | Gallery (hero tile), Branches (Addis), Cultural Experience |
| `photo3` | `image-3.png` | Hero background, Gallery, Cultural Experience |
| `photo4` | `image-4.png` | Gallery, Our Story portrait |

---

## 7. Social Media & Contact Links

### Navbar (desktop + mobile hamburger)
**File:** `src/app/App.tsx` → `Navbar()` function

```tsx
// Call Us button — change the phone number in both href and visible text:
<a href="tel:+251465512233">+251 46 551 2233</a>

// Facebook button — change the href:
<a href="https://facebook.com">
```

### Footer social icons
**File:** `src/app/App.tsx` → `Footer()` function, inside the `"Follow Us"` section

| Platform | `href` to change |
|----------|-----------------|
| Facebook | `https://facebook.com` |
| Instagram | `https://instagram.com` |
| Telegram | `https://t.me/lidyafoodzone` |
| WhatsApp | `https://wa.me/251465512233` |
| Twitter/X | `https://twitter.com` |

Replace each `href` value with your actual profile URL.

---

*Documentation generated for Lidya Cultural Food Zone website — built with React 18 + Vite 6 + Tailwind CSS 4.*
