/**
 * Sample transaction and budget seed data in Indian Rupees (₹ INR).
 * Dynamic dates calculated relative to current date for realistic charts and monthly comparisons.
 */

const getRelativeDate = (daysAgo, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
};

export const INITIAL_BUDGETS = [
  { category: 'Kirana & Groceries', monthlyLimit: 12000 },
  { category: 'House Rent & Society', monthlyLimit: 22000 },
  { category: 'Food & Dining (Swiggy/Zomato)', monthlyLimit: 4500 },
  { category: 'Fuel, Metro & Auto', monthlyLimit: 5000 },
  { category: 'Electricity, Gas & Water', monthlyLimit: 3500 },
  { category: 'Mobile, Wi-Fi & DTH', monthlyLimit: 1800 },
  { category: 'Shopping & Festivals', monthlyLimit: 8000 },
  { category: 'Health & Medicines', monthlyLimit: 3000 },
];

export const generateSampleTransactions = () => [
  // Current Month - Incomes
  {
    id: 'tx-seed-in-01',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(2, 9),
    note: 'Monthly salary credited via NEFT',
  },
  {
    id: 'tx-seed-in-02',
    type: 'income',
    amount: 14500,
    category: 'Freelance & Projects',
    date: getRelativeDate(7, 14),
    note: 'Website UI redesign payment via UPI (GPay)',
  },
  {
    id: 'tx-seed-in-03',
    type: 'income',
    amount: 3200,
    category: 'Mutual Funds & Stocks',
    date: getRelativeDate(12, 11),
    note: 'TCS dividend credited to bank',
  },

  // Current Month - Expenses
  {
    id: 'tx-seed-ex-01',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(3, 10),
    note: '2BHK Apartment rent paid via NetBanking',
  },
  {
    id: 'tx-seed-ex-02',
    type: 'expense',
    amount: 4850,
    category: 'Kirana & Groceries',
    date: getRelativeDate(1, 19),
    note: 'Monthly ration, atta, oil & spices from DMart',
  },
  {
    id: 'tx-seed-ex-03',
    type: 'expense',
    amount: 980,
    category: 'Kirana & Groceries',
    date: getRelativeDate(4, 18),
    note: 'Fresh milk, paneer & vegetables from local sabzi mandi',
  },
  {
    id: 'tx-seed-ex-04',
    type: 'expense',
    amount: 840,
    category: 'Food & Dining (Swiggy/Zomato)',
    date: getRelativeDate(2, 20),
    note: 'Biryani dinner order on Swiggy',
  },
  {
    id: 'tx-seed-ex-05',
    type: 'expense',
    amount: 2400,
    category: 'Fuel, Metro & Auto',
    date: getRelativeDate(5, 8),
    note: 'Petrol tank full at Indian Oil bunk',
  },
  {
    id: 'tx-seed-ex-06',
    type: 'expense',
    amount: 800,
    category: 'Fuel, Metro & Auto',
    date: getRelativeDate(6, 9),
    note: 'Metro smart card monthly recharge via Paytm',
  },
  {
    id: 'tx-seed-ex-07',
    type: 'expense',
    amount: 2150,
    category: 'Electricity, Gas & Water',
    date: getRelativeDate(8, 16),
    note: 'State electricity board (Bijli) online bill',
  },
  {
    id: 'tx-seed-ex-08',
    type: 'expense',
    amount: 999,
    category: 'Mobile, Wi-Fi & DTH',
    date: getRelativeDate(9, 11),
    note: 'Airtel Xstream Fiber broadband monthly bill',
  },
  {
    id: 'tx-seed-ex-09',
    type: 'expense',
    amount: 666,
    category: 'Mobile, Wi-Fi & DTH',
    date: getRelativeDate(11, 15),
    note: 'Jio 3-month mobile recharge pack',
  },
  {
    id: 'tx-seed-ex-10',
    type: 'expense',
    amount: 4200,
    category: 'Maid & Household Help',
    date: getRelativeDate(5, 10),
    note: 'Monthly cook and house cleaning staff salary',
  },
  {
    id: 'tx-seed-ex-11',
    type: 'expense',
    amount: 3499,
    category: 'Shopping & Festivals',
    date: getRelativeDate(10, 17),
    note: 'Kurtas and shoes ordered on Myntra',
  },
  {
    id: 'tx-seed-ex-12',
    type: 'expense',
    amount: 780,
    category: 'Health & Medicines',
    date: getRelativeDate(13, 19),
    note: 'Apollo Pharmacy monthly vitamins & BP medicine',
  },

  // Last Month (approx 30-45 days ago)
  {
    id: 'tx-seed-in-04',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(32, 9),
    note: 'Last month salary deposit',
  },
  {
    id: 'tx-seed-in-05',
    type: 'income',
    amount: 10000,
    category: 'Bonus & Festival Cash',
    date: getRelativeDate(35, 12),
    note: 'Diwali performance bonus credited',
  },
  {
    id: 'tx-seed-ex-13',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(33, 10),
    note: 'Apartment rent',
  },
  {
    id: 'tx-seed-ex-14',
    type: 'expense',
    amount: 6200,
    category: 'Kirana & Groceries',
    date: getRelativeDate(36, 17),
    note: 'Monthly groceries and festival sweets',
  },
  {
    id: 'tx-seed-ex-15',
    type: 'expense',
    amount: 2800,
    category: 'Fuel, Metro & Auto',
    date: getRelativeDate(38, 9),
    note: 'Petrol and highway toll plaza charges',
  },
  {
    id: 'tx-seed-ex-16',
    type: 'expense',
    amount: 2400,
    category: 'Electricity, Gas & Water',
    date: getRelativeDate(37, 14),
    note: 'Electricity bill and Bharat Gas cylinder refill',
  },
  {
    id: 'tx-seed-ex-17',
    type: 'expense',
    amount: 5500,
    category: 'Shopping & Festivals',
    date: getRelativeDate(41, 15),
    note: 'Diwali gifts, home lights & diyas',
  },

  // 2 Months ago
  {
    id: 'tx-seed-in-06',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(62, 9),
    note: 'Salary direct deposit',
  },
  {
    id: 'tx-seed-ex-18',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(63, 10),
    note: 'Apartment rent',
  },
  {
    id: 'tx-seed-ex-19',
    type: 'expense',
    amount: 5100,
    category: 'Kirana & Groceries',
    date: getRelativeDate(66, 16),
    note: 'DMart supermarket restock',
  },
  {
    id: 'tx-seed-ex-20',
    type: 'expense',
    amount: 2100,
    category: 'Fuel, Metro & Auto',
    date: getRelativeDate(68, 8),
    note: 'Petrol and Auto rickshaw rides',
  },

  // 3 Months ago
  {
    id: 'tx-seed-in-07',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(92, 9),
    note: 'Salary direct deposit',
  },
  {
    id: 'tx-seed-ex-21',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(93, 10),
    note: 'Apartment rent',
  },
  {
    id: 'tx-seed-ex-22',
    type: 'expense',
    amount: 5600,
    category: 'Kirana & Groceries',
    date: getRelativeDate(96, 15),
    note: 'Household rations & fruits',
  },

  // 4 Months ago
  {
    id: 'tx-seed-in-08',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(122, 9),
    note: 'Salary direct deposit',
  },
  {
    id: 'tx-seed-ex-23',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(123, 10),
    note: 'Apartment rent',
  },
  {
    id: 'tx-seed-ex-24',
    type: 'expense',
    amount: 4900,
    category: 'Kirana & Groceries',
    date: getRelativeDate(126, 18),
    note: 'Grocery supplies',
  },

  // 5 Months ago
  {
    id: 'tx-seed-in-09',
    type: 'income',
    amount: 82000,
    category: 'Monthly Salary',
    date: getRelativeDate(152, 9),
    note: 'Salary direct deposit',
  },
  {
    id: 'tx-seed-ex-25',
    type: 'expense',
    amount: 19500,
    category: 'House Rent & Society',
    date: getRelativeDate(153, 10),
    note: 'Apartment rent',
  },
  {
    id: 'tx-seed-ex-26',
    type: 'expense',
    amount: 5300,
    category: 'Kirana & Groceries',
    date: getRelativeDate(156, 11),
    note: 'Ration & dairy',
  },
];
