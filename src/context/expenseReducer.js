export const ACTION_TYPES = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  EDIT_TRANSACTION: 'EDIT_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  UNDO_DELETE: 'UNDO_DELETE',
  SET_BUDGET: 'SET_BUDGET',
  SEED_DATA: 'SEED_DATA',
  CLEAR_ALL: 'CLEAR_ALL',
  IMPORT_TRANSACTIONS: 'IMPORT_TRANSACTIONS',
  SET_THEME: 'SET_THEME',
  OPEN_FORM: 'OPEN_FORM',
  CLOSE_FORM: 'CLOSE_FORM',
  SHOW_TOAST: 'SHOW_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
};

export const initialReducerState = {
  transactions: [],
  budgets: [],
  theme: 'dark',
  lastDeletedTransaction: null,
  isFormOpen: false,
  editingTransaction: null,
  activeTab: 'dashboard',
  toast: null,
};

/**
 * Pure reducer function for all expense tracker state mutations.
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const expenseReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TRANSACTION: {
      const newTransaction = {
        ...action.payload,
        id: action.payload.id || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        amount: Number(action.payload.amount) || 0,
      };
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
        isFormOpen: false,
        editingTransaction: null,
        toast: {
          id: `toast-${Date.now()}`,
          message: 'Transaction added successfully',
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.EDIT_TRANSACTION: {
      const updated = {
        ...action.payload,
        amount: Number(action.payload.amount) || 0,
      };
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === updated.id ? updated : t)),
        isFormOpen: false,
        editingTransaction: null,
        toast: {
          id: `toast-${Date.now()}`,
          message: 'Transaction updated successfully',
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.DELETE_TRANSACTION: {
      const idToDelete = action.payload;
      const targetTransaction = state.transactions.find((t) => t.id === idToDelete);

      if (!targetTransaction) return state;

      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== idToDelete),
        lastDeletedTransaction: targetTransaction,
        toast: {
          id: `toast-${Date.now()}`,
          message: `Deleted "${targetTransaction.category}" (₹${targetTransaction.amount})`,
          type: 'info',
          canUndo: true,
        },
      };
    }

    case ACTION_TYPES.UNDO_DELETE: {
      if (!state.lastDeletedTransaction) return state;
      return {
        ...state,
        transactions: [state.lastDeletedTransaction, ...state.transactions],
        lastDeletedTransaction: null,
        toast: {
          id: `toast-${Date.now()}`,
          message: 'Transaction restored',
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.SET_BUDGET: {
      const { category, monthlyLimit } = action.payload;
      const numericLimit = Math.max(0, Number(monthlyLimit) || 0);

      const existingIndex = state.budgets.findIndex(
        (b) => b.category.toLowerCase() === category.toLowerCase()
      );

      let newBudgets;
      if (existingIndex >= 0) {
        newBudgets = state.budgets.map((b, idx) =>
          idx === existingIndex ? { ...b, monthlyLimit: numericLimit } : b
        );
      } else {
        newBudgets = [...state.budgets, { category, monthlyLimit: numericLimit }];
      }

      return {
        ...state,
        budgets: newBudgets,
        toast: {
          id: `toast-${Date.now()}`,
          message: `Monthly budget for ${category} set to ₹${numericLimit}`,
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.IMPORT_TRANSACTIONS: {
      const newTransactions = action.payload;
      if (!Array.isArray(newTransactions) || newTransactions.length === 0) {
        return state;
      }
      return {
        ...state,
        transactions: [...newTransactions, ...state.transactions],
        toast: {
          id: `toast-${Date.now()}`,
          message: `Successfully imported ${newTransactions.length} transactions`,
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.SEED_DATA: {
      const { transactions, budgets } = action.payload;
      return {
        ...state,
        transactions: [...transactions],
        budgets: [...budgets],
        toast: {
          id: `toast-${Date.now()}`,
          message: 'Sample demo data loaded in Indian Rupees (₹)',
          type: 'success',
        },
      };
    }

    case ACTION_TYPES.CLEAR_ALL: {
      return {
        ...state,
        transactions: [],
        budgets: [],
        lastDeletedTransaction: null,
        toast: {
          id: `toast-${Date.now()}`,
          message: 'All transactions and budgets cleared',
          type: 'warning',
        },
      };
    }

    case ACTION_TYPES.SET_THEME: {
      return {
        ...state,
        theme: action.payload,
      };
    }

    case ACTION_TYPES.OPEN_FORM: {
      return {
        ...state,
        isFormOpen: true,
        editingTransaction: action.payload || null,
      };
    }

    case ACTION_TYPES.CLOSE_FORM: {
      return {
        ...state,
        isFormOpen: false,
        editingTransaction: null,
      };
    }

    case ACTION_TYPES.SHOW_TOAST: {
      return {
        ...state,
        toast: {
          id: `toast-${Date.now()}`,
          ...action.payload,
        },
      };
    }

    case ACTION_TYPES.DISMISS_TOAST: {
      return {
        ...state,
        toast: null,
      };
    }

    case ACTION_TYPES.SET_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.payload,
      };
    }

    default:
      return state;
  }
};
