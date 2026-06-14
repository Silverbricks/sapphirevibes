import apiClient from './api.client';

export const subscriptionsService = {
  async getPlans() {
    const { data } = await apiClient.get('/subscriptions/plans');
    return data.data;
  },
  async getMy() {
    const { data } = await apiClient.get('/subscriptions/my');
    return data.data;
  },
  async subscribe(planId: string) {
    const { data } = await apiClient.post('/subscriptions', { planId });
    return data.data;
  },
  async pause(reason?: string) {
    const { data } = await apiClient.patch('/subscriptions/my/pause', { reason });
    return data.data;
  },
  async resume() {
    const { data } = await apiClient.patch('/subscriptions/my/resume');
    return data.data;
  },
  async cancel() {
    const { data } = await apiClient.delete('/subscriptions/my');
    return data.data;
  },
  async getBenefits() {
    const { data } = await apiClient.get('/subscriptions/my/benefits');
    return data.data;
  },
};
