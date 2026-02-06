import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settlementApi } from '../api/settlement.api';
import { CreateSettlementRequest } from '../types/api.types';

export const useSettlements = (
  groupId: string,
  status: 'pending' | 'confirmed' | 'all' = 'all',
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: ['settlements', groupId, status, page, limit],
    queryFn: () => settlementApi.getSettlements(groupId, status, page, limit),
    enabled: !!groupId,
  });
};

export const useCreateSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettlementRequest) => settlementApi.createSettlement(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settlements', data.groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', data.groupId] });
    },
  });
};

export const useConfirmSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ settlementId, groupId }: { settlementId: string; groupId: string }) =>
      settlementApi.confirmSettlement(settlementId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['settlements', groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });
};
