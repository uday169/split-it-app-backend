/**
 * Format amount to currency string
 * Amount is stored in cents, so we divide by 100
 */
export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };

  const symbol = currencySymbols[currency] || currency;
  const value = (amount / 100).toFixed(2);
  
  return `${symbol}${value}`;
};
