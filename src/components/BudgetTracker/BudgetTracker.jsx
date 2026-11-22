import { useState, useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { calculateBudgetStatus } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from '../../data/categories';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icons';

export const BudgetTracker = () => {
  const { transactions, budgets, setBudget } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [limitAmount, setLimitAmount] = useState('');

  const budgetStatuses = useMemo(() => {
    return calculateBudgetStatus(transactions, budgets, new Date());
  }, [transactions, budgets]);

  // Overall budget metrics
  const overallBudgetSummary = useMemo(() => {
    let totalLimit = 0;
    let totalSpent = 0;
    let exceededCategoriesCount = 0;

    for (const b of budgetStatuses) {
      totalLimit += b.limit;
      totalSpent += b.spent;
      if (b.isExceeded) exceededCategoriesCount++;
    }

    const overallPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    const overallRemaining = totalLimit - totalSpent;

    return {
      totalLimit,
      totalSpent,
      overallRemaining,
      overallPct,
      exceededCategoriesCount,
    };
  }, [budgetStatuses]);

  const handleOpenModal = (category = null, currentLimit = null) => {
    if (category) {
      setSelectedCategory(category);
      setLimitAmount(currentLimit !== null ? String(currentLimit) : '');
    } else {
      setSelectedCategory(EXPENSE_CATEGORIES[0].name);
      setLimitAmount('');
    }
    setIsModalOpen(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const num = parseFloat(limitAmount);
    if (!isNaN(num) && num >= 0) {
      setBudget(selectedCategory, num);
      setIsModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Monthly Budget Goals
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Set monthly limits in ₹ INR to control expenditure across categories
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--income)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Icon name="plus" size={16} color="#fff" />
          <span>+ Set Budget</span>
        </button>
      </div>

      {/* Overall Budget Status Hero Card */}
      <div className="pro-card" style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Overall Monthly Budget Allocation
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '0.375rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(overallBudgetSummary.totalSpent)}
              </span>
              <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
                / {formatCurrency(overallBudgetSummary.totalLimit)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remaining Buffer</div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: overallBudgetSummary.overallRemaining >= 0 ? 'var(--income)' : 'var(--expense)',
                }}
              >
                {formatCurrency(overallBudgetSummary.overallRemaining)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Utilization</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatPercentage(overallBudgetSummary.overallPct)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerts</div>
              <div
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: overallBudgetSummary.exceededCategoriesCount > 0 ? 'var(--expense)' : 'var(--income)',
                }}
              >
                {overallBudgetSummary.exceededCategoriesCount} Over Limit
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(overallBudgetSummary.overallPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall budget usage"
          style={{
            height: '10px',
            width: '100%',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginTop: '1.25rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(overallBudgetSummary.overallPct, 100)}%`,
              backgroundColor:
                overallBudgetSummary.overallPct > 100
                  ? 'var(--expense)'
                  : overallBudgetSummary.overallPct > 80
                  ? 'var(--warning)'
                  : 'var(--income)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 400ms ease',
            }}
          />
        </div>
      </div>

      {/* Category Budget Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {budgetStatuses.map((b) => {
          const isExceeded = b.isExceeded;
          const isWarning = b.isWarning;
          const progressColor = isExceeded
            ? 'var(--expense)'
            : isWarning
            ? 'var(--warning)'
            : 'var(--income)';

          return (
            <div
              key={b.category}
              className="pro-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: `4px solid ${progressColor}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        backgroundColor: b.color,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {b.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenModal(b.category, b.limit)}
                    aria-label={`Edit ${b.category} budget limit`}
                    title="Change budget limit"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Icon name="edit" size={15} />
                  </button>
                </div>

                {/* Spent vs Limit Numbers */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: '0.875rem',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '1.375rem',
                        fontWeight: 800,
                        color: progressColor,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatCurrency(b.spent)}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      limit {formatCurrency(b.limit)}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: progressColor,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isExceeded
                        ? 'var(--expense-light)'
                        : isWarning
                        ? 'var(--warning-light)'
                        : 'var(--income-light)',
                    }}
                  >
                    {isExceeded ? 'EXCEEDED' : `${formatPercentage(b.rawPercentage)} used`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(b.rawPercentage)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${b.category} budget progress`}
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${b.percentage}%`,
                      backgroundColor: progressColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    marginTop: '6px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>
                    {isExceeded
                      ? `Over budget by ${formatCurrency(Math.abs(b.remaining))}`
                      : `${formatCurrency(b.remaining)} left to spend`}
                  </span>
                  <span>{b.limit > 0 ? formatCurrency(b.limit) : 'No limit'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Category Budget"
      >
        <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Expense Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Monthly Limit Amount (₹ INR)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                }}
              >
                ₹
              </span>
              <input
                type="number"
                step="500"
                min="0"
                placeholder="e.g. 10000"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 22px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--income)',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Save Budget
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
