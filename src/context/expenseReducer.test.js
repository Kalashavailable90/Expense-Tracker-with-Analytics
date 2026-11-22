import { describe, it, expect } from 'vitest';
import { expenseReducer, ACTION_TYPES, initialReducerState } from './expenseReducer';

describe('expenseReducer', () => {
  const sampleTx = {
    id: 'tx-1',
    type: 'expense',
    amount: 1500,
    category: 'Kirana & Groceries',
    date: '2026-11-20T10:00:00.000Z',
    note: 'DMart monthly ration',
  };

  it('handles ADD_TRANSACTION correctly', () => {
    const state = { ...initialReducerState, transactions: [] };
    const action = { type: ACTION_TYPES.ADD_TRANSACTION, payload: sampleTx };
    const nextState = expenseReducer(state, action);

    expect(nextState.transactions).toHaveLength(1);
    expect(nextState.transactions[0].id).toBe('tx-1');
    expect(nextState.transactions[0].amount).toBe(1500);
    expect(nextState.isFormOpen).toBe(false);
    expect(nextState.toast).toBeDefined();
    expect(nextState.toast.type).toBe('success');
  });

  it('handles EDIT_TRANSACTION correctly', () => {
    const state = {
      ...initialReducerState,
      transactions: [sampleTx],
    };
    const action = {
      type: ACTION_TYPES.EDIT_TRANSACTION,
      payload: { ...sampleTx, amount: 2000, note: 'Updated ration amount' },
    };
    const nextState = expenseReducer(state, action);

    expect(nextState.transactions[0].amount).toBe(2000);
    expect(nextState.transactions[0].note).toBe('Updated ration amount');
    expect(nextState.editingTransaction).toBeNull();
  });

  it('handles DELETE_TRANSACTION and allows UNDO_DELETE', () => {
    const state = {
      ...initialReducerState,
      transactions: [sampleTx],
      lastDeletedTransaction: null,
    };

    // 1. Delete
    const deleteAction = { type: ACTION_TYPES.DELETE_TRANSACTION, payload: 'tx-1' };
    const deletedState = expenseReducer(state, deleteAction);

    expect(deletedState.transactions).toHaveLength(0);
    expect(deletedState.lastDeletedTransaction).toEqual(sampleTx);
    expect(deletedState.toast?.canUndo).toBe(true);

    // 2. Undo
    const undoAction = { type: ACTION_TYPES.UNDO_DELETE };
    const restoredState = expenseReducer(deletedState, undoAction);

    expect(restoredState.transactions).toHaveLength(1);
    expect(restoredState.transactions[0].id).toBe('tx-1');
    expect(restoredState.lastDeletedTransaction).toBeNull();
  });

  it('handles SET_BUDGET updating existing and adding new', () => {
    const state = {
      ...initialReducerState,
      budgets: [{ category: 'Kirana & Groceries', monthlyLimit: 8000 }],
    };

    // Update existing
    const updateAction = {
      type: ACTION_TYPES.SET_BUDGET,
      payload: { category: 'Kirana & Groceries', monthlyLimit: 12000 },
    };
    const updatedState = expenseReducer(state, updateAction);
    expect(updatedState.budgets).toHaveLength(1);
    expect(updatedState.budgets[0].monthlyLimit).toBe(12000);

    // Add new
    const addAction = {
      type: ACTION_TYPES.SET_BUDGET,
      payload: { category: 'Fuel, Metro & Auto', monthlyLimit: 4000 },
    };
    const addedState = expenseReducer(updatedState, addAction);
    expect(addedState.budgets).toHaveLength(2);
    expect(addedState.budgets[1].category).toBe('Fuel, Metro & Auto');
    expect(addedState.budgets[1].monthlyLimit).toBe(4000);
  });

  it('handles IMPORT_TRANSACTIONS', () => {
    const state = { ...initialReducerState, transactions: [sampleTx] };
    const newItems = [
      { id: 'tx-2', type: 'income', amount: 75000, category: 'Monthly Salary', date: '2026-11-01', note: 'Salary' },
    ];
    const action = { type: ACTION_TYPES.IMPORT_TRANSACTIONS, payload: newItems };
    const nextState = expenseReducer(state, action);

    expect(nextState.transactions).toHaveLength(2);
  });

  it('handles CLEAR_ALL', () => {
    const state = {
      ...initialReducerState,
      transactions: [sampleTx],
      budgets: [{ category: 'Kirana & Groceries', monthlyLimit: 8000 }],
    };
    const nextState = expenseReducer(state, { type: ACTION_TYPES.CLEAR_ALL });

    expect(nextState.transactions).toHaveLength(0);
    expect(nextState.budgets).toHaveLength(0);
  });

  it('handles SET_THEME', () => {
    const state = { ...initialReducerState, theme: 'dark' };
    const nextState = expenseReducer(state, { type: ACTION_TYPES.SET_THEME, payload: 'light' });
    expect(nextState.theme).toBe('light');
  });
});
