import { AppError } from '../middleware/errorHandler';
import settlementRepository from '../repositories/settlement.repository';
import groupMemberRepository from '../repositories/groupMember.repository';
import userRepository from '../repositories/user.repository';
import emailService from './email.service';
import { Settlement } from '../types';
import logger from '../config/logger';

export class SettlementService {
  /**
   * Create a settlement record
   * Requires confirmation from both payer and payee
   */
  async createSettlement(
    requesterId: string,
    groupId: string,
    fromUserId: string,
    toUserId: string,
    amount: number,
    currency: string,
    date?: string
  ): Promise<Settlement> {
    // Verify requester is a member
    await this.checkGroupMembership(groupId, requesterId);

    // Verify both users are members
    await this.checkGroupMembership(groupId, fromUserId);
    await this.checkGroupMembership(groupId, toUserId);

    // Requester must be either the payer or payee
    if (requesterId !== fromUserId && requesterId !== toUserId) {
      throw new AppError(
        403,
        'You can only create settlements where you are the payer or payee',
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    // Determine initial confirmation status
    const confirmedByPayer = requesterId === fromUserId;
    const confirmedByPayee = requesterId === toUserId;

    // Create settlement
    const settlement = await settlementRepository.create({
      groupId,
      fromUserId,
      toUserId,
      amount,
      currency,
      date: date ? new Date(date) : new Date(),
      confirmedByPayer,
      confirmedByPayee,
      createdAt: new Date(),
    });

    logger.info(
      `Settlement created: ${settlement.id} from ${fromUserId} to ${toUserId} in group ${groupId}`
    );

    // Send confirmation email to the other party
    try {
      const otherUserId = requesterId === fromUserId ? toUserId : fromUserId;
      const otherUser = await userRepository.findById(otherUserId);
      const requester = await userRepository.findById(requesterId);

      if (otherUser && requester) {
        await emailService.sendSettlementRequestEmail(
          otherUser.email,
          requester.name,
          amount
        );
      }
    } catch (error) {
      logger.error('Failed to send settlement confirmation email:', error);
      // Don't throw - email is non-critical
    }

    return settlement;
  }

  /**
   * Confirm a settlement (by either payer or payee)
   */
  async confirmSettlement(settlementId: string, userId: string): Promise<Settlement> {
    const settlement = await settlementRepository.findById(settlementId);

    if (!settlement) {
      throw new AppError(404, 'Settlement not found', 'SETTLEMENT_NOT_FOUND');
    }

    // Verify user is a member of the group
    await this.checkGroupMembership(settlement.groupId, userId);

    // User must be either the payer or payee
    if (userId !== settlement.fromUserId && userId !== settlement.toUserId) {
      throw new AppError(
        403,
        'Only the payer or payee can confirm this settlement',
        'INSUFFICIENT_PERMISSIONS'
      );
    }

    // Check if already fully confirmed
    if (settlement.confirmedByPayer && settlement.confirmedByPayee) {
      throw new AppError(400, 'Settlement is already fully confirmed', 'ALREADY_CONFIRMED');
    }

    // Check if this user already confirmed
    if (userId === settlement.fromUserId && settlement.confirmedByPayer) {
      throw new AppError(400, 'You have already confirmed this settlement', 'ALREADY_CONFIRMED');
    }
    if (userId === settlement.toUserId && settlement.confirmedByPayee) {
      throw new AppError(400, 'You have already confirmed this settlement', 'ALREADY_CONFIRMED');
    }

    // Update confirmation status
    const updates: Partial<Settlement> = {};

    if (userId === settlement.fromUserId) {
      updates.confirmedByPayer = true;
    } else {
      updates.confirmedByPayee = true;
    }

    // If both confirmed, set confirmedAt timestamp
    const willBeFullyConfirmed =
      (userId === settlement.fromUserId && settlement.confirmedByPayee) ||
      (userId === settlement.toUserId && settlement.confirmedByPayer);

    if (willBeFullyConfirmed) {
      updates.confirmedAt = new Date();
    }

    const updatedSettlement = await settlementRepository.update(settlementId, updates);

    if (!updatedSettlement) {
      throw new AppError(404, 'Settlement not found', 'SETTLEMENT_NOT_FOUND');
    }

    logger.info(`Settlement confirmed: ${settlementId} by user ${userId}`);

    return updatedSettlement;
  }

  /**
   * Get all settlements for a group
   */
  async getGroupSettlements(groupId: string, userId: string): Promise<Settlement[]> {
    // Verify user is a member
    await this.checkGroupMembership(groupId, userId);

    return settlementRepository.findByGroupId(groupId);
  }

  /**
   * Get settlement by ID
   */
  async getSettlement(settlementId: string, userId: string): Promise<Settlement> {
    const settlement = await settlementRepository.findById(settlementId);

    if (!settlement) {
      throw new AppError(404, 'Settlement not found', 'SETTLEMENT_NOT_FOUND');
    }

    // Verify user is a member of the group
    await this.checkGroupMembership(settlement.groupId, userId);

    return settlement;
  }

  // Helper method
  private async checkGroupMembership(groupId: string, userId: string): Promise<void> {
    const membership = await groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!membership) {
      throw new AppError(403, 'User is not a member of this group', 'NOT_A_MEMBER');
    }
  }
}

export default new SettlementService();
