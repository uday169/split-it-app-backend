import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authStore } from '../store/authStore';
import { SendOtpRequest, VerifyOtpRequest } from '../types/api.types';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpRequest) => authApi.sendOtp(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      const response = await authApi.verifyOtp(data);
      await authStore.setToken(response.token);
      await authStore.setUser(response.user);
      return response;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await authStore.clearAll();
    },
  });
};
