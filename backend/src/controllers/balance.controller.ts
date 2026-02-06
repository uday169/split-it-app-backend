import { Response, NextFunction } from 'express';
import balanceService from '../services/balance.service';
import { AuthRequest, ApiResponse } from '../types';
import { GetGroupBalancesInput } from '../schemas/balance.schema';

export class BalanceController {
  async getGroupBalances(
    req: AuthRequest<GetGroupBalancesInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;

      const result = await balanceService.calculateGroupBalances(groupId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BalanceController();
