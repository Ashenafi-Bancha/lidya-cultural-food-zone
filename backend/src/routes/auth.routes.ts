import { Router } from 'express';
import { login, logout, refresh } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { strictLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../utils/validators';

const router = Router();

router.post('/login', strictLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
