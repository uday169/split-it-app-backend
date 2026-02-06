import { apiClient } from './client';
import {
  User,
  UpdateProfileRequest,
  ApiResponse,
} from '../types/api.types';

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.patch<ApiResponse<User>>(
      '/users/me',
      data
    );
    return response.data.data;
  },
};
