import { Router } from 'express';
import balanceController from '../controllers/balance.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { getGroupBalancesSchema } from '../schemas/balance.schema';

const router = Router();

// All balance routes require authentication
router.use(authenticate);

// GET /api/balances/:groupId - Get balances for a group
router.get('/:groupId', validateRequest(getGroupBalancesSchema), balanceController.getGroupBalances);

export default router;
