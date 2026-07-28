import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTestimonialSchema, updateTestimonialSchema } from '../utils/validators';

const router = Router();

router.get('/', getTestimonials);

router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.post('/', validate(createTestimonialSchema), createTestimonial);
router.put('/:id', validate(updateTestimonialSchema), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
