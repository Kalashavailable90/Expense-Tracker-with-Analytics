import { format, parseISO, isValid } from 'date-fns';

/**
 * Currency formatter for Indian Rupees (₹) with Indian numbering format (Lakhs & Crores).
 * @param {number} amount
 * @param {string} currency - default 'INR'
 * @returns {string} e.g. "₹1,50,000.00"
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Compact currency formatter for charts and summary counters (e.g. ₹1.5L, ₹45K, ₹1.2Cr).
 * @param {number} amount
 * @returns {string}
 */
export const formatCompactCurrency = (amount) => {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  if (Math.abs(numericAmount) >= 10000000) {
    return `₹${(numericAmount / 10000000).toFixed(1)}Cr`;
  }
  if (Math.abs(numericAmount) >= 100000) {
    return `₹${(numericAmount / 100000).toFixed(1)}L`;
  }
  if (Math.abs(numericAmount) >= 1000) {
    return `₹${(numericAmount / 1000).toFixed(1)}K`;
  }
  return `₹${numericAmount.toFixed(0)}`;
};

/**
 * Format ISO or Date string into human readable format (e.g. "22 Nov, 2026").
 * @param {string|Date} date
 * @param {string} formatStr - default 'dd MMM, yyyy'
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'dd MMM, yyyy') => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(parsed)) return 'Invalid date';
    return format(parsed, formatStr);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date for input[type="date"] (YYYY-MM-DD)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(parsed)) return '';
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

/**
 * Format percentage with one decimal place.
 * @param {number} value
 * @returns {string} e.g. "45.2%"
 */
export const formatPercentage = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
};

/**
 * Truncate long text strings cleanly.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncateText = (str, maxLen = 30) => {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return `${str.substring(0, maxLen).trim()}…`;
};
