import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'AUD', symbol: 'A$', locale: 'en-AU' },
  { code: 'USD', symbol: 'US$', locale: 'en-US' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA' },
  { code: 'INR', symbol: '₹', locale: 'en-IN' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG' },
];

interface CurrencyStore {
  currency: CurrencyInfo;
  rate: number;
  rates: Record<string, number>;
  setCurrency: (code: string) => void;
  setRates: (rates: Record<string, number>) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: CURRENCIES[0], // default AUD
      rate: 1,
      rates: {},

      setCurrency(code) {
        const info = CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
        const rate = code === 'AUD' ? 1 : (get().rates[code] ?? 1);
        set({ currency: info, rate });
      },

      setRates(rates) {
        set({ rates });
        // Update rate for current currency if not AUD
        const { currency } = get();
        if (currency.code !== 'AUD') {
          set({ rate: rates[currency.code] ?? 1 });
        }
      },
    }),
    { name: 'sv-currency', partialize: (s) => ({ currency: s.currency }) },
  ),
);
