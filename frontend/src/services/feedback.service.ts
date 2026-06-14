import apiClient from './api.client';

export interface FeedbackPayload {
  targetId: string;
  rating: number;
  comment?: string;
  categories?: string[];
}

export interface FeedbackItem {
  id: string;
  rating: number;
  comment?: string | null;
  categories: string[];
  createdAt: string;
  userId?: string | null;
}

export interface FeedbackSummary {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

export const feedbackService = {
  async create(payload: FeedbackPayload): Promise<FeedbackItem> {
    const { data } = await apiClient.post('/feedback', payload);
    return data.data ?? data;
  },

  async list(targetId: string, page = 1, sort: 'newest' | 'highest' | 'lowest' = 'newest') {
    const { data } = await apiClient.get('/feedback', { params: { target_id: targetId, page, sort } });
    return data.data ?? data;
  },

  async getSummary(targetId: string): Promise<FeedbackSummary> {
    const { data } = await apiClient.get('/feedback/summary', { params: { target_id: targetId } });
    return data.data ?? data;
  },
};
