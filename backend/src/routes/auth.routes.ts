import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  me,
  changePassword,
  changeEmail,
  twoFactorSetup,
  twoFactorEnable,
  twoFactorDisable,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { strictLimiter } from '../middleware/rateLimiter';
import {
  loginSchema,
  changePasswordSchema,
  changeEmailSchema,
  twoFactorEnableSchema,
  twoFactorDisableSchema,
} from '../utils/validators';

const router = Router();

router.post('/login', strictLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Account management — always acts on the signed-in user, never on an id from
// the request body. strictLimiter guards the endpoints that check a password or
// a one-time code, so they can't be brute-forced.
router.get('/me', authenticate, me);
router.post('/change-password', authenticate, strictLimiter, validate(changePasswordSchema), changePassword);
router.post('/change-email', authenticate, strictLimiter, validate(changeEmailSchema), changeEmail);
router.post('/2fa/setup', authenticate, twoFactorSetup);
router.post('/2fa/enable', authenticate, strictLimiter, validate(twoFactorEnableSchema), twoFactorEnable);
router.post('/2fa/disable', authenticate, strictLimiter, validate(twoFactorDisableSchema), twoFactorDisable);

export default router;
