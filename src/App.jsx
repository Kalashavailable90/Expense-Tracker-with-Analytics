import { useExpense } from './context/ExpenseContext';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionList } from './components/TransactionList/TransactionList';
import { BudgetTracker } from './components/BudgetTracker/BudgetTracker';
import { CategoryDonutChart } from './components/Analytics/CategoryDonutChart';
import { MonthlyComparisonChart } from './components/Analytics/MonthlyComparisonChart';
import { SpendingInsights } from './components/Analytics/SpendingInsights';
import { TopExpenses } from './components/Analytics/TopExpenses';
import { CSVManager } from './components/Analytics/CSVManager';
import { TransactionForm } from './components/TransactionForm/TransactionForm';
import { Toast } from './components/common/Toast';

export const App = () => {
  const { activeTab, openForm, transactions } = useExpense();

  // Press 'N' anywhere to open new transaction modal
  useKeyboardShortcut('n', () => {
    openForm();
  });

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'transactions' && <TransactionList />}

        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <CategoryDonutChart transactions={transactions} />
              <MonthlyComparisonChart transactions={transactions} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <SpendingInsights transactions={transactions} />
              <TopExpenses transactions={transactions} />
            </div>

            <CSVManager />
          </div>
        )}

        {activeTab === 'budgets' && <BudgetTracker />}
      </main>

      {/* Modal & Toast Overlays */}
      <TransactionForm />
      <Toast />
    </div>
  );
};
export default App;
