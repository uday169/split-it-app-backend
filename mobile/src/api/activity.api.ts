import { apiClient } from './client';
import { ApiResponse } from '../types/api.types';

export interface ActivityItem {
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

export interface ActivityResponse {
  activities: ActivityItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const activityApi = {
  getActivity: async (page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<ActivityResponse>>(
      '/activity',
      { params: { page, limit } }
    );
    return response.data.data;
  },
};
