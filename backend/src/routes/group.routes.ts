import { Router } from 'express';
import groupController from '../controllers/group.controller';
import balanceController from '../controllers/balance.controller';
import settlementController from '../controllers/settlement.controller';
import expenseController from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createGroupSchema,
  updateGroupSchema,
  getGroupSchema,
  addMemberSchema,
  removeMemberSchema,
} from '../schemas/group.schema';
import { getGroupBalancesSchema } from '../schemas/balance.schema';
import { getGroupSettlementsSchema } from '../schemas/settlement.schema';
import { listExpensesSchema } from '../schemas/expense.schema';

const router = Router();

// All group routes require authentication
router.use(authenticate);

// Group CRUD
router.post('/', validateRequest(createGroupSchema), groupController.createGroup);
router.get('/', groupController.getUserGroups);
router.get('/:groupId', validateRequest(getGroupSchema), groupController.getGroup);
router.put('/:groupId', validateRequest(updateGroupSchema), groupController.updateGroup);
router.delete('/:groupId', validateRequest(getGroupSchema), groupController.deleteGroup);

// Group members
router.get('/:groupId/members', validateRequest(getGroupSchema), groupController.getGroupMembers);
router.post('/:groupId/members', validateRequest(addMemberSchema), groupController.addMember);
router.delete(
  '/:groupId/members/:memberId',
  validateRequest(removeMemberSchema),
  groupController.removeMember
);

// Nested group resources
router.get(
  '/:groupId/expenses',
  validateRequest(listExpensesSchema),
  expenseController.listExpenses
);
router.get(
  '/:groupId/balances',
  validateRequest(getGroupBalancesSchema),
  balanceController.getGroupBalances
);
router.get(
  '/:groupId/balances/me',
  validateRequest(getGroupBalancesSchema),
  balanceController.getUserBalance
);
router.get(
  '/:groupId/settlements',
  validateRequest(getGroupSettlementsSchema),
  settlementController.getGroupSettlements
);

export default router;
