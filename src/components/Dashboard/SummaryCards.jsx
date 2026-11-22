import { useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { calculateTotals, filterByTimeframe } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Icon } from '../common/Icons';

export const SummaryCards = ({ timeframe = 'this-month' }) => {
  const { transactions } = useExpense();

  const filteredTransactions = useMemo(() => {
    return filterByTimeframe(transactions, timeframe);
  }, [transactions, timeframe]);

  const totals = useMemo(() => {
    return calculateTotals(transactions, timeframe);
  }, [transactions, timeframe]);

  const cards = [
    {
      id: 'balance',
      title: 'Net Balance',
      amount: totals.totalBalance,
      isPositive: totals.totalBalance >= 0,
      icon: 'inr',
      badge: totals.totalBalance >= 0 ? 'Surplus' : 'Deficit',
      badgeColor: totals.totalBalance >= 0 ? 'var(--income)' : 'var(--expense)',
      badgeBg: totals.totalBalance >= 0 ? 'var(--income-light)' : 'var(--expense-light)',
      subtitle: `${filteredTransactions.length} transactions in this period`,
    },
    {
      id: 'income',
      title: 'Total Inflow (Income)',
      amount: totals.totalIncome,
      isPositive: true,
      icon: 'arrow-down',
      badge: `${filteredTransactions.filter((t) => t.type === 'income').length} deposits`,
      badgeColor: 'var(--income)',
      badgeBg: 'var(--income-light)',
      subtitle: 'Salary, freelance, business & dividends',
    },
    {
      id: 'expenses',
      title: 'Total Outflow (Expenses)',
      amount: totals.totalExpenses,
      isPositive: false,
      icon: 'arrow-up',
      badge: `${filteredTransactions.filter((t) => t.type === 'expense').length} charges`,
      badgeColor: 'var(--expense)',
      badgeBg: 'var(--expense-light)',
      subtitle: 'Groceries, rent, fuel, bills & shopping',
    },
    {
      id: 'savings',
      title: 'Net Savings Rate',
      amount: totals.savingsRate,
      isPercentage: true,
      isPositive: totals.savingsRate >= 20,
      icon: 'trending-up',
      badge: totals.savingsRate >= 20 ? 'Optimal' : totals.savingsRate > 0 ? 'Moderate' : 'Low',
      badgeColor:
        totals.savingsRate >= 20
          ? 'var(--income)'
          : totals.savingsRate > 0
          ? 'var(--warning)'
          : 'var(--expense)',
      badgeBg:
        totals.savingsRate >= 20
          ? 'var(--income-light)'
          : totals.savingsRate > 0
          ? 'var(--warning-light)'
          : 'var(--expense-light)',
      subtitle: totals.savingsRate >= 20 ? 'Exceeds recommended 20% target' : 'Aim for at least 20% savings',
    },
  ];

  return (
    <section aria-label="Financial Summary Cards">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="pro-card"
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {card.title}
                </span>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: card.badgeBg,
                    color: card.badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Icon name={card.icon} size={18} color="currentColor" />
                </div>
              </div>

              {/* Amount Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    fontFamily: 'var(--font-mono)',
                    color:
                      card.id === 'balance'
                        ? card.amount >= 0
                          ? 'var(--text-primary)'
                          : 'var(--expense)'
                        : card.id === 'income'
                        ? 'var(--income)'
                        : card.id === 'expenses'
                        ? 'var(--expense)'
                        : 'var(--text-primary)',
                  }}
                >
                  {card.isPercentage ? formatPercentage(card.amount) : formatCurrency(card.amount)}
                </span>

                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    backgroundColor: card.badgeBg,
                    color: card.badgeColor,
                  }}
                >
                  {card.badge}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '0.875rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>{card.subtitle}</span>
              {card.isPercentage && (
                <div
                  style={{
                    width: '64px',
                    height: '5px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(0, Math.min(100, card.amount))}%`,
                      backgroundColor: card.badgeColor,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
