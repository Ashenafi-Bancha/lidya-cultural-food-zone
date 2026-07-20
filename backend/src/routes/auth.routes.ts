import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { strictLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../utils/validators';

const router = Router();

router.post('/login', strictLimiter, validate(loginSchema), login);
router.post('/logout', logout);

export default router;
