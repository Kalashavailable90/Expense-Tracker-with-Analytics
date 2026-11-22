import { useState, useEffect, useRef } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { formatDateForInput } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icons';

export const TransactionForm = () => {
  const { isFormOpen, closeForm, editingTransaction, addTransaction, editTransaction } =
    useExpense();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const amountInputRef = useRef(null);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const quickNotes =
    type === 'expense'
      ? [
          'Kirana & Groceries',
          'Swiggy / Zomato order',
          'Petrol pump',
          'Electricity bill',
          'House rent',
          'Jio / Airtel recharge',
          'Maid / Cook salary',
          'Medicine & pharmacy',
          'Auto / Cab fare',
        ]
      : [
          'Monthly salary credit',
          'Freelance UPI payment',
          'Shop / Business profit',
          'Mutual fund dividend',
          'Festival cash gift',
          'Rental income',
        ];

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'expense');
      setAmount(editingTransaction.amount !== undefined ? String(editingTransaction.amount) : '');
      setCategory(editingTransaction.category || '');
      setDate(formatDateForInput(editingTransaction.date));
      setPaymentMode(editingTransaction.paymentMode || 'UPI');
      setNote(editingTransaction.note || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].name);
      setDate(formatDateForInput(new Date()));
      setPaymentMode('UPI');
      setNote('');
    }
    setErrors({});
    setTouched({});

    if (isFormOpen) {
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 60);
    }
  }, [editingTransaction, isFormOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    const categoryList = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(categoryList[0].name);
  };

  const handleAddQuickAmount = (val) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + val));
    if (touched.amount) setErrors((prev) => ({ ...prev, amount: '' }));
  };

  const validate = () => {
    const newErrors = {};

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than ₹0.00';
    } else if (numAmount > 100000000) {
      newErrors.amount = 'Amount exceeds maximum allowable threshold (₹10,00,00,000)';
    }

    if (!category || !category.trim()) {
      newErrors.category = 'Category selection is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        newErrors.date = 'Please enter a valid date';
      }
    }

    if (note && note.length > 120) {
      newErrors.note = `Note exceeds maximum length of 120 characters (${note.length}/120)`;
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({ amount: true, category: true, date: true, note: true });
      return;
    }

    const payload = {
      type,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      paymentMode,
      note: note.trim(),
    };

    if (editingTransaction) {
      editTransaction({
        ...editingTransaction,
        ...payload,
      });
    } else {
      addTransaction(payload);
    }
  };

  const categoryOptions = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isFormOpen}
      onClose={closeForm}
      title={editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Type Toggle: Expense vs Income */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Transaction Type
          </label>
          <div
            role="radiogroup"
            aria-label="Transaction Type"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              type="button"
              role="radio"
              aria-checked={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: type === 'expense' ? 'var(--expense)' : 'transparent',
                color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: type === 'expense' ? '0 2px 6px var(--expense-glow)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon name="arrow-up" size={16} color={type === 'expense' ? '#fff' : 'currentColor'} />
              Expense (Outflow)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={type === 'income'}
              onClick={() => handleTypeChange('income')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: type === 'income' ? 'var(--income)' : 'transparent',
                color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: type === 'income' ? '0 2px 6px var(--income-glow)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon name="arrow-down" size={16} color={type === 'income' ? '#fff' : 'currentColor'} />
              Income (Inflow)
            </button>
          </div>
        </div>

        {/* Amount in INR (₹) */}
        <div>
          <label
            htmlFor="tx-amount"
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
          >
            Amount (₹ INR) <span style={{ color: 'var(--expense)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '1.25rem',
                pointerEvents: 'none',
              }}
            >
              ₹
            </span>
            <input
              ref={amountInputRef}
              id="tx-amount"
              type="number"
              step="1"
              min="1"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (touched.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              onBlur={() => handleBlur('amount')}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'tx-amount-error' : undefined}
              style={{
                width: '100%',
                padding: '12px 14px 12px 36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: `1.5px solid ${errors.amount ? 'var(--expense)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
              }}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '2px' }}>
              Add:
            </span>
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAddQuickAmount(q)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                +₹{q}
              </button>
            ))}
          </div>

          {errors.amount && (
            <p id="tx-amount-error" style={{ color: 'var(--expense)', fontSize: '0.75rem', marginTop: '6px', fontWeight: 500 }}>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Payment Mode */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Payment Mode
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { id: 'Cash', label: 'Cash' },
              { id: 'Card', label: 'Credit / Debit Card' },
              { id: 'NetBanking', label: 'Net Banking' },
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMode(pm.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${paymentMode === pm.id ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: paymentMode === pm.id ? 'var(--primary-light)' : 'var(--bg-input)',
                  color: paymentMode === pm.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label
              htmlFor="tx-category"
              style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Category <span style={{ color: 'var(--expense)' }}>*</span>
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (touched.category) setErrors((prev) => ({ ...prev, category: '' }));
              }}
              onBlur={() => handleBlur('category')}
              aria-invalid={!!errors.category}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: `1px solid ${errors.category ? 'var(--expense)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            >
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p style={{ color: 'var(--expense)', fontSize: '0.75rem', marginTop: '4px' }}>
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tx-date"
              style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              Date <span style={{ color: 'var(--expense)' }}>*</span>
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (touched.date) setErrors((prev) => ({ ...prev, date: '' }));
              }}
              onBlur={() => handleBlur('date')}
              aria-invalid={!!errors.date}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: `1px solid ${errors.date ? 'var(--expense)' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            {errors.date && (
              <p style={{ color: 'var(--expense)', fontSize: '0.75rem', marginTop: '4px' }}>
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Note / Description */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label
              htmlFor="tx-note"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              Note / Description (Optional)
            </label>
            <span style={{ fontSize: '0.75rem', color: note.length > 120 ? 'var(--expense)' : 'var(--text-muted)' }}>
              {note.length}/120
            </span>
          </div>

          <input
            id="tx-note"
            type="text"
            placeholder="e.g. DMart weekly ration, Swiggy dinner, Jio recharge"
            value={note}
            maxLength={130}
            onChange={(e) => {
              setNote(e.target.value);
              if (touched.note) setErrors((prev) => ({ ...prev, note: '' }));
            }}
            onBlur={() => handleBlur('note')}
            aria-invalid={!!errors.note}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-input)',
              border: `1px solid ${errors.note ? 'var(--expense)' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />

          {/* Quick Note Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              Suggestions:
            </span>
            {quickNotes.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setNote(suggestion)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {errors.note && (
            <p style={{ color: 'var(--expense)', fontSize: '0.75rem', marginTop: '4px' }}>
              {errors.note}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
          <button
            type="button"
            onClick={closeForm}
            style={{
              padding: '10px 18px',
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
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            {editingTransaction ? 'Save Changes' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
