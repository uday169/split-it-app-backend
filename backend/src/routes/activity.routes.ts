import { Router } from 'express';
import activityController from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { getActivitySchema } from '../schemas/activity.schema';

const router = Router();

// All activity routes require authentication
router.use(authenticate);

// GET /api/activity - Get user's activity feed
router.get('/', validateRequest(getActivitySchema), activityController.getUserActivity);

export default router;
