import expenseRepository from '../repositories/expense.repository';
import settlementRepository from '../repositories/settlement.repository';
import groupMemberRepository from '../repositories/groupMember.repository';
import userRepository from '../repositories/user.repository';
import groupRepository from '../repositories/group.repository';
import logger from '../config/logger';

interface ActivityItem {
  id: string;
  type: 'expense' | 'settlement';
  groupId: string;
  groupName: string;
  description: string;
  amount: number;
  currency: string;
  paidBy?: {
    userId: string;
    name: string;
  };
  paidTo?: {
    userId: string;
    name: string;
  };
  userShare?: number;
  createdAt: string;
}

interface ActivityResult {
  activities: ActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export class ActivityService {
  /**
   * Get user's activity feed (expenses and settlements from all their groups)
   */
  async getUserActivity(userId: string, page: number, limit: number): Promise<ActivityResult> {
    // Get all groups the user is a member of
    const userMemberships = await groupMemberRepository.findByUserId(userId);
    const groupIds = userMemberships.map((m) => m.groupId);

    if (groupIds.length === 0) {
      return {
        activities: [],
        pagination: {
          page,
          limit,
          total: 0,
          hasMore: false,
        },
      };
    }

    // Get groups information
    const groups = await groupRepository.findByIds(groupIds);
    const groupMap = new Map(groups.map((g) => [g.id, g]));

    // Get recent expenses from all groups
    const expensesPromises = groupIds.map((groupId) =>
      expenseRepository.findByGroupId(groupId, 100)
    );
    const expensesByGroup = await Promise.all(expensesPromises);
    const allExpenses = expensesByGroup.flat();

    // Get recent settlements from all groups
    const settlementsPromises = groupIds.map((groupId) =>
      settlementRepository.findByGroupId(groupId, 100)
    );
    const settlementsByGroup = await Promise.all(settlementsPromises);
    const allSettlements = settlementsByGroup.flat();

    // Get all unique user IDs
    const userIds = new Set<string>();
    allExpenses.forEach((e) => userIds.add(e.paidBy));
    allSettlements.forEach((s) => {
      userIds.add(s.paidBy);
      userIds.add(s.paidTo);
    });

    // Fetch all users at once
    const users = await userRepository.findByIds(Array.from(userIds));
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Convert expenses to activity items
    const expenseActivities: ActivityItem[] = allExpenses.map((expense) => {
      const paidByUser = userMap.get(expense.paidBy);
      const group = groupMap.get(expense.groupId);

      return {
        id: expense.id,
        type: 'expense' as const,
        groupId: expense.groupId,
        groupName: group?.name || 'Unknown Group',
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        paidBy: {
          userId: expense.paidBy,
          name: paidByUser?.name || 'Unknown User',
        },
        createdAt: expense.createdAt,
      };
    });

    // Convert settlements to activity items
    const settlementActivities: ActivityItem[] = allSettlements.map((settlement) => {
      const paidByUser = userMap.get(settlement.paidBy);
      const paidToUser = userMap.get(settlement.paidTo);
      const group = groupMap.get(settlement.groupId);

      return {
        id: settlement.id,
        type: 'settlement' as const,
        groupId: settlement.groupId,
        groupName: group?.name || 'Unknown Group',
        description: `Settlement: ${paidByUser?.name || 'Unknown'} → ${paidToUser?.name || 'Unknown'}`,
        amount: settlement.amount,
        currency: settlement.currency,
        paidBy: {
          userId: settlement.paidBy,
          name: paidByUser?.name || 'Unknown User',
        },
        paidTo: {
          userId: settlement.paidTo,
          name: paidToUser?.name || 'Unknown User',
        },
        createdAt: settlement.createdAt,
      };
    });

    // Combine and sort by date (newest first)
    const allActivities = [...expenseActivities, ...settlementActivities].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const total = allActivities.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = allActivities.slice(startIndex, endIndex);

    logger.info(`Activity feed fetched for user ${userId}: ${paginatedActivities.length} items`);

    return {
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total,
        hasMore: endIndex < total,
      },
    };
  }
}

export default new ActivityService();
