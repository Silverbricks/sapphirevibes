import apiClient from './api.client';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post('/auth/register', payload);
    return data.data as { user: any; accessToken: string; refreshToken: string };
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post('/auth/login', payload);
    return data.data as { user: any; accessToken: string; refreshToken: string };
  },

  async logout() {
    try { await apiClient.post('/auth/logout'); } catch { /* noop */ }
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data.data as { message: string };
  },

  async resetPassword(token: string, password: string) {
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data.data as { message: string };
  },

  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data.data;
  },
};
