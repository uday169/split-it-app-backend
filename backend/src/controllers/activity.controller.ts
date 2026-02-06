import { Response, NextFunction } from 'express';
import activityService from '../services/activity.service';
import { AuthRequest, ApiResponse } from '../types';
import { GetActivityInput } from '../schemas/activity.schema';

export class ActivityController {
  async getUserActivity(
    req: AuthRequest<{}, GetActivityInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { page = 1, limit = 20 } = req.query;

      const result = await activityService.getUserActivity(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityController();
