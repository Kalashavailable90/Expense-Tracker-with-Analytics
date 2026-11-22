import { createContext, useContext, useReducer, useEffect } from 'react';
import { expenseReducer, ACTION_TYPES, initialReducerState } from './expenseReducer';
import { generateSampleTransactions, INITIAL_BUDGETS } from '../data/sampleData';

const ExpenseContext = createContext(null);

const STORAGE_KEYS = {
  TRANSACTIONS: 'et_transactions_v1',
  BUDGETS: 'et_budgets_v1',
  THEME: 'et_theme_v1',
};

const getInitialState = () => {
  let storedTransactions = null;
  let storedBudgets = null;
  let storedTheme = 'dark';

  try {
    if (typeof window !== 'undefined') {
      const tx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const bg = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      const th = localStorage.getItem(STORAGE_KEYS.THEME);

      if (tx) storedTransactions = JSON.parse(tx);
      if (bg) storedBudgets = JSON.parse(bg);
      if (th) storedTheme = JSON.parse(th);
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using defaults', err);
  }

  return {
    ...initialReducerState,
    transactions: storedTransactions !== null ? storedTransactions : generateSampleTransactions(),
    budgets: storedBudgets !== null ? storedBudgets : INITIAL_BUDGETS,
    theme: storedTheme || 'dark',
  };
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, null, getInitialState);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
    } catch (err) {
      console.warn('Failed to save transactions to localStorage', err);
    }
  }, [state.transactions]);

  // Sync budgets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
    } catch (err) {
      console.warn('Failed to save budgets to localStorage', err);
    }
  }, [state.budgets]);

  // Sync theme to localStorage and DOM data attribute
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state.theme));
      document.documentElement.setAttribute('data-theme', state.theme);
    } catch (err) {
      console.warn('Failed to save theme to localStorage', err);
    }
  }, [state.theme]);

  // Auto-dismiss toast timer
  useEffect(() => {
    if (!state.toast) return;

    const timer = setTimeout(() => {
      dispatch({ type: ACTION_TYPES.DISMISS_TOAST });
    }, 5500);

    return () => clearTimeout(timer);
  }, [state.toast?.id]);

  // Convenience helper functions
  const addTransaction = (transaction) => {
    dispatch({ type: ACTION_TYPES.ADD_TRANSACTION, payload: transaction });
  };

  const editTransaction = (transaction) => {
    dispatch({ type: ACTION_TYPES.EDIT_TRANSACTION, payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: ACTION_TYPES.DELETE_TRANSACTION, payload: id });
  };

  const undoDelete = () => {
    dispatch({ type: ACTION_TYPES.UNDO_DELETE });
  };

  const setBudget = (category, monthlyLimit) => {
    dispatch({
      type: ACTION_TYPES.SET_BUDGET,
      payload: { category, monthlyLimit },
    });
  };

  const seedData = () => {
    dispatch({
      type: ACTION_TYPES.SEED_DATA,
      payload: {
        transactions: generateSampleTransactions(),
        budgets: INITIAL_BUDGETS,
      },
    });
  };

  const clearAllData = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ALL });
  };

  const importTransactions = (transactions) => {
    dispatch({ type: ACTION_TYPES.IMPORT_TRANSACTIONS, payload: transactions });
  };

  const toggleTheme = () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    dispatch({ type: ACTION_TYPES.SET_THEME, payload: nextTheme });
  };

  const openForm = (transactionToEdit = null) => {
    dispatch({ type: ACTION_TYPES.OPEN_FORM, payload: transactionToEdit });
  };

  const closeForm = () => {
    dispatch({ type: ACTION_TYPES.CLOSE_FORM });
  };

  const dismissToast = () => {
    dispatch({ type: ACTION_TYPES.DISMISS_TOAST });
  };

  const setActiveTab = (tab) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_TAB, payload: tab });
  };

  const value = {
    ...state,
    addTransaction,
    editTransaction,
    deleteTransaction,
    undoDelete,
    setBudget,
    seedData,
    clearAllData,
    importTransactions,
    toggleTheme,
    openForm,
    closeForm,
    dismissToast,
    setActiveTab,
    dispatch,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
