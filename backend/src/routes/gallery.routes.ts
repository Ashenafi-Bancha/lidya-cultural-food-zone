import { Router } from 'express';
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createGalleryItemSchema, updateGalleryItemSchema } from '../utils/validators';

const router = Router();

router.get('/', getGalleryItems);

router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.post('/', validate(createGalleryItemSchema), createGalleryItem);
router.put('/:id', validate(updateGalleryItemSchema), updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;
