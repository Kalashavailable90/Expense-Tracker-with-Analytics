import { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { Icon } from '../common/Icons';

export const QuickAddBar = () => {
  const { addTransaction } = useExpense();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [note, setNote] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) return;

    addTransaction({
      type,
      amount: num,
      category,
      note: note.trim() || (type === 'expense' ? `${category} expense` : `${category} income`),
      paymentMode,
      date: new Date().toISOString(),
    });

    setAmount('');
    setNote('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="plus" size={14} color="currentColor" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            Quick Add Transaction
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Add in 2 seconds without popups)
          </span>
        </div>

        {isSuccess && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--income)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Icon name="check-circle" size={14} color="var(--income)" />
            Added successfully!
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(130px, 1fr) minmax(160px, 1.2fr) minmax(150px, 1.5fr) auto auto',
          gap: '0.625rem',
          alignItems: 'center',
        }}
      >
        {/* Type Toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-input)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: type === 'expense' ? 'var(--expense)' : 'transparent',
              color: type === 'expense' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            - Spent
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: type === 'income' ? 'var(--income)' : 'transparent',
              color: type === 'income' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            + Received
          </button>
        </div>

        {/* Amount */}
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
            }}
          >
            ₹
          </span>
          <input
            type="number"
            step="1"
            min="1"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 10px 8px 24px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Note / Description */}
        <input
          type="text"
          placeholder="Note (e.g. Swiggy, Kirana, Petrol)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
            outline: 'none',
          }}
        />

        {/* Payment Mode */}
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={{
            padding: '8px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="NetBanking">NetBanking</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: type === 'expense' ? 'var(--expense)' : 'var(--income)',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Add Entry
        </button>
      </form>
    </div>
  );
};
