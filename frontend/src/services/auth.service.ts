import { api } from '../lib/api';
import { ApiResponse, User } from '../types/api';

interface LoginResponse {
  user?: User;
  accessToken?: string;
  // Returned instead of a session when the account has 2FA on and no code was
  // supplied yet. The password was already accepted at this point.
  twoFactorRequired?: boolean;
}

export interface AccountProfile extends User {
  twoFactorEnabled: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  otpauth: string;
  qrDataUrl: string;
}

export const authService = {
  login: async (email: string, password: string, twoFactorCode?: string) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
      ...(twoFactorCode ? { twoFactorCode } : {}),
    });
    return response.data.data;
  },
  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return response.data.data;
  },
  me: async () => {
    const response = await api.get<ApiResponse<AccountProfile>>('/auth/me');
    return response.data.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  changeEmail: async (currentPassword: string, newEmail: string) => {
    const response = await api.post<ApiResponse<User>>('/auth/change-email', {
      currentPassword,
      newEmail,
    });
    return response.data.data;
  },
  twoFactorSetup: async () => {
    const response = await api.post<ApiResponse<TwoFactorSetup>>('/auth/2fa/setup');
    return response.data.data;
  },
  twoFactorEnable: async (code: string) => {
    const response = await api.post<ApiResponse<void>>('/auth/2fa/enable', { code });
    return response.data;
  },
  twoFactorDisable: async (currentPassword: string, code: string) => {
    const response = await api.post<ApiResponse<void>>('/auth/2fa/disable', { currentPassword, code });
    return response.data;
  },
};
