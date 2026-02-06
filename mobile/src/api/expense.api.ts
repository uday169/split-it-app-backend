import { apiClient } from './client';
import {
  Expense,
  ExpenseDetails,
  ExpensesListResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ApiResponse,
} from '../types/api.types';

export const expenseApi = {
  getExpenses: async (groupId: string, page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<ExpensesListResponse>>(
      `/groups/${groupId}/expenses`,
      { params: { page, limit } }
    );
    return response.data.data;
  },

  getExpense: async (expenseId: string) => {
    const response = await apiClient.get<ApiResponse<ExpenseDetails>>(
      `/expenses/${expenseId}`
    );
    return response.data.data;
  },

  createExpense: async (data: CreateExpenseRequest) => {
    const response = await apiClient.post<ApiResponse<ExpenseDetails>>(
      '/expenses',
      data
    );
    return response.data.data;
  },

  updateExpense: async (expenseId: string, data: UpdateExpenseRequest) => {
    const response = await apiClient.patch<ApiResponse<ExpenseDetails>>(
      `/expenses/${expenseId}`,
      data
    );
    return response.data.data;
  },

  deleteExpense: async (expenseId: string) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/expenses/${expenseId}`
    );
    return response.data.data;
  },
};
