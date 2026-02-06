import { useQuery } from '@tanstack/react-query';
import { balanceApi } from '../api/balance.api';

export const useBalances = (groupId: string) => {
  return useQuery({
    queryKey: ['balances', groupId],
    queryFn: () => balanceApi.getBalances(groupId),
    enabled: !!groupId,
  });
};

export const useUserBalance = (groupId: string) => {
  return useQuery({
    queryKey: ['userBalance', groupId],
    queryFn: () => balanceApi.getUserBalance(groupId),
    enabled: !!groupId,
  });
};
