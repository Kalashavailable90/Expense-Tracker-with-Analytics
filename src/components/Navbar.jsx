import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Icon } from './common/Icons';
import { Modal } from './common/Modal';

export const Navbar = () => {
  const { activeTab, setActiveTab, theme, toggleTheme, openForm, seedData, clearAllData, transactions } =
    useExpense();

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: 'pie-chart' },
    { id: 'transactions', label: 'Transactions', icon: 'list', count: transactions.length },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'budgets', label: 'Budgets', icon: 'target' },
  ];

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all data? You can re-seed sample demo data anytime.')) {
      clearAllData();
    }
  };

  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Brand Logo with Indian Rupee ₹ Symbol */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 40%, #047857 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                fontWeight: 900,
                fontSize: '1.4rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ₹
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                  }}
                >
                  Rupee<span style={{ color: 'var(--income)' }}>Pulse</span>
                </span>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--income-light)',
                    color: 'var(--income-text)',
                    letterSpacing: '0.04em',
                  }}
                >
                  ₹ INR
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Personal Finance & Expense Tracker</span>
                <span style={{ color: 'var(--border-color)' }}>•</span>
                <span>100% Private & Local</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              padding: '4px',
              border: '1px solid var(--border-color)',
            }}
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 15px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 2px 8px var(--primary-glow)' : 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Icon name={item.icon} size={15} color={isActive ? '#ffffff' : 'currentColor'} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--border-color)',
                        color: isActive ? '#ffffff' : 'var(--text-muted)',
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Tools & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* User Guide Button */}
            <button
              onClick={() => setIsHelpOpen(true)}
              title="How to use this tracker"
              aria-label="User guide"
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Icon name="check-circle" size={14} color="var(--income)" />
              <span>User Guide</span>
            </button>

            {/* Seed demo data */}
            <button
              onClick={seedData}
              title="Load sample demo data in Indian Rupees"
              aria-label="Seed sample demo data"
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Icon name="database" size={14} color="var(--primary)" />
              <span>Sample Data (₹)</span>
            </button>

            {/* Clear data */}
            <button
              onClick={handleClear}
              title="Clear all stored data"
              aria-label="Clear all stored data"
              style={{
                padding: '7px 9px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon name="trash" size={14} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
            </button>

            {/* Primary CTA: Add Transaction in INR */}
            <button
              onClick={() => openForm()}
              aria-label="Add transaction, keyboard shortcut N"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Icon name="plus" size={16} color="#ffffff" />
              <span>+ Add Transaction</span>
              <span
                style={{
                  marginLeft: '4px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}
              >
                N
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* English User Guide Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="RupeePulse User Guide"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--income-light)',
              color: 'var(--income-text)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
            }}
          >
            🇮🇳 Built for Indian Citizens: Track every rupee in ₹ INR with complete privacy. Your data stays 100% on your device (no bank logins, no passwords required).
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              1. How to Add a Transaction
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Click <strong>"+ Add Transaction"</strong> at the top right or simply press the <strong>N</strong> key on your keyboard. Choose <strong>Expense</strong> or <strong>Income</strong>, enter the amount in ₹, select category (Kirana & Groceries, Rent, Fuel, etc.), tag payment mode (UPI, Cash, Card), and click Save.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              2. Payment Mode Tagging
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Tag entries by <strong>UPI (GPay / PhonePe / Paytm)</strong>, <strong>Cash</strong>, <strong>Card</strong>, or <strong>Net Banking</strong> to see how much liquid cash vs digital money you spend.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              3. Category Monthly Budgets
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Visit the <strong>Budgets</strong> tab to set monthly limits for groceries, dining, shopping, and fuel. Progress bars turn red and alert you whenever you exceed your threshold.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              4. Undo Accidental Deletions
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Whenever you delete a transaction, an <strong>Undo</strong> notification appears at the bottom right for 5 seconds to let you restore it instantly.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={() => setIsHelpOpen(false)}
              style={{
                padding: '9px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--income)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Got It
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
