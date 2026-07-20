import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateSettingsSchema } from '../utils/validators';

const router = Router();

router.get('/', getSettings);

router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.post('/', validate(updateSettingsSchema), updateSettings);

export default router;
