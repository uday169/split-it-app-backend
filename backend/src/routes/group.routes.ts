import { Router } from 'express';
import groupController from '../controllers/group.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createGroupSchema,
  updateGroupSchema,
  getGroupSchema,
  addMemberSchema,
  removeMemberSchema,
} from '../schemas/group.schema';

const router = Router();

// All group routes require authentication
router.use(authenticate);

// POST /api/groups - Create a new group
router.post('/', validateRequest(createGroupSchema), groupController.createGroup);

// GET /api/groups - Get all groups for current user
router.get('/', groupController.getUserGroups);

// GET /api/groups/:groupId - Get group details
router.get('/:groupId', validateRequest(getGroupSchema), groupController.getGroup);

// PUT /api/groups/:groupId - Update group
router.put('/:groupId', validateRequest(updateGroupSchema), groupController.updateGroup);

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

export default router;
