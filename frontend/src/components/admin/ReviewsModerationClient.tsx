'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '@/services/admin.service';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, ease } from '@/lib/motion';

export function ReviewsModerationClient() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-reviews'], queryFn: () => adminService.getPendingReviews() });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveReview(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast('Review approved'); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectReview(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast('Review removed'); },
  });

  const reviews = data?.data ?? [];

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>Reviews / UGC</h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--cream-dim)' }}>Moderate pending reviews before they appear on product pages.</p>
      </div>

      {isLoading && <div style={{ color: 'var(--cream-dim)', fontSize: '0.86rem' }}>Loading reviews…</div>}

      {!isLoading && reviews.length === 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--cream-dim)', fontSize: '0.9rem' }}>
          No pending reviews — all caught up!
        </div>
      )}

      <AnimatePresence>
        {reviews.map((r: any, i: number) => (
          <motion.div
            key={r.id}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35, ease, delay: i * 0.04 }}
            style={{ marginBottom: 16, border: '1px solid var(--line)', background: 'var(--ink-soft)', padding: '18px 20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--gold)', letterSpacing: 2 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  {r.isVerifiedPurchase && (
                    <span style={{ fontSize: '0.68rem', padding: '2px 7px', background: 'rgba(39,174,96,.15)', color: '#27ae60', border: '1px solid rgba(39,174,96,.3)' }}>Verified purchase</span>
                  )}
                </div>
                {r.title && <div style={{ fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>{r.title}</div>}
                <div style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: 1.5 }}>{r.body}</div>
                <div style={{ marginTop: 10, fontSize: '0.76rem', color: 'var(--cream-dim)' }}>
                  By <b style={{ color: 'var(--cream)' }}>{r.user?.firstName} {r.user?.lastName}</b>
                  {r.product && <> on <b style={{ color: 'var(--gold)' }}>{r.product.name}</b></>}
                  <span style={{ marginLeft: 10 }}>{new Date(r.createdAt).toLocaleDateString('en-AU')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => approveMutation.mutate(r.id)}
                  disabled={approveMutation.isPending}
                  style={{ padding: '7px 16px', background: 'rgba(39,174,96,.15)', border: '1px solid rgba(39,174,96,.4)', color: '#27ae60', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectMutation.mutate(r.id)}
                  disabled={rejectMutation.isPending}
                  style={{ padding: '7px 16px', background: 'rgba(226,92,62,.1)', border: '1px solid rgba(226,92,62,.4)', color: '#e25c3e', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
