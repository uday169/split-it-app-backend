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

// POST /api/settlements - Create a new settlement
router.post('/', validateRequest(createSettlementSchema), settlementController.createSettlement);

// GET /api/settlements/group/:groupId - Get all settlements for a group
router.get(
  '/group/:groupId',
  validateRequest(getGroupSettlementsSchema),
  settlementController.getGroupSettlements
);

// GET /api/settlements/:settlementId - Get settlement details
router.get(
  '/:settlementId',
  validateRequest(confirmSettlementSchema),
  settlementController.getSettlement
);

// PATCH /api/settlements/:settlementId/confirm - Confirm a settlement
router.patch(
  '/:settlementId/confirm',
  validateRequest(confirmSettlementSchema),
  settlementController.confirmSettlement
);

export default router;
