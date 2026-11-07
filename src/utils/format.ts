export type Currency = 'TND' | 'EUR' | 'USD' | 'GBP';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  TND: { symbol: 'DT', rate: 1.0, label: 'TND (DT)' },
  EUR: { symbol: '€', rate: 0.30, label: 'EUR (€)' },
  USD: { symbol: '$', rate: 0.32, label: 'USD ($)' },
  GBP: { symbol: '£', rate: 0.25, label: 'GBP (£)' },
};

export function formatPrice(amountInTND: number, currency: Currency = 'TND', showMillimes: boolean = false): string {
  const { symbol, rate } = CURRENCY_RATES[currency] || CURRENCY_RATES.TND;
  const converted = amountInTND * rate;

  if (currency === 'TND') {
    if (showMillimes) {
      return `${converted.toFixed(3)} DT`;
    }
    return `${Math.round(converted)} DT`;
  }

  return `${symbol}${Math.round(converted)}`;
}
