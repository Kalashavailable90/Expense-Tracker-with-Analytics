/**
 * Default categories tailored for Indian citizens, households, and professionals.
 * Colors and identifiers mapped for clean visualization.
 */

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const EXPENSE_CATEGORIES = [
  { id: 'Kirana & Groceries', name: 'Kirana & Groceries', color: '#16a34a', icon: 'shopping-bag' },
  { id: 'House Rent & Society', name: 'House Rent & Society', color: '#6366f1', icon: 'home' },
  { id: 'Food & Dining (Swiggy/Zomato)', name: 'Food & Dining (Swiggy/Zomato)', color: '#ea580c', icon: 'utensils' },
  { id: 'Fuel, Metro & Auto', name: 'Fuel, Metro & Auto', color: '#0284c7', icon: 'car' },
  { id: 'Electricity, Gas & Water', name: 'Electricity, Gas & Water', color: '#eab308', icon: 'zap' },
  { id: 'Mobile, Wi-Fi & DTH', name: 'Mobile, Wi-Fi & DTH', color: '#8b5cf6', icon: 'smartphone' },
  { id: 'EMI, Loans & Cards', name: 'EMI, Loans & Cards', color: '#ef4444', icon: 'activity' },
  { id: 'Shopping & Festivals', name: 'Shopping & Festivals', color: '#ec4899', icon: 'gift' },
  { id: 'Health & Medicines', name: 'Health & Medicines', color: '#f43f5e', icon: 'heart' },
  { id: 'Education & Tuition', name: 'Education & Tuition', color: '#2563eb', icon: 'book-open' },
  { id: 'Entertainment & OTT', name: 'Entertainment & OTT', color: '#06b6d4', icon: 'film' },
  { id: 'Maid & Household Help', name: 'Maid & Household Help', color: '#0d9488', icon: 'briefcase' },
  { id: 'Other Expenses', name: 'Other Expenses', color: '#64748b', icon: 'more-horizontal' },
];

export const INCOME_CATEGORIES = [
  { id: 'Monthly Salary', name: 'Monthly Salary', color: '#10b981', icon: 'briefcase' },
  { id: 'Business & Shop Profit', name: 'Business & Shop Profit', color: '#059669', icon: 'dollar-sign' },
  { id: 'Freelance & Projects', name: 'Freelance & Projects', color: '#14b8a6', icon: 'laptop' },
  { id: 'Mutual Funds & Stocks', name: 'Mutual Funds & Stocks', color: '#0284c7', icon: 'trending-up' },
  { id: 'Rental Income', name: 'Rental Income', color: '#84cc16', icon: 'home' },
  { id: 'Bonus & Festival Cash', name: 'Bonus & Festival Cash', color: '#eab308', icon: 'gift' },
  { id: 'Other Income', name: 'Other Income', color: '#10b981', icon: 'inr' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryColor = (categoryName) => {
  const found = ALL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === (categoryName || '').toLowerCase()
  );
  return found ? found.color : '#94a3b8';
};
