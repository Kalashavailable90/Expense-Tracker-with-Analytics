import {
  parseISO,
  isValid,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { getCategoryColor } from '../data/categories';

/**
 * Helper to compute date interval from timeframe identifier.
 * @param {string} timeframe - 'this-month' | 'last-month' | 'last-3-months' | 'all-time'
 * @param {Date} referenceDate
 * @returns {{ start: Date, end: Date } | null}
 */
export const getTimeframeInterval = (timeframe = 'this-month', referenceDate = new Date()) => {
  const ref = isValid(referenceDate) ? referenceDate : new Date();

  switch (timeframe) {
    case 'last-month': {
      const prev = subMonths(ref, 1);
      return { start: startOfMonth(prev), end: endOfMonth(prev) };
    }
    case 'last-3-months': {
      const threeMonthsAgo = subMonths(ref, 2);
      return { start: startOfMonth(threeMonthsAgo), end: endOfMonth(ref) };
    }
    case 'all-time': {
      return null;
    }
    case 'this-month':
    default: {
      return { start: startOfMonth(ref), end: endOfMonth(ref) };
    }
  }
};

/**
 * Filter transactions by timeframe.
 * @param {Array} transactions
 * @param {string} timeframe
 * @returns {Array}
 */
export const filterByTimeframe = (transactions = [], timeframe = 'this-month') => {
  if (!Array.isArray(transactions)) return [];
  const interval = getTimeframeInterval(timeframe);
  if (!interval) return transactions;

  return transactions.filter((t) => {
    if (!t.date) return false;
    const d = parseISO(t.date);
    return isValid(d) && isWithinInterval(d, interval);
  });
};

/**
 * Calculates dashboard totals: balance, income, expenses, savings rate.
 * @param {Array} transactions
 * @param {string} timeframe - optional filter
 * @returns {{ totalBalance: number, totalIncome: number, totalExpenses: number, savingsRate: number }}
 */
export const calculateTotals = (transactions = [], timeframe = null) => {
  const list = timeframe ? filterByTimeframe(transactions, timeframe) : transactions;

  if (!Array.isArray(list) || list.length === 0) {
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      savingsRate: 0,
    };
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of list) {
    const amount = Number(t.amount) || 0;
    if (t.type === 'income') {
      totalIncome += amount;
    } else if (t.type === 'expense') {
      totalExpenses += amount;
    }
  }

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0
      ? Math.max(-100, Math.min(100, ((totalIncome - totalExpenses) / totalIncome) * 100))
      : 0;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate,
  };
};

/**
 * Aggregates expense transactions by category for donut chart.
 * @param {Array} transactions
 * @param {string|Date|null} targetMonthOrTimeframe
 * @returns {Array<{ name: string, value: number, percentage: number, color: string, count: number }>}
 */
export const calculateSpendingByCategory = (transactions = [], targetMonthOrTimeframe = 'this-month') => {
  if (!Array.isArray(transactions)) return [];

  let filtered = transactions.filter((t) => t.type === 'expense');

  if (typeof targetMonthOrTimeframe === 'string' && ['this-month', 'last-month', 'last-3-months', 'all-time'].includes(targetMonthOrTimeframe)) {
    filtered = filterByTimeframe(filtered, targetMonthOrTimeframe);
  } else if (targetMonthOrTimeframe) {
    const targetDate = typeof targetMonthOrTimeframe === 'string' ? parseISO(targetMonthOrTimeframe) : targetMonthOrTimeframe;
    if (isValid(targetDate)) {
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);
      filtered = filtered.filter((t) => {
        const d = parseISO(t.date);
        return isValid(d) && isWithinInterval(d, { start: monthStart, end: monthEnd });
      });
    }
  }

  const categoryMap = {};
  const countMap = {};
  let totalSpent = 0;

  for (const t of filtered) {
    const amount = Number(t.amount) || 0;
    const cat = t.category || 'Other Expenses';
    categoryMap[cat] = (categoryMap[cat] || 0) + amount;
    countMap[cat] = (countMap[cat] || 0) + 1;
    totalSpent += amount;
  }

  return Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      count: countMap[name] || 1,
      percentage: totalSpent > 0 ? (value / totalSpent) * 100 : 0,
      color: getCategoryColor(name),
    }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Calculates monthly income vs expenses for the past N months.
 * @param {Array} transactions
 * @param {number} monthCount - default 6
 * @param {Date} referenceDate - default new Date()
 * @returns {Array<{ monthKey: string, label: string, income: number, expenses: number, netSavings: number }>}
 */
