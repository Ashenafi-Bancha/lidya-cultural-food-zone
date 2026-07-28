/**
 * One-time (repeatable) bulk import for gallery photos.
 *
 * Usage:
 *   1. Put the photo files into  backend/gallery-import/
 *   2. Describe them in          backend/gallery-import/manifest.json
 *   3. Run                        npm run import:gallery   (from backend/)
 *
 * Behaviour:
 *   - Each image is optimised (resized + converted to WebP).
 *   - Uploaded to Cloudinary when CLOUDINARY_* env vars are set, otherwise
 *     saved to backend/uploads/ (served at /uploads).
 *   - A GalleryItem row is created/updated, keyed by the file name, so
 *     re-running is safe: existing images are NOT re-uploaded, only their
 *     captions/size/alt are refreshed from the manifest.
 *
 * After import, everything is editable in the admin dashboard → Media & Gallery.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { prisma } from './prisma';
import { logger } from '../utils/logger';

interface ManifestEntry {
  file: string;
  title?: string;
  titleAm?: string;
  description?: string;
  descriptionAm?: string;
  span?: string;
  group?: string;
  alt?: string;
}

const IMPORT_DIR = path.join(process.cwd(), 'gallery-import');
const MANIFEST = path.join(IMPORT_DIR, 'manifest.json');
const UPLOADS = path.join(process.cwd(), 'uploads');

const VALID_SPANS = [
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-2',
];

const cloudinaryReady =
  !!env.CLOUDINARY_CLOUD_NAME && !!env.CLOUDINARY_API_KEY && !!env.CLOUDINARY_API_SECRET;

if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function optimise(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
}

async function uploadImage(buffer: Buffer, name: string): Promise<string> {
  if (cloudinaryReady) {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'lidya-food-zone/gallery' },
        (error, result) => (error ? reject(error) : resolve((result as any).secure_url))
      );
      stream.end(buffer);
    });
  }
  if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });
  const filename = `gallery_${name}_${Date.now()}.webp`;
  fs.writeFileSync(path.join(UPLOADS, filename), buffer);
  return `/uploads/${filename}`;
}

async function main() {
  logger.info(`Gallery import — storage: ${cloudinaryReady ? 'Cloudinary' : 'local /uploads'}`);

  if (!fs.existsSync(MANIFEST)) {
    logger.error(`No manifest found at ${MANIFEST}. Create it (see gallery-import/README.md).`);
    process.exit(1);
  }

  let entries: ManifestEntry[];
  try {
    entries = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  } catch (e) {
    logger.error('manifest.json is not valid JSON. Please fix and re-run.');
    process.exit(1);
  }
  if (!Array.isArray(entries)) {
    logger.error('manifest.json must be a JSON array of photo entries.');
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.file) {
      logger.warn('Skipping an entry with no "file" field.');
      skipped++;
      continue;
    }

    const id = `gallery-import-${slug(entry.file)}`;
    const span = entry.span && VALID_SPANS.includes(entry.span) ? entry.span : 'col-span-1 row-span-1';
    const existing = await prisma.galleryItem.findUnique({ where: { id } });

    let imageUrl = existing?.imageUrl;

    // Only upload if we don't already have a URL for this file.
    if (!imageUrl) {
      const filePath = path.join(IMPORT_DIR, entry.file);
      if (!fs.existsSync(filePath)) {
        logger.warn(`File not found: gallery-import/${entry.file} — skipping.`);
        skipped++;
        continue;
      }
      const optimised = await optimise(fs.readFileSync(filePath));
      imageUrl = await uploadImage(optimised, slug(entry.file));
      logger.info(`Uploaded ${entry.file}`);
    }

    const group = entry.group === 'LIFE' ? 'LIFE' : 'MOMENTS';
    const data = {
      title: entry.title ?? null,
      titleAm: entry.titleAm ?? null,
      description: entry.description ?? null,
      descriptionAm: entry.descriptionAm ?? null,
      span,
      group,
      alt: entry.alt ?? entry.title ?? null,
      imageUrl: imageUrl!,
      thumbUrl: imageUrl!,
    };

    if (existing) {
      await prisma.galleryItem.update({ where: { id }, data });
      updated++;
    } else {
      await prisma.galleryItem.create({ data: { id, ...data } });
      created++;
    }
  }

  logger.info(`✅ Gallery import complete — ${created} added, ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
