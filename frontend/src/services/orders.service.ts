import apiClient from './api.client';
import type { CheckoutAddress } from '@/components/checkout/CheckoutClient';

export const ordersService = {
  async create(shippingAddress: CheckoutAddress | string, paymentIntentId?: string) {
    const payload = typeof shippingAddress === 'string'
      ? { shippingAddressId: shippingAddress, paymentIntentId }
      : { shippingAddress, paymentIntentId };
    const { data } = await apiClient.post('/orders', payload);
    return data.data;
  },

  async getMyOrders(page = 1) {
    const { data } = await apiClient.get(`/orders/my?page=${page}`);
    return data.data;
  },

  async getOrder(id: string) {
    const { data } = await apiClient.get(`/orders/my/${id}`);
    return data.data;
  },
};
