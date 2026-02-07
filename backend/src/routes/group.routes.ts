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

// POST /api/groups - Create a new group
router.post('/', validateRequest(createGroupSchema), groupController.createGroup);

// GET /api/groups - Get all groups for current user
router.get('/', groupController.getUserGroups);

// GET /api/groups/:groupId - Get group details
router.get('/:groupId', validateRequest(getGroupSchema), groupController.getGroup);

// PATCH /api/groups/:groupId - Update group
router.patch('/:groupId', validateRequest(updateGroupSchema), groupController.updateGroup);

// DELETE /api/groups/:groupId - Delete group
router.delete('/:groupId', validateRequest(getGroupSchema), groupController.deleteGroup);

// GET /api/groups/:groupId/members - Get group members
router.get('/:groupId/members', validateRequest(getGroupSchema), groupController.getGroupMembers);

// POST /api/groups/:groupId/members - Add member to group
router.post('/:groupId/members', validateRequest(addMemberSchema), groupController.addMember);

// DELETE /api/groups/:groupId/members/:memberId - Remove member from group
router.delete(
  '/:groupId/members/:memberId',
  validateRequest(removeMemberSchema),
  groupController.removeMember
);

// GET /api/groups/:groupId/expenses - Get expenses for a group
router.get('/:groupId/expenses', validateRequest(listExpensesSchema), expenseController.listExpenses);

// GET /api/groups/:groupId/balances - Get balances for a group
router.get('/:groupId/balances', validateRequest(getGroupBalancesSchema), balanceController.getGroupBalances);

// GET /api/groups/:groupId/balances/me - Get authenticated user's balance in the group
router.get('/:groupId/balances/me', validateRequest(getGroupBalancesSchema), balanceController.getUserBalance);

// GET /api/groups/:groupId/settlements - Get settlements for a group
router.get('/:groupId/settlements', validateRequest(getGroupSettlementsSchema), settlementController.getGroupSettlements);

export default router;
