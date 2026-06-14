'use client';

import { useCurrencyStore } from '@/store/currencyStore';
import { useEffect } from 'react';

const RATES_URL = 'https://open.er-api.com/v6/latest/AUD';
const RATES_TTL = 60 * 60 * 1000; // 1 hour
let lastFetch = 0;

export function useCurrency() {
  const { currency, rate, setRates } = useCurrencyStore();

  useEffect(() => {
    if (Date.now() - lastFetch < RATES_TTL) return;
    lastFetch = Date.now();
    fetch(RATES_URL)
      .then(r => r.json())
      .then(data => { if (data.rates) setRates(data.rates); })
      .catch(() => {}); // Silently fail — use 1:1 rate
  }, [setRates]);

  function formatPrice(audAmount: number): string {
    const converted = audAmount * rate;
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(converted);
  }

  return { formatPrice, currency, rate };
}
