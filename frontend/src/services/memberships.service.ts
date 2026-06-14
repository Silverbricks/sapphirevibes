import apiClient from './api.client';

export const membershipsService = {
  async getTiers() {
    const { data } = await apiClient.get('/memberships/tiers');
    return data.data;
  },
  async getMy() {
    const { data } = await apiClient.get('/memberships/my');
    return data.data;
  },
  async getRewardsBalance() {
    const { data } = await apiClient.get('/memberships/my/rewards');
    return data.data as { balance: number };
  },
  async getRewardsHistory() {
    const { data } = await apiClient.get('/memberships/my/rewards/history');
    return data.data;
  },
  async redeemPoints(points: number) {
    const { data } = await apiClient.post('/memberships/my/rewards/redeem', { points });
    return data.data as { dollarValue: number };
  },
};
