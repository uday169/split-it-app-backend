import { Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { AuthRequest, ApiResponse } from '../types';
import { UpdateUserInput } from '../schemas/user.schema';

export class UserController {
  async getCurrentUser(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const user = await userService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: AuthRequest<{}, {}, UpdateUserInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name } = req.body;

      const user = await userService.updateUser(userId, name);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
