import apiClient from './api.client';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  basePrice: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  category?: { name: string; slug: string };
  badges: string[];
  images: Array<{ url: string; isPrimary: boolean }>;
  variants: Array<{ id: string; name: string; sku: string; priceModifier: number; inventory?: { quantityOnHand: number; quantityReserved: number; lowStockThreshold: number } }>;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductFilters {
  status?: string;
  category?: string;
  badge?: string;
  stockLevel?: 'in_stock' | 'low' | 'out_of_stock';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface BulkPriceRule {
  type: 'set' | 'increase_amount' | 'decrease_amount' | 'increase_percent' | 'decrease_percent';
  value: number;
  applyToCompareAt?: boolean;
  clearCompareAt?: boolean;
}

const adminService = {
  // Products
  async getProducts(filters: AdminProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    const res = await apiClient.get(`/admin/products?${params}`);
    return res.data;
  },

  async createProduct(dto: Partial<AdminProduct>) {
    const res = await apiClient.post('/admin/products', dto);
    return res.data;
  },

  async updateProduct(id: string, dto: Partial<AdminProduct>) {
    const res = await apiClient.patch(`/admin/products/${id}`, dto);
    return res.data;
  },

  async deleteProduct(id: string) {
    const res = await apiClient.delete(`/admin/products/${id}`);
    return res.data;
  },

  async duplicateProduct(id: string) {
    const res = await apiClient.post(`/admin/products/${id}/duplicate`);
    return res.data;
  },

  async bulkUpdateStatus(ids: string[], status: string) {
    const res = await apiClient.patch('/admin/products/bulk-status', { ids, status });
    return res.data;
  },

  async bulkUpdatePrice(ids: string[], rule: BulkPriceRule) {
    const res = await apiClient.patch('/admin/products/bulk-price', { ids, rule });
    return res.data;
  },

  exportProductsCsvUrl(filters: AdminProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    return `${process.env.NEXT_PUBLIC_API_URL}/admin/products/export?${params}`;
  },

  async importProductsCsv(file: File, mode: 'create' | 'update') {
    const form = new FormData();
    form.append('file', file);
    form.append('mode', mode);
    const res = await apiClient.post('/admin/products/import', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  },

  // Orders
  async getOrders(filters: { page?: number; limit?: number; status?: string } = {}) {
    const res = await apiClient.get('/orders', { params: filters });
    return res.data;
  },

  async updateOrderStatus(id: string, status: string, notes?: string) {
    const res = await apiClient.patch(`/orders/${id}/status`, { status, notes });
    return res.data;
  },

  // Customers
  async getCustomers(filters: { page?: number; limit?: number; search?: string } = {}) {
    const res = await apiClient.get('/admin/customers', { params: filters });
    return res.data;
  },

  // Subscriptions
  async getSubscriptions(filters: { page?: number; limit?: number; status?: string } = {}) {
    const res = await apiClient.get('/subscriptions/admin', { params: filters });
    return res.data;
  },

  // Analytics
  async getAnalytics() {
    const res = await apiClient.get('/admin/analytics');
    return res.data;
  },

  // Reviews
  async getPendingReviews(page = 1) {
    const res = await apiClient.get('/reviews/admin/pending', { params: { page } });
    return res.data;
  },

  async approveReview(id: string) {
    const res = await apiClient.patch(`/reviews/admin/${id}/approve`);
    return res.data;
  },

  async rejectReview(id: string) {
    const res = await apiClient.delete(`/reviews/admin/${id}/reject`);
    return res.data;
  },

  // Inventory
  async getInventoryStats() {
    const res = await apiClient.get('/admin/inventory/stats');
    return res.data;
  },

  async getLowStockItems() {
    const res = await apiClient.get('/inventory', { params: { threshold: 10 } });
    return res.data;
  },

  async notifyBackInStock(productId: string) {
    const res = await apiClient.post(`/notifications/back-in-stock/notify-all`, { productId });
    return res.data;
  },
};

export default adminService;
