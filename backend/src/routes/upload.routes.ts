import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
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
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
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

router.post('/', authenticate, authorize(['OWNER', 'MANAGER']), upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError(400, 'No image file provided'));
    }

    // Optimize image with Sharp first
    const imageBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    let imageUrl = '';

    if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
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
