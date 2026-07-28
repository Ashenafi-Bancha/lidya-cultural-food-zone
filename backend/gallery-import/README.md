# Gallery bulk import

Use this folder to load the photos you received from the client into the website
gallery in one step. After importing, everything is editable in the admin
dashboard (**Media & Gallery**).

## Steps

1. **Drop the photo files here** — copy the client's images into this
   `gallery-import/` folder (`.jpg`, `.jpeg`, `.png`, or `.webp`).

2. **Edit `manifest.json`** — it's a list; one `{ ... }` block per photo. Use the
   file name exactly as it appears in this folder. Only `file` is required;
   everything else is optional.

   ```json
   {
     "file": "doro-wat.jpg",              // required — the image file name
     "title": "Doro Wat",                 // optional caption (English)
     "titleAm": "ዶሮ ወጥ",                  // optional caption (Amharic)
     "description": "Slow-braised...",    // optional (English)
     "descriptionAm": "ቀስ ብሎ የበሰለ...",   // optional (Amharic)
     "span": "col-span-1 row-span-1",     // optional tile size (see below)
     "alt": "Chicken stew"                // optional accessibility text
   }
   ```

3. **Run the import** (from the `backend/` folder):

   ```bash
   npm run import:gallery
   ```

4. Open the site → **Gallery** to see them. Manage/edit anytime in
   **admin → Media & Gallery**.

## Tile sizes (`span`)

The gallery is a mosaic. Mix sizes for a nice layout:

| span value                | Look                |
|---------------------------|---------------------|
| `col-span-1 row-span-1`   | 1×1 — standard      |
| `col-span-2 row-span-1`   | 2×1 — wide          |
| `col-span-1 row-span-2`   | 1×2 — tall          |
| `col-span-2 row-span-2`   | 2×2 — featured/hero |

Tip: give 1–2 photos the featured `2×2` size and the rest a mix of the others.

## Notes

- **Safe to re-run.** Photos already imported are not re-uploaded — only their
  captions/size/alt are refreshed from the manifest. To replace an image,
  delete that item in the admin dashboard first, then re-run.
- **Storage:** with Cloudinary env vars set, images go to Cloudinary (recommended
  for production). Without them, images are saved to `backend/uploads/` (fine for
  local testing; note Render's disk is temporary — use Cloudinary for production).
- **Life-at-Lidya photos** go here too — just title them accordingly
  (e.g. "Life at Lidya — …"). They share the same gallery grid.
- The actual image files are **git-ignored** (they're content, not code); the
  `manifest.json` and this README are kept.
