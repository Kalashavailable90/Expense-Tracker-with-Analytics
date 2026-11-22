import { useState, useRef } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { exportTransactionsToCSV, downloadCSVFile, parseTransactionsCSV } from '../../utils/csv';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icons';

export const CSVManager = () => {
  const { transactions, importTransactions } = useExpense();
  const fileInputRef = useRef(null);

  const [importReport, setImportReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleExport = () => {
    if (transactions.length === 0) {
      alert('No transactions available to export.');
      return;
    }
    const csvContent = exportTransactionsToCSV(transactions);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSVFile(csvContent, `expense-pulse-transactions-${dateStr}.csv`);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const { validTransactions, errors, duplicatesCount } = parseTransactionsCSV(
          text,
          transactions
        );

        if (validTransactions.length > 0) {
          importTransactions(validTransactions);
        }

        setImportReport({
          importedCount: validTransactions.length,
          errors,
          duplicatesCount,
        });
        setIsReportModalOpen(true);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="pro-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
          }}
        >
          <Icon name="database" size={20} color="currentColor" />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Data Portability & CSV Hub
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Export your financial logs to spreadsheet formats or import bank CSV extracts with schema validation
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-file-input"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Import transactions from CSV file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Icon name="upload" size={15} color="var(--primary)" />
          <span>Import CSV</span>
        </button>

        <button
          onClick={handleExport}
          aria-label="Export all transactions to CSV file"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Icon name="download" size={15} color="var(--primary)" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* CSV Import Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="CSV Import Summary Report"
      >
        {importReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--income-light)',
                  color: 'var(--income-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Icon name="check-circle" size={20} color="var(--income)" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{importReport.importedCount}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>Successfully Ingested</div>
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning-text)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Icon name="rotate-ccw" size={20} color="var(--warning)" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{importReport.duplicatesCount}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>Skipped (Duplicates)</div>
                </div>
              </div>
            </div>

            {importReport.errors.length > 0 && (
              <div>
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--expense)',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Icon name="alert-circle" size={16} color="var(--expense)" />
                  Validation Discrepancies ({importReport.errors.length})
                </h4>
                <div
                  style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.6,
                  }}
                >
                  {importReport.errors.map((err, i) => (
                    <div key={i} style={{ color: 'var(--expense)' }}>
                      • {err}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={() => setIsReportModalOpen(false)}
                style={{
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
