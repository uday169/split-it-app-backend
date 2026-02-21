import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users/me - Get current user profile
router.get('/me', userController.getCurrentUser);

// PATCH /api/users/me - Update current user profile
router.patch('/me', validateRequest(updateUserSchema), userController.updateUser);

export default router;
