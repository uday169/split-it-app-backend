import { apiClient } from './client';
import {
  Settlement,
  SettlementsListResponse,
  CreateSettlementRequest,
  ApiResponse,
} from '../types/api.types';

export const settlementApi = {
  getSettlements: async (
    groupId: string,
    status: 'pending' | 'confirmed' | 'all' = 'all',
    page = 1,
    limit = 20
  ) => {
    const response = await apiClient.get<ApiResponse<SettlementsListResponse>>(
      `/groups/${groupId}/settlements`,
      { params: { status, page, limit } }
    );
    return response.data.data;
  },

  createSettlement: async (data: CreateSettlementRequest) => {
    const response = await apiClient.post<ApiResponse<Settlement>>(
      '/settlements',
      data
    );
    return response.data.data;
  },

  confirmSettlement: async (settlementId: string) => {
    const response = await apiClient.post<
      ApiResponse<{ id: string; status: string; confirmedAt: string }>
    >(`/settlements/${settlementId}/confirm`);
    return response.data.data;
  },
};
