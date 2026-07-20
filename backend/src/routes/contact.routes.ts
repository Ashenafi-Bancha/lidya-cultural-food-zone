import { Router } from 'express';
import { getContactMessages, createContactMessage, updateContactMessageStatus } from '../controllers/contact.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { strictLimiter } from '../middleware/rateLimiter';
import { contactMessageSchema } from '../utils/validators';

const router = Router();

// Public route for submitting contact form
router.post('/', strictLimiter, validate(contactMessageSchema), createContactMessage);

// Admin routes
router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.get('/', getContactMessages);
router.put('/:id/status', updateContactMessageStatus);

export default router;
