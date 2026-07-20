import { Router } from 'express';
import { getReservations, createReservation, updateReservationStatus } from '../controllers/reservation.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { strictLimiter } from '../middleware/rateLimiter';
import { createReservationSchema, updateReservationStatusSchema } from '../utils/validators';

const router = Router();

// Public route for creating reservations
router.post('/', strictLimiter, validate(createReservationSchema), createReservation);

// Admin routes
router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.get('/', getReservations);
router.put('/:id/status', validate(updateReservationStatusSchema), updateReservationStatus);

export default router;
