import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '../api/expense.api';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../types/api.types';

export const useExpenses = (groupId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['expenses', groupId, page, limit],
    queryFn: () => expenseApi.getExpenses(groupId, page, limit),
    enabled: !!groupId,
  });
};

export const useExpense = (expenseId: string) => {
  return useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => expenseApi.getExpense(expenseId),
    enabled: !!expenseId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expenseApi.createExpense(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', data.groupId] });
      queryClient.invalidateQueries({ queryKey: ['group', data.groupId] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, data }: { expenseId: string; data: UpdateExpenseRequest }) =>
      expenseApi.updateExpense(expenseId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
      queryClient.invalidateQueries({ queryKey: ['expenses', data.groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', data.groupId] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, groupId }: { expenseId: string; groupId: string }) =>
      expenseApi.deleteExpense(expenseId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      queryClient.invalidateQueries({ queryKey: ['balances', groupId] });
    },
  });
};
