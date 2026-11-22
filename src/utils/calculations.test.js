import { describe, it, expect } from 'vitest';
import {
  calculateTotals,
  calculateSpendingByCategory,
  calculateMonthlyIncomeVsExpense,
  calculateBudgetStatus,
  calculateTopExpenses,
  calculateCategoryInsights,
  filterAndSortTransactions,
} from './calculations';

describe('calculations utility functions', () => {
  const mockTransactions = [
    {
      id: '1',
      type: 'income',
      amount: 3000,
      category: 'Salary',
      date: '2026-11-01T10:00:00.000Z',
      note: 'Main salary',
    },
    {
      id: '2',
      type: 'expense',
      amount: 1000,
      category: 'Housing & Rent',
      date: '2026-11-02T10:00:00.000Z',
      note: 'Rent payment',
    },
    {
      id: '3',
      type: 'expense',
      amount: 200,
      category: 'Food & Dining',
      date: '2026-11-03T10:00:00.000Z',
      note: 'Grocery store haul',
    },
    {
      id: '4',
      type: 'expense',
      amount: 100,
      category: 'Food & Dining',
      date: '2026-10-15T10:00:00.000Z',
      note: 'Prior month food',
    },
  ];

  describe('calculateTotals', () => {
    it('returns zeroes for empty transaction array', () => {
      const totals = calculateTotals([]);
      expect(totals).toEqual({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        savingsRate: 0,
      });
    });

    it('correctly aggregates income, expenses, balance and savings rate', () => {
      const totals = calculateTotals(mockTransactions);
      expect(totals.totalIncome).toBe(3000);
      expect(totals.totalExpenses).toBe(1300);
      expect(totals.totalBalance).toBe(1700);
      // (1700 / 3000) * 100 = 56.6666...%
      expect(totals.savingsRate).toBeCloseTo(56.67, 1);
    });

    it('handles zero income safely without NaN', () => {
      const onlyExpenses = [{ type: 'expense', amount: 50, category: 'Food & Dining', date: '2026-11-01' }];
      const totals = calculateTotals(onlyExpenses);
      expect(totals.totalIncome).toBe(0);
      expect(totals.totalExpenses).toBe(50);
      expect(totals.totalBalance).toBe(-50);
      expect(totals.savingsRate).toBe(0);
    });
  });

  describe('calculateSpendingByCategory', () => {
    it('groups spending by category and computes percentages for target month', () => {
      const novTarget = '2026-11-15T00:00:00.000Z';
      const breakdown = calculateSpendingByCategory(mockTransactions, novTarget);

      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].name).toBe('Housing & Rent');
      expect(breakdown[0].value).toBe(1000);
      // 1000 / 1200 = ~83.33%
      expect(breakdown[0].percentage).toBeCloseTo(83.33, 1);

      expect(breakdown[1].name).toBe('Food & Dining');
      expect(breakdown[1].value).toBe(200);
      expect(breakdown[1].percentage).toBeCloseTo(16.67, 1);
    });
  });

  describe('calculateBudgetStatus', () => {
    it('correctly reports budget spent, limits, and exceeded flags', () => {
      const budgets = [
        { category: 'Food & Dining', monthlyLimit: 250 },
        { category: 'Housing & Rent', monthlyLimit: 900 }, // spent 1000 => exceeded
      ];
      const targetMonth = '2026-11-10';
      const status = calculateBudgetStatus(mockTransactions, budgets, targetMonth);

      const food = status.find((s) => s.category === 'Food & Dining');
      expect(food.spent).toBe(200);
      expect(food.limit).toBe(250);
      expect(food.remaining).toBe(50);
      expect(food.isExceeded).toBe(false);

      const rent = status.find((s) => s.category === 'Housing & Rent');
      expect(rent.spent).toBe(1000);
      expect(rent.limit).toBe(900);
      expect(rent.remaining).toBe(-100);
      expect(rent.isExceeded).toBe(true);
    });
  });

  describe('calculateTopExpenses', () => {
    it('returns top expenses sorted descending by amount', () => {
      const targetMonth = '2026-11-10';
      const top = calculateTopExpenses(mockTransactions, targetMonth, 5);
      expect(top).toHaveLength(2);
      expect(top[0].amount).toBe(1000);
      expect(top[1].amount).toBe(200);
    });
  });

  describe('calculateMonthlyIncomeVsExpense', () => {
    it('returns requested number of months with accurate aggregates', () => {
      const refDate = new Date('2026-11-15T00:00:00.000Z');
      const monthlyData = calculateMonthlyIncomeVsExpense(mockTransactions, 6, refDate);

      expect(monthlyData).toHaveLength(6);
      const novMonth = monthlyData[monthlyData.length - 1];
      expect(novMonth.income).toBe(3000);
      expect(novMonth.expenses).toBe(1200);
      expect(novMonth.netSavings).toBe(1800);
    });
  });

  describe('calculateCategoryInsights', () => {
    it('identifies category spending increases from prior month', () => {
      const refDate = new Date('2026-11-15T00:00:00.000Z');
      const insights = calculateCategoryInsights(mockTransactions, refDate);

      expect(insights.length).toBeGreaterThan(0);
      // Food went from 100 in Oct to 200 in Nov (+100%)
      const foodInsight = insights.find((i) => i.category === 'Food & Dining');
      expect(foodInsight).toBeDefined();
      expect(foodInsight.text).toContain('Food & Dining');
    });
  });

  describe('filterAndSortTransactions', () => {
    it('filters by search keyword', () => {
      const filtered = filterAndSortTransactions(mockTransactions, { search: 'rent' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('filters by transaction type', () => {
      const filtered = filterAndSortTransactions(mockTransactions, { type: 'expense' });
      expect(filtered).toHaveLength(3);
    });

    it('sorts by amount descending', () => {
      const sorted = filterAndSortTransactions(mockTransactions, {
        sortBy: 'amount',
        sortOrder: 'desc',
      });
      expect(sorted[0].amount).toBe(3000);
      expect(sorted[sorted.length - 1].amount).toBe(100);
    });
  });
});
