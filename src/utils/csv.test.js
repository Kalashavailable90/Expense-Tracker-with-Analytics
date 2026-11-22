import { describe, it, expect } from 'vitest';
import { exportTransactionsToCSV, parseTransactionsCSV } from './csv';

describe('CSV utility functions', () => {
  const sampleTransactions = [
    {
      id: 'tx-1',
      type: 'expense',
      amount: 45.5,
      category: 'Food & Dining',
      date: '2026-11-20T10:00:00.000Z',
      note: 'Dinner, wine & dessert',
    },
    {
      id: 'tx-2',
      type: 'income',
      amount: 2500,
      category: 'Salary',
      date: '2026-11-01T08:00:00.000Z',
      note: 'November salary',
    },
  ];

  it('exports transactions to valid CSV format with header', () => {
    const csv = exportTransactionsToCSV(sampleTransactions);
    expect(csv).toContain('id,type,amount,category,date,note');
    expect(csv).toContain('"Dinner, wine & dessert"');
    expect(csv).toContain('45.50');
  });

  it('parses valid CSV string and ignores headers correctly', () => {
    const csv = `type,amount,category,date,note\nexpense,80.00,Utilities,2026-11-15T12:00:00.000Z,Water and electric\nincome,150.00,Freelance,2026-11-16T12:00:00.000Z,Icon set design`;
    const result = parseTransactionsCSV(csv, []);

    expect(result.errors).toHaveLength(0);
    expect(result.validTransactions).toHaveLength(2);
    expect(result.validTransactions[0].amount).toBe(80);
    expect(result.validTransactions[0].category).toBe('Utilities');
    expect(result.validTransactions[1].type).toBe('income');
  });

  it('catches invalid rows and reports line errors', () => {
    const badCsv = `type,amount,category,date,note\nunknown,-20,Food,invalid-date,test note`;
    const result = parseTransactionsCSV(badCsv, []);

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.validTransactions).toHaveLength(0);
  });

  it('detects duplicates when duplicate exists in existing transactions', () => {
    const existing = [
      {
        id: 'tx-1',
        type: 'expense',
        amount: 50,
        category: 'Shopping',
        date: '2026-11-10T00:00:00.000Z',
        note: 'Shoes',
      },
    ];
    const csv = `type,amount,category,date,note\nexpense,50,Shopping,2026-11-10T00:00:00.000Z,Shoes`;
    const result = parseTransactionsCSV(csv, existing);

    expect(result.validTransactions).toHaveLength(0);
    expect(result.duplicatesCount).toBe(1);
  });
});
