import { apiClient } from './client';
import {
  BalancesResponse,
  UserBalanceResponse,
  ApiResponse,
} from '../types/api.types';

export const balanceApi = {
  getBalances: async (groupId: string) => {
    const response = await apiClient.get<ApiResponse<BalancesResponse>>(
      `/groups/${groupId}/balances`
    );
    return response.data.data;
  },

  getUserBalance: async (groupId: string) => {
    const response = await apiClient.get<ApiResponse<UserBalanceResponse>>(
      `/groups/${groupId}/balances/me`
    );
    return response.data.data;
  },
};
