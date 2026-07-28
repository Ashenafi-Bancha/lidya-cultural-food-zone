import { Router } from 'express';
import { createEventBooking, getEventBookings, updateEventBookingStatus } from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { strictLimiter } from '../middleware/rateLimiter';
import { createEventBookingSchema, updateEventBookingStatusSchema } from '../utils/validators';

const router = Router();

// Public: submit an event / VIP booking request
router.post('/', strictLimiter, validate(createEventBookingSchema), createEventBooking);

// Admin
router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.get('/', getEventBookings);
router.put('/:id/status', validate(updateEventBookingStatusSchema), updateEventBookingStatus);

export default router;
