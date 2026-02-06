import { Response, NextFunction } from 'express';
import settlementService from '../services/settlement.service';
import { AuthRequest, ApiResponse } from '../types';
import {
  CreateSettlementInput,
  ConfirmSettlementInput,
  GetGroupSettlementsInput,
} from '../schemas/settlement.schema';

export class SettlementController {
  async createSettlement(
    req: AuthRequest<{}, {}, CreateSettlementInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId, fromUserId, toUserId, amount, currency, date } = req.body;

      const settlement = await settlementService.createSettlement(
        userId,
        groupId,
        fromUserId,
        toUserId,
        amount,
        currency,
        date
      );

      res.status(201).json({
        success: true,
        data: settlement,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmSettlement(
    req: AuthRequest<ConfirmSettlementInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { settlementId } = req.params;

      const settlement = await settlementService.confirmSettlement(settlementId, userId);

      res.status(200).json({
        success: true,
        data: settlement,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupSettlements(
    req: AuthRequest<GetGroupSettlementsInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { groupId } = req.params;

      const settlements = await settlementService.getGroupSettlements(groupId, userId);

      res.status(200).json({
        success: true,
        data: settlements,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSettlement(
    req: AuthRequest<ConfirmSettlementInput>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { settlementId } = req.params;

      const settlement = await settlementService.getSettlement(settlementId, userId);

      res.status(200).json({
        success: true,
        data: settlement,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SettlementController();
