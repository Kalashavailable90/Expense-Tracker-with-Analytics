import { useState, useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { useDebounce } from '../../hooks/useDebounce';
import { filterAndSortTransactions } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getCategoryColor } from '../../data/categories';
import { FilterBar } from '../Filters/FilterBar';
import { Icon } from '../common/Icons';

export const TransactionList = () => {
  const { transactions, deleteTransaction, openForm } = useExpense();

  // Filters state
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounced search query
  const debouncedSearch = useDebounce(searchInput, 250);

  const filteredTransactions = useMemo(() => {
    return filterAndSortTransactions(transactions, {
      search: debouncedSearch,
      category,
      type,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
  }, [transactions, debouncedSearch, category, type, startDate, endDate, sortBy, sortOrder]);

  const filteredStats = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'income') incomeSum += Number(t.amount) || 0;
      else if (t.type === 'expense') expenseSum += Number(t.amount) || 0;
    }
    return {
      incomeSum,
      expenseSum,
      net: incomeSum - expenseSum,
    };
  }, [filteredTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchInput('');
    setCategory('all');
    setType('all');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Quick Action */}
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
            Transaction History
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Filter, search, review, and edit all your recorded transactions
          </p>
        </div>

        <button
          onClick={() => openForm()}
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
          <span>+ Add Transaction</span>
        </button>
      </div>

      {/* Filter Component */}
      <FilterBar
        search={searchInput}
        setSearch={(val) => {
          setSearchInput(val);
          setCurrentPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setCurrentPage(1);
        }}
        type={type}
        setType={(val) => {
          setType(val);
          setCurrentPage(1);
        }}
        startDate={startDate}
        setStartDate={(val) => {
          setStartDate(val);
          setCurrentPage(1);
        }}
        endDate={endDate}
        setEndDate={(val) => {
          setEndDate(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onReset={handleResetFilters}
      />

      {/* Filter Summary Chips */}
      {filteredTransactions.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredTransactions.length}</strong> matching transaction
            {filteredTransactions.length === 1 ? '' : 's'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--income)' }}>
              Inflow: <strong>+{formatCurrency(filteredStats.incomeSum)}</strong>
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--expense)' }}>
              Outflow: <strong>-{formatCurrency(filteredStats.expenseSum)}</strong>
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span
              style={{
                fontWeight: 700,
                color: filteredStats.net >= 0 ? 'var(--income)' : 'var(--expense)',
              }}
            >
              Net Savings: {formatCurrency(filteredStats.net)}
            </span>
          </div>
        </div>
      )}

      {/* Transaction List Items */}
      {filteredTransactions.length === 0 ? (
        <div
          className="pro-card"
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            borderStyle: 'dashed',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--text-muted)',
            }}
          >
            <Icon name="search" size={26} />
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            No records found
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              maxWidth: '420px',
              margin: '0.5rem auto 1.5rem',
            }}
          >
            {transactions.length === 0
              ? 'Your ledger is currently empty. Start recording your daily income and expenses or load sample demo data.'
              : 'No entries match your search criteria. Try clearing or relaxing your filters.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {transactions.length > 0 && (
              <button
                onClick={handleResetFilters}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => openForm()}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--income)',
                color: '#fff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add Transaction
            </button>
          </div>
        </div>
      ) : (
        <div className="pro-card" style={{ padding: 0, overflow: 'hidden' }}>
          {paginatedTransactions.map((tx, idx) => {
            const isExpense = tx.type === 'expense';
            const catColor = getCategoryColor(tx.category);

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom:
                    idx < paginatedTransactions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background var(--transition-fast)',
                }}
              >
                {/* Left: Category Icon, Title, Date, Note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${catColor}18`,
                      color: catColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={isExpense ? 'arrow-up' : 'arrow-down'} size={18} color="currentColor" />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                        {tx.category}
                      </span>
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.625rem',
                          fontWeight: 700,
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
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {tx.paymentMode}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '3px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(tx.date, 'EEEE, d MMM, yyyy')}
                      </span>
                      {tx.note && (
                        <span
                          title={tx.note}
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-input)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            maxWidth: '320px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tx.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount in INR & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: isExpense ? 'var(--expense)' : 'var(--income)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {isExpense ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => openForm(tx)}
                      aria-label={`Edit ${tx.category} transaction`}
                      title="Edit transaction"
                      style={{
                        padding: '7px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="edit" size={16} />
                    </button>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      aria-label={`Delete ${tx.category} transaction`}
                      title="Delete transaction"
                      style={{
                        padding: '7px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: currentPage === 1 ? 'transparent' : 'var(--bg-surface)',
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: currentPage === totalPages ? 'transparent' : 'var(--bg-surface)',
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
