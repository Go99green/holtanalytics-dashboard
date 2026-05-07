export const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export const percent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const number = new Intl.NumberFormat('en-US');

export function formatCurrency(value: number): string { return currency.format(value); }
export function formatPercent(value: number): string { return percent.format(value); }
export function formatNumber(value: number): string { return number.format(Math.round(value)); }
export function formatCompact(value: number): string { return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value); }
