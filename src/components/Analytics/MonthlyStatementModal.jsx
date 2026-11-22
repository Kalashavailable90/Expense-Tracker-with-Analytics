import { useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { calculateTotals, calculateSpendingByCategory, filterByTimeframe } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icons';

export const MonthlyStatementModal = ({ isOpen, onClose, timeframe = 'this-month' }) => {
  const { transactions } = useExpense();

  const filtered = useMemo(() => {
    return filterByTimeframe(transactions, timeframe);
  }, [transactions, timeframe]);

  const totals = useMemo(() => {
    return calculateTotals(transactions, timeframe);
  }, [transactions, timeframe]);

  const categoryBreakdown = useMemo(() => {
    return calculateSpendingByCategory(transactions, timeframe);
  }, [transactions, timeframe]);

  const timeframeLabels = {
    'this-month': 'Current Month',
    'last-month': 'Last Month',
    'last-3-months': 'Last 3 Months',
    'all-time': 'All-Time Record',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Financial Statement — ${timeframeLabels[timeframe] || 'Statement'}`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Statement Summary Card */}
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL INFLOW</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--income)', fontFamily: 'var(--font-mono)' }}>
              +{formatCurrency(totals.totalIncome)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL OUTFLOW</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--expense)', fontFamily: 'var(--font-mono)' }}>
              -{formatCurrency(totals.totalExpenses)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>NET SAVINGS</div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: totals.totalBalance >= 0 ? 'var(--income)' : 'var(--expense)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {formatCurrency(totals.totalBalance)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVINGS RATE</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totals.savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Top Spending Categories Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Category Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {categoryBreakdown.slice(0, 5).map((cat) => (
                <div
                  key={cat.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({cat.count} txns)</span>
                  </div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(cat.value)} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({cat.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Transactions ({filtered.length})
            </h4>
          </div>

          {filtered.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No transactions in this period.</p>
          ) : (
            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {filtered.map((t, i) => (
                <div
                  key={t.id || i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border-color)' : 'none',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.category}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDate(t.date)} {t.note ? `• ${t.note}` : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: t.type === 'expense' ? 'var(--expense)' : 'var(--income)',
                    }}
                  >
                    {t.type === 'expense' ? '-' : '+'}
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icon name="download" size={14} />
            Print / Save Statement
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
