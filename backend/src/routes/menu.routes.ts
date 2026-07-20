import { Router } from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createMenuItemSchema } from '../utils/validators';

const router = Router();

router.get('/', getMenuItems);

router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.post('/', validate(createMenuItemSchema), createMenuItem);
router.put('/:id', validate(createMenuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
