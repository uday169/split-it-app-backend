import { AppError } from '../middleware/errorHandler';
import expenseRepository from '../repositories/expense.repository';
import expenseSplitRepository from '../repositories/expenseSplit.repository';
import groupMemberRepository from '../repositories/groupMember.repository';
import userRepository from '../repositories/user.repository';
import logger from '../config/logger';

interface UserBalance {
  userId: string;
  userName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}

interface BalanceDetail {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

interface GroupBalanceResult {
  balances: UserBalance[];
  simplifiedBalances: BalanceDetail[];
}

export class BalanceService {
  /**
   * Calculate balances for a group
   * Algorithm:
   * 1. For each expense, track who paid and who owes
   * 2. Calculate net balance for each user
   * 3. Simplify: who owes whom
   */
  async calculateGroupBalances(groupId: string, userId: string): Promise<GroupBalanceResult> {
    // Verify user is a member
    await this.checkGroupMembership(groupId, userId);

    // Get all expenses for the group
    const expenses = await expenseRepository.findByGroupId(groupId, 1000);

    if (expenses.length === 0) {
      return {
        balances: [],
        simplifiedBalances: [],
      };
    }

    // Get all splits for the group
    const allSplits = await expenseSplitRepository.findByGroupId(groupId);

    // Get all group members with user details
    const members = await groupMemberRepository.getMembersWithUserDetails(groupId);

    // Initialize balance tracking
    const userBalances = new Map<string, UserBalance>();

    members.forEach((member) => {
      userBalances.set(member.userId, {
        userId: member.userId,
        userName: member.user.name,
        totalPaid: 0,
        totalOwed: 0,
        balance: 0,
      });
    });

    // Calculate balances
    expenses.forEach((expense) => {
      const payer = userBalances.get(expense.paidBy);
      if (payer) {
        payer.totalPaid += expense.amount;
      }

      // Get splits for this expense
      const expenseSplits = allSplits.filter((s) => s.expenseId === expense.id);

      expenseSplits.forEach((split) => {
        const debtor = userBalances.get(split.userId);
        if (debtor) {
          debtor.totalOwed += split.amount;
        }
      });
    });

    // Calculate net balance for each user
    userBalances.forEach((balance) => {
      balance.balance = balance.totalPaid - balance.totalOwed;
    });

    // Simplify balances: who owes whom
    const simplifiedBalances = this.simplifyBalances(Array.from(userBalances.values()));

    logger.info(`Balances calculated for group ${groupId}`);

    return {
      balances: Array.from(userBalances.values()),
      simplifiedBalances,
    };
  }

  /**
   * Simplify balances to minimum number of transactions
   * Using the greedy algorithm:
   * 1. Find the person who owes the most
   * 2. Find the person who is owed the most
   * 3. Settle between them (up to the smaller amount)
   * 4. Repeat until all debts are settled
   */
  private simplifyBalances(balances: UserBalance[]): BalanceDetail[] {
    const result: BalanceDetail[] = [];

    // Create a working copy
    const workingBalances = balances.map((b) => ({ ...b }));

    // Filter to only users with non-zero balances
    const nonZeroBalances = workingBalances.filter(
      (b) => Math.abs(b.balance) > 0.01 // Allow 1 cent tolerance for rounding
    );

    while (nonZeroBalances.length > 1) {
      // Sort by balance (descending)
      nonZeroBalances.sort((a, b) => b.balance - a.balance);

      // Find max creditor (person who is owed the most)
      const maxCreditor = nonZeroBalances[0];

      // Find max debtor (person who owes the most)
      const maxDebtor = nonZeroBalances[nonZeroBalances.length - 1];

      // If both are close to zero, we're done
      if (Math.abs(maxCreditor.balance) < 0.01 && Math.abs(maxDebtor.balance) < 0.01) {
        break;
      }

      // Calculate settlement amount
      const settlementAmount = Math.min(maxCreditor.balance, Math.abs(maxDebtor.balance));

      // Record the transaction
      result.push({
        fromUserId: maxDebtor.userId,
        fromUserName: maxDebtor.userName,
        toUserId: maxCreditor.userId,
        toUserName: maxCreditor.userName,
        amount: Math.round(settlementAmount * 100) / 100, // Round to 2 decimals
      });

      // Update balances
      maxCreditor.balance -= settlementAmount;
      maxDebtor.balance += settlementAmount;

      // Remove users with zero balance
      const indicesToRemove = nonZeroBalances.reduce((indices: number[], balance, index) => {
        if (Math.abs(balance.balance) < 0.01) {
          indices.push(index);
        }
        return indices;
      }, []);

      // Remove in reverse order to maintain indices
      for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        nonZeroBalances.splice(indicesToRemove[i], 1);
      }
    }

    return result;
  }

  /**
   * Get authenticated user's balance in a specific group
   */
  async getUserBalanceInGroup(groupId: string, userId: string): Promise<{
    userId: string;
    groupId: string;
    netBalance: number;
    owes: Array<{ userId: string; userName: string; amount: number }>;
    owedBy: Array<{ userId: string; userName: string; amount: number }>;
  }> {
    // Verify user is a member
    await this.checkGroupMembership(groupId, userId);

    // Calculate all balances
    const { simplifiedBalances } = await this.calculateGroupBalances(groupId, userId);

    // Extract user's balance details
    const owes: Array<{ userId: string; userName: string; amount: number }> = [];
    const owedBy: Array<{ userId: string; userName: string; amount: number }> = [];
    let netBalance = 0;

    simplifiedBalances.forEach((balance) => {
      if (balance.fromUserId === userId) {
        // User owes someone
        owes.push({
          userId: balance.toUserId,
          userName: balance.toUserName,
          amount: balance.amount,
        });
        netBalance -= balance.amount;
      } else if (balance.toUserId === userId) {
        // Someone owes the user
        owedBy.push({
          userId: balance.fromUserId,
          userName: balance.fromUserName,
          amount: balance.amount,
        });
        netBalance += balance.amount;
      }
    });

    logger.info(`User balance calculated for user ${userId} in group ${groupId}`);

    return {
      userId,
      groupId,
      netBalance: Math.round(netBalance * 100) / 100,
      owes,
      owedBy,
    };
  }

  private async checkGroupMembership(groupId: string, userId: string): Promise<void> {
    const membership = await groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!membership) {
      throw new AppError(403, 'User is not a member of this group', 'NOT_A_MEMBER');
    }
  }
}

export default new BalanceService();
