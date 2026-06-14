import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from localStorage on every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sv-access-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Refresh token on 401
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('sv-refresh-token')
            : null;
          if (!refreshToken) throw new Error('No refresh token');

          // baseURL already contains /api/v1 so path is just /auth/refresh
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true },
          );
          const newToken: string = data.data.accessToken;
          localStorage.setItem('sv-access-token', newToken);
          refreshQueue.forEach((cb) => cb(newToken));
          refreshQueue = [];
          isRefreshing = false;
          if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        } catch {
          isRefreshing = false;
          refreshQueue = [];
          localStorage.removeItem('sv-access-token');
          localStorage.removeItem('sv-refresh-token');
          window.location.href = '/login';
        }
      }
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          if (original.headers) original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }
    return Promise.reject(error);
  },
);

export default apiClient;
