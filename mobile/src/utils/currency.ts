/**
 * Format amount to currency string
 * Amount is stored in cents, so we divide by 100 (except for zero-decimal currencies)
 */
export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };

  // Zero-decimal currencies (no cents)
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND'];

  const symbol = currencySymbols[currency] || currency;
  
  if (zeroDecimalCurrencies.includes(currency)) {
    // For zero-decimal currencies, amount is already in the base unit
    return `${symbol}${Math.round(amount / 100)}`;
  }
  
  // For other currencies, divide by 100 to convert from cents
  const value = (amount / 100).toFixed(2);
  return `${symbol}${value}`;
};
