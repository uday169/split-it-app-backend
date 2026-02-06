import { apiClient } from './client';
import {
  SendOtpRequest,
  VerifyOtpRequest,
  SendOtpResponse,
  AuthResponse,
  ApiResponse,
} from '../types/api.types';

export const authApi = {
  sendOtp: async (data: SendOtpRequest) => {
    const response = await apiClient.post<ApiResponse<SendOtpResponse>>(
      '/auth/send-otp',
      data
    );
    return response.data.data;
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/verify-otp',
      data
    );
    return response.data.data;
  },
};
