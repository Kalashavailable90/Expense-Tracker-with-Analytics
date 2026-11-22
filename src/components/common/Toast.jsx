import { useExpense } from '../../context/ExpenseContext';
import { Icon } from './Icons';

export const Toast = () => {
  const { toast, dismissToast, undoDelete } = useExpense();

  if (!toast) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-modal)',
        color: 'var(--text-primary)',
        animation: 'slideUp 200ms ease-out',
        maxWidth: '90vw',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {toast.type === 'success' && <Icon name="check-circle" color="var(--income)" size={20} />}
        {toast.type === 'warning' && <Icon name="alert-circle" color="var(--warning)" size={20} />}
        {toast.type === 'info' && <Icon name="wallet" color="var(--primary)" size={20} />}
        {toast.type === 'error' && <Icon name="alert-circle" color="var(--expense)" size={20} />}
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
      </div>

      {toast.canUndo && (
        <button
          onClick={undoDelete}
          aria-label="Undo action"
          style={{
            marginLeft: '8px',
            padding: '4px 10px',
            background: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Icon name="rotate-ccw" size={13} color="#fff" />
          Undo
        </button>
      )}

      <button
        onClick={dismissToast}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
        }}
      >
        <Icon name="x" size={16} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
