import { Router } from 'express';
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from '../controllers/branch.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBranchSchema } from '../utils/validators';

const router = Router();

router.get('/', getBranches);
router.get('/:id', getBranchById);

router.use(authenticate, authorize(['OWNER', 'MANAGER']));
router.post('/', validate(createBranchSchema), createBranch);
router.put('/:id', validate(createBranchSchema), updateBranch);
router.delete('/:id', deleteBranch);

export default router;
