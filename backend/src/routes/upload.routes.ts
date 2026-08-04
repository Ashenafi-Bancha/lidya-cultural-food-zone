import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { authenticate, authorize } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';

const router = Router();

// Configure Cloudinary
if (env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

const storage = multer.memoryStorage();

// Photos arrive straight from phones, and iPhones shoot HEIC. Browsers on
// Windows frequently report those as `application/octet-stream` rather than
// `image/heic`, so a MIME check alone rejects a file Sharp can decode perfectly
// well. Fall back to the extension for the formats we know libvips handles.
const EXTRA_IMAGE_EXTENSIONS = /\.(heic|heif|avif)$/i;

const isSupportedImage = (file: Express.Multer.File) =>
  file.mimetype.startsWith('image/') || EXTRA_IMAGE_EXTENSIONS.test(file.originalname || '');

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — HEIC originals from phones run large
  fileFilter: (req, file, cb) => {
    if (isSupportedImage(file)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only images are allowed'));
    }
  },
});

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── S3-compatible object storage (preferred in production) ────────────────
const s3Ready = () =>
  !!(env.S3_ENDPOINT && env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY);

let s3: S3Client | null = null;
const getS3 = () => {
  if (!s3) {
    s3 = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      // Required by most S3-compatible providers (non-AWS).
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID!,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3;
};

router.post('/', authenticate, authorize(['OWNER', 'MANAGER']), upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError(400, 'No image file provided'));
    }

    // Normalize and optimize. `.rotate()` with no argument applies the EXIF
    // orientation flag and then drops it — without this, portrait photos taken
    // on a phone render sideways. Sharp discards the rest of the metadata by
    // default, which also strips the GPS coordinates phones embed.
    let imageBuffer: Buffer;
    try {
      imageBuffer = await sharp(req.file.buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      return next(new AppError(400, 'That image could not be read. Please try a JPG, PNG, or HEIC file.'));
    }

    let imageUrl = '';

    if (s3Ready()) {
      // S3-compatible object storage (AletCloud Object Storage, AWS S3, …).
      // Preferred in production: container disks are wiped on every redeploy,
      // object storage is not.
      const filename = `lidya/img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      await getS3().send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET!,
          Key: filename,
          Body: imageBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=2592000',
        })
      );
      const base = (env.S3_PUBLIC_URL || `${env.S3_ENDPOINT}/${env.S3_BUCKET}`).replace(/\/+$/, '');
      imageUrl = `${base}/${filename}`;
    } else if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
      // Upload to Cloudinary using stream
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'lidya-food-zone' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(imageBuffer);
      });
      
      const result: any = await uploadPromise;
      imageUrl = result.secure_url;
    } else {
      // Fallback: Local Upload (Note: Ephemeral on Render Free Tier!)
      const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, imageBuffer);
      imageUrl = `/uploads/${filename}`;
    }

    res.status(201).json({
      status: 'success',
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
