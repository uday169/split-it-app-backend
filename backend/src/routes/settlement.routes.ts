import { Router } from 'express';
import settlementController from '../controllers/settlement.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createSettlementSchema,
  confirmSettlementSchema,
  getGroupSettlementsSchema,
} from '../schemas/settlement.schema';

const router = Router();

// All settlement routes require authentication
router.use(authenticate);

router.post('/', validateRequest(createSettlementSchema), settlementController.createSettlement);
router.get(
  '/group/:groupId',
  validateRequest(getGroupSettlementsSchema),
  settlementController.getGroupSettlements
);
router.get(
  '/:settlementId',
  validateRequest(confirmSettlementSchema),
  settlementController.getSettlement
);
router.post(
  '/:settlementId/confirm',
  validateRequest(confirmSettlementSchema),
  settlementController.confirmSettlement
);

export default router;
