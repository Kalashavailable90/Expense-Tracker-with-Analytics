import { useMemo } from 'react';
import { calculateCategoryInsights } from '../../utils/calculations';
import { Icon } from '../common/Icons';

export const SpendingInsights = ({ transactions }) => {
  const insights = useMemo(() => {
    return calculateCategoryInsights(transactions, new Date());
  }, [transactions]);

  return (
    <div className="pro-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="trending-up" size={16} color="currentColor" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Smart Spending Insights
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Month-over-month pattern detection & anomaly alerts
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {insights.map((insight) => {
          const isWarning = insight.type === 'warning';
          const isSuccess = insight.type === 'success';

          const iconName = isWarning ? 'trending-up' : isSuccess ? 'trending-down' : 'target';
          const badgeBg = isWarning
            ? 'var(--expense-light)'
            : isSuccess
            ? 'var(--income-light)'
            : 'var(--primary-light)';
          const badgeColor = isWarning
            ? 'var(--expense)'
            : isSuccess
            ? 'var(--income)'
            : 'var(--primary)';

          return (
            <div
              key={insight.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <Icon name={iconName} size={15} color="currentColor" />
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