export const calculateMonthlyIncomeVsExpense = (
  transactions = [],
  monthCount = 6,
  referenceDate = new Date()
) => {
  const months = [];
  const validReference = isValid(referenceDate) ? referenceDate : new Date();

  for (let i = monthCount - 1; i >= 0; i--) {
    const monthDate = subMonths(validReference, i);
    const monthKey = format(monthDate, 'yyyy-MM');
    const label = format(monthDate, 'MMM yyyy');
    months.push({
      monthKey,
      label,
      date: monthDate,
      income: 0,
      expenses: 0,
      netSavings: 0,
    });
  }

  if (Array.isArray(transactions)) {
    for (const t of transactions) {
      if (!t.date) continue;
      const parsedDate = parseISO(t.date);
      if (!isValid(parsedDate)) continue;

      const tMonthKey = format(parsedDate, 'yyyy-MM');
      const targetMonth = months.find((m) => m.monthKey === tMonthKey);
      if (targetMonth) {
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') {
          targetMonth.income += amount;
        } else if (t.type === 'expense') {
          targetMonth.expenses += amount;
        }
      }
    }
  }

  return months.map(({ monthKey, label, income, expenses }) => ({
    monthKey,
    label,
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    netSavings: Math.round((income - expenses) * 100) / 100,
  }));
};

/**
 * Evaluates budget status for each category for a specified month.
 * @param {Array} transactions
 * @param {Array} budgets - [{ category, monthlyLimit }]
 * @param {Date|string} targetMonth
 * @returns {Array<{ category: string, spent: number, limit: number, percentage: number, remaining: number, isExceeded: boolean, isWarning: boolean }>}
 */
export const calculateBudgetStatus = (transactions = [], budgets = [], targetMonth = new Date()) => {
  const targetDate = typeof targetMonth === 'string' ? parseISO(targetMonth) : targetMonth;
  const validDate = isValid(targetDate) ? targetDate : new Date();
  const monthStart = startOfMonth(validDate);
  const monthEnd = endOfMonth(validDate);

  const monthExpenses = (Array.isArray(transactions) ? transactions : []).filter((t) => {
    if (t.type !== 'expense' || !t.date) return false;
    const d = parseISO(t.date);
    return isValid(d) && isWithinInterval(d, { start: monthStart, end: monthEnd });
  });

  const spentByCategory = {};
  for (const t of monthExpenses) {
    const amount = Number(t.amount) || 0;
    spentByCategory[t.category] = (spentByCategory[t.category] || 0) + amount;
  }

  return (Array.isArray(budgets) ? budgets : []).map((b) => {
    const spent = Math.round((spentByCategory[b.category] || 0) * 100) / 100;
    const limit = Number(b.monthlyLimit) || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const remaining = Math.round((limit - spent) * 100) / 100;
    const isExceeded = limit > 0 && spent > limit;
    const isWarning = limit > 0 && !isExceeded && percentage >= 80;

    return {
      category: b.category,
      spent,
      limit,
      percentage: Math.min(percentage, 100),
      rawPercentage: percentage,
      remaining,
      isExceeded,
      isWarning,
      color: getCategoryColor(b.category),
    };
  });
};

/**
 * Returns the top N largest expense transactions for a target timeframe.
 * @param {Array} transactions
 * @param {string|Date} targetMonthOrTimeframe
 * @param {number} limit
 * @returns {Array}
 */
export const calculateTopExpenses = (transactions = [], targetMonthOrTimeframe = 'this-month', limit = 5) => {
  if (!Array.isArray(transactions)) return [];

  let filtered = transactions.filter((t) => t.type === 'expense');

  if (typeof targetMonthOrTimeframe === 'string' && ['this-month', 'last-month', 'last-3-months', 'all-time'].includes(targetMonthOrTimeframe)) {
    filtered = filterByTimeframe(filtered, targetMonthOrTimeframe);
  } else if (targetMonthOrTimeframe) {
    const targetDate = typeof targetMonthOrTimeframe === 'string' ? parseISO(targetMonthOrTimeframe) : targetMonthOrTimeframe;
    const validDate = isValid(targetDate) ? targetDate : new Date();
    const monthStart = startOfMonth(validDate);
    const monthEnd = endOfMonth(validDate);

    filtered = filtered.filter((t) => {
      const d = parseISO(t.date);
      return isValid(d) && isWithinInterval(d, { start: monthStart, end: monthEnd });
    });
  }

  return [...filtered]
    .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .slice(0, limit);
};

/**
 * Generates descriptive analytics insights comparing current month to prior month.
 * @param {Array} transactions
 * @param {Date|string} targetMonth
 * @returns {Array<{ id: string, type: 'warning'|'success'|'info', text: string, category?: string }>}
 */
