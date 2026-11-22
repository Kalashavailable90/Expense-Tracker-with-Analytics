import { useMemo } from 'react';
import { calculateTopExpenses } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryColor } from '../../data/categories';
import { Icon } from '../common/Icons';

export const TopExpenses = ({ transactions, timeframe = 'this-month' }) => {
  const topExpenses = useMemo(() => {
    return calculateTopExpenses(transactions, timeframe, 5);
  }, [transactions, timeframe]);

  return (
    <div className="pro-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Top 5 Expenditures
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Highest single outflow transactions recorded in this period
          </p>
        </div>
      </div>

      {topExpenses.length === 0 ? (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No expenses recorded for this period
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topExpenses.map((tx, idx) => {
            const catColor = getCategoryColor(tx.category);
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {tx.category}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                      {formatDate(tx.date)} {tx.note ? `• ${tx.note}` : ''}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--expense)',
                  }}
                >
                  -{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
