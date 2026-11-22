import { useState, useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { SummaryCards } from './SummaryCards';
import { QuickAddBar } from './QuickAddBar';
import { CategoryDonutChart } from '../Analytics/CategoryDonutChart';
import { MonthlyComparisonChart } from '../Analytics/MonthlyComparisonChart';
import { SpendingInsights } from '../Analytics/SpendingInsights';
import { TopExpenses } from '../Analytics/TopExpenses';
import { CSVManager } from '../Analytics/CSVManager';
import { MonthlyStatementModal } from '../Analytics/MonthlyStatementModal';
import { calculateTotals, filterByTimeframe } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryColor } from '../../data/categories';
import { Icon } from '../common/Icons';

export const Dashboard = () => {
  const { transactions, setActiveTab, openForm, seedData } = useExpense();

  const [timeframe, setTimeframe] = useState('this-month');
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  // Totals for the active timeframe
  const timeframeTotals = useMemo(() => {
    return calculateTotals(transactions, timeframe);
  }, [transactions, timeframe]);

  const recentTransactions = transactions.slice(0, 6);

  const spentPercentage =
    timeframeTotals.totalIncome > 0
      ? Math.min(100, (timeframeTotals.totalExpenses / timeframeTotals.totalIncome) * 100)
      : 0;

  const savedPercentage = Math.max(0, 100 - spentPercentage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner: Welcome + Timeframe Selector + Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🇮🇳</span>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Financial Dashboard
            </h1>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
            }}
          >
            Track daily income, expenses, and monthly savings in Indian Rupees (₹ INR)
          </p>
        </div>

        {/* Action Buttons: Statement & Add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsStatementOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Icon name="list" size={15} color="var(--primary)" />
            <span>View Statement / Print</span>
          </button>

          <button
            onClick={() => openForm()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--income)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Icon name="plus" size={15} color="#fff" />
            <span>+ Add Transaction (N)</span>
          </button>
        </div>
      </div>

      {/* 1-Click Timeframe Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Icon name="target" size={15} color="var(--primary)" />
          <span style={{ fontWeight: 600 }}>Viewing Horizon:</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'this-month', label: 'This Month' },
            { id: 'last-month', label: 'Last Month' },
            { id: 'last-3-months', label: 'Last 3 Months' },
            { id: 'all-time', label: 'All Time' },
          ].map((tab) => {
            const isSelected = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* At-a-Glance Money Flow Barometer */}
      {timeframeTotals.totalIncome > 0 && (
        <div
          className="pro-card"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Cash Flow Barometer ({timeframe.replace('-', ' ').toUpperCase()})
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Total Income: <strong style={{ color: 'var(--income)' }}>{formatCurrency(timeframeTotals.totalIncome)}</strong>
            </span>
          </div>

          {/* Visual Percentage Bar */}
          <div
            style={{
              height: '14px',
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <div
              title={`Spent: ${spentPercentage.toFixed(1)}%`}
              style={{
                height: '100%',
                width: `${spentPercentage}%`,
                backgroundColor: 'var(--expense)',
                transition: 'width 400ms ease',
              }}
            />
            <div
              title={`Saved: ${savedPercentage.toFixed(1)}%`}
              style={{
                height: '100%',
                width: `${savedPercentage}%`,
                backgroundColor: 'var(--income)',
                transition: 'width 400ms ease',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.75rem',
              fontSize: '0.8125rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--expense)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Spent:</span>
              <strong style={{ color: 'var(--expense)', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(timeframeTotals.totalExpenses)} ({spentPercentage.toFixed(0)}%)
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--income)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Saved:</span>
              <strong style={{ color: 'var(--income)', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(timeframeTotals.totalBalance)} ({savedPercentage.toFixed(0)}%)
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Bar: 1-Click Entry Directly on Dashboard */}
      <QuickAddBar />

      {/* Summary Stat Cards (Driven by Timeframe) */}
      <SummaryCards timeframe={timeframe} />

      {/* Row 1: Charts (Donut + Monthly Income vs Expense) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <CategoryDonutChart transactions={transactions} timeframe={timeframe} />
        <MonthlyComparisonChart transactions={transactions} />
      </div>

      {/* Row 2: AI Insights & Top 5 Monthly Expenses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <SpendingInsights transactions={transactions} />
        <TopExpenses transactions={transactions} timeframe={timeframe} />
      </div>

      {/* Row 3: Recent Activity Stream */}
      <div className="pro-card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recent Transactions
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your latest incomes and outlays across all categories
            </p>
          </div>

          <button
            onClick={() => setActiveTab('transactions')}
            aria-label="View all transactions in history tab"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--income)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All</span>
            <Icon name="arrow-up" size={13} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)',
            }}
          >
            <Icon name="inr" size={32} color="var(--text-muted)" />
            <p style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              No transactions recorded yet
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Click "+ Add Transaction" or load sample demo data to see charts and insights.
            </p>
            <button
              onClick={seedData}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--income)',
                color: '#fff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Load Sample Demo Data
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentTransactions.map((tx, idx) => {
              const isExpense = tx.type === 'expense';
              const catColor = getCategoryColor(tx.category);

              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom:
                      idx < recentTransactions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${catColor}18`,
                        color: catColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        name={isExpense ? 'arrow-up' : 'arrow-down'}
                        size={17}
                        color="currentColor"
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {tx.category}
                        </span>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: isExpense ? 'var(--expense-light)' : 'var(--income-light)',
                            color: isExpense ? 'var(--expense)' : 'var(--income)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isExpense ? 'Expense' : 'Income'}
                        </span>
                        {tx.paymentMode && (
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--bg-input)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {tx.paymentMode}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {formatDate(tx.date)} {tx.note ? `• ${tx.note}` : ''}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      fontFamily: 'var(--font-mono)',
                      color: isExpense ? 'var(--expense)' : 'var(--income)',
                    }}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CSV Manager */}
      <CSVManager />

      {/* Printable Monthly Statement Modal */}
      <MonthlyStatementModal
        isOpen={isStatementOpen}
        onClose={() => setIsStatementOpen(false)}
        timeframe={timeframe}
      />
    </div>
  );
};
