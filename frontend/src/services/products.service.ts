import apiClient from './api.client';

export interface ProductQuery {
  category?: string;
  search?: string;
  badge?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productsService = {
  async list(query: ProductQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
    const { data } = await apiClient.get(`/products?${params}`);
    return data.data;
  },

  async getBySlug(slug: string) {
    const { data } = await apiClient.get(`/products/${slug}`);
    return data.data;
  },

  async getFeatured() {
    const { data } = await apiClient.get('/products/featured');
    return data.data;
  },

  async getCollection(type: 'latest' | 'hot' | 'trending' | 'festival-deals') {
    const { data } = await apiClient.get(`/products/collections/${type}`);
    return data.data;
  },

  async getFestival(type: string) {
    const { data } = await apiClient.get(`/products/festival/${type}`);
    return data.data;
  },
};