export const calculateCategoryInsights = (transactions = [], targetMonth = new Date()) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [
      {
        id: 'no-data',
        type: 'info',
        text: 'Record your first transaction to start seeing smart financial insights.',
      },
    ];
  }

  const targetDate = typeof targetMonth === 'string' ? parseISO(targetMonth) : targetMonth;
  const validDate = isValid(targetDate) ? targetDate : new Date();

  const currStart = startOfMonth(validDate);
  const currEnd = endOfMonth(validDate);

  const prevMonthDate = subMonths(validDate, 1);
  const prevStart = startOfMonth(prevMonthDate);
  const prevEnd = endOfMonth(prevMonthDate);

  const currExpenses = {};
  const prevExpenses = {};
  let totalCurrExpense = 0;
  let totalPrevExpense = 0;

  for (const t of transactions) {
    if (t.type !== 'expense' || !t.date) continue;
    const d = parseISO(t.date);
    if (!isValid(d)) continue;
    const amt = Number(t.amount) || 0;

    if (isWithinInterval(d, { start: currStart, end: currEnd })) {
      currExpenses[t.category] = (currExpenses[t.category] || 0) + amt;
      totalCurrExpense += amt;
    } else if (isWithinInterval(d, { start: prevStart, end: prevEnd })) {
      prevExpenses[t.category] = (prevExpenses[t.category] || 0) + amt;
      totalPrevExpense += amt;
    }
  }

  const insights = [];
  const categoriesToCheck = new Set([
    ...Object.keys(currExpenses),
    ...Object.keys(prevExpenses),
  ]);

  const changes = [];
  categoriesToCheck.forEach((cat) => {
    const curr = currExpenses[cat] || 0;
    const prev = prevExpenses[cat] || 0;

    if (prev > 0 && curr > 0) {
      const diffPct = ((curr - prev) / prev) * 100;
      const absDiff = Math.abs(curr - prev);
      changes.push({ category: cat, curr, prev, diffPct, absDiff });
    }
  });

  changes.sort((a, b) => b.absDiff - a.absDiff);

  for (const change of changes.slice(0, 3)) {
    const roundedPct = Math.abs(Math.round(change.diffPct));
    if (roundedPct >= 5) {
      if (change.diffPct > 0) {
        insights.push({
          id: `more-${change.category}`,
          type: 'warning',
          category: change.category,
          text: `You spent ${roundedPct}% more on ${change.category} than last month.`,
        });
      } else {
        insights.push({
          id: `less-${change.category}`,
          type: 'success',
          category: change.category,
          text: `You spent ${roundedPct}% less on ${change.category} compared to last month. Great job!`,
        });
      }
    }
  }

  if (totalPrevExpense > 0 && totalCurrExpense > 0) {
    const overallDiff = ((totalCurrExpense - totalPrevExpense) / totalPrevExpense) * 100;
    const roundedOverall = Math.abs(Math.round(overallDiff));
    if (roundedOverall >= 3) {
      if (overallDiff > 0) {
        insights.push({
          id: 'overall-more',
          type: 'warning',
          text: `Overall expenses are up ${roundedOverall}% compared to last month.`,
        });
      } else {
        insights.push({
          id: 'overall-less',
          type: 'success',
          text: `Overall expenses decreased by ${roundedOverall}%. You are managing well!`,
        });
      }
    }
  }

  const topCategoryEntry = Object.entries(currExpenses).sort((a, b) => b[1] - a[1])[0];
  if (topCategoryEntry && topCategoryEntry[1] > 0) {
    const pctOfTotal = Math.round((topCategoryEntry[1] / totalCurrExpense) * 100);
    insights.push({
      id: `top-cat-${topCategoryEntry[0]}`,
      type: 'info',
      category: topCategoryEntry[0],
      text: `${topCategoryEntry[0]} is your largest expense this month, taking ${pctOfTotal}% of total spending.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'steady-spending',
      type: 'info',
      text: 'Spending patterns are steady and within your expected limits for this period.',
    });
  }

  return insights;
};

/**
 * Pure function to filter and sort transactions.
 * @param {Array} transactions
 * @param {Object} filters
 * @returns {Array}
 */
export const filterAndSortTransactions = (
  transactions = [],
  {
    search = '',
    category = 'all',
    type = 'all',
    startDate = '',
    endDate = '',
    sortBy = 'date',
    sortOrder = 'desc',
  } = {}
) => {
  if (!Array.isArray(transactions)) return [];

  const searchLower = (search || '').trim().toLowerCase();

  const filtered = transactions.filter((t) => {
    if (type !== 'all' && t.type !== type) {
      return false;
    }

    if (category !== 'all' && t.category !== category) {
      return false;
    }

    if (searchLower) {
      const noteMatch = (t.note || '').toLowerCase().includes(searchLower);
      const catMatch = (t.category || '').toLowerCase().includes(searchLower);
      const modeMatch = (t.paymentMode || '').toLowerCase().includes(searchLower);
      if (!noteMatch && !catMatch && !modeMatch) {
        return false;
      }
    }

    if (startDate) {
      const tDate = parseISO(t.date);
      const sDate = parseISO(startDate);
      if (isValid(tDate) && isValid(sDate) && tDate < startOfMonth(sDate)) {
        if (t.date < startDate) return false;
      }
    }

    if (endDate) {
      const tDate = parseISO(t.date);
      const eDate = parseISO(endDate);
      if (isValid(tDate) && isValid(eDate)) {
        if (t.date.split('T')[0] > endDate.split('T')[0]) return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      comparison = dateA - dateB;
    } else if (sortBy === 'amount') {
      const amtA = Number(a.amount) || 0;
      const amtB = Number(b.amount) || 0;
      comparison = amtA - amtB;
    } else if (sortBy === 'category') {
      comparison = (a.category || '').localeCompare(b.category || '');
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};
