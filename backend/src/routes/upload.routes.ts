import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

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

    const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Optimize image with Sharp
    await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filepath);

    const imageUrl = `/uploads/${filename}`;
    
    // Create a thumbnail variant if needed (we'll just use one for now or could create multiple)

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
