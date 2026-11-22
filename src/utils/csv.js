import { isValid, parseISO } from 'date-fns';

/**
 * Escapes a cell value for standard CSV compatibility.
 * @param {any} val
 * @returns {string}
 */
const escapeCSVCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
};

/**
 * Converts transactions array into a formatted CSV string.
 * @param {Array} transactions
 * @returns {string}
 */
export const exportTransactionsToCSV = (transactions = []) => {
  const headers = ['id', 'type', 'amount', 'category', 'date', 'note'];
  const rows = transactions.map((t) => [
    escapeCSVCell(t.id || ''),
    escapeCSVCell(t.type || 'expense'),
    escapeCSVCell(Number(t.amount || 0).toFixed(2)),
    escapeCSVCell(t.category || ''),
    escapeCSVCell(t.date || ''),
    escapeCSVCell(t.note || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
};

/**
 * Triggers a browser download of the given CSV string.
 * @param {string} csvContent
 * @param {string} filename
 */
export const downloadCSVFile = (csvContent, filename = 'expense-tracker-transactions.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Parses raw CSV lines handling quoted fields with commas.
 * @param {string} line
 * @returns {Array<string>}
 */
const parseCSVLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

/**
 * Validates and parses imported CSV string into valid transactions list.
 * @param {string} csvText
 * @param {Array} existingTransactions - used to detect and prevent duplicates
 * @returns {{ validTransactions: Array, errors: Array<string>, duplicatesCount: number }}
 */
export const parseTransactionsCSV = (csvText = '', existingTransactions = []) => {
  const errors = [];
  const validTransactions = [];
  let duplicatesCount = 0;

  if (!csvText || !csvText.trim()) {
    return {
      validTransactions: [],
      errors: ['The selected CSV file is empty.'],
      duplicatesCount: 0,
    };
  }

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      validTransactions: [],
      errors: ['CSV must contain a header row and at least one data row.'],
      duplicatesCount: 0,
    };
  }

  // Parse header
  const rawHeaders = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, ''));
  const headerMap = {};
  rawHeaders.forEach((h, index) => {
    headerMap[h] = index;
  });

  const requiredFields = ['type', 'amount', 'category', 'date'];
  const missingHeaders = requiredFields.filter((f) => headerMap[f] === undefined);

  if (missingHeaders.length > 0) {
    return {
      validTransactions: [],
      errors: [
        `Missing required column headers: ${missingHeaders.join(', ')}. (Required: type, amount, category, date, note)`,
      ],
      duplicatesCount: 0,
    };
  }

  // Existing keys to check for duplicates
  const existingKeySet = new Set(
    existingTransactions.map(
      (t) =>
        `${t.type}_${Number(t.amount).toFixed(2)}_${t.category.toLowerCase()}_${t.date ? t.date.split('T')[0] : ''}_${(t.note || '').trim().toLowerCase()}`
    )
  );

  // Parse data rows
  for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
    const rowNum = rowIndex + 1;
    const cells = parseCSVLine(lines[rowIndex]);

    if (cells.length === 0 || (cells.length === 1 && !cells[0])) {
      continue;
    }

    const rawType = (cells[headerMap['type']] || '').trim().toLowerCase();
    const rawAmount = (cells[headerMap['amount']] || '').trim();
    const rawCategory = (cells[headerMap['category']] || '').trim();
    const rawDate = (cells[headerMap['date']] || '').trim();
    const rawNote =
      headerMap['note'] !== undefined ? (cells[headerMap['note']] || '').trim() : '';
    const rawId = headerMap['id'] !== undefined ? (cells[headerMap['id']] || '').trim() : '';

    const rowErrors = [];

    // Validate type
    if (rawType !== 'income' && rawType !== 'expense') {
      rowErrors.push(`Row ${rowNum}: Invalid type "${rawType}". Must be "income" or "expense".`);
    }

    // Validate amount
    const parsedAmount = parseFloat(rawAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      rowErrors.push(
        `Row ${rowNum}: Amount must be a positive number greater than 0. Found "${rawAmount}".`
      );
    }

    // Validate category
    if (!rawCategory) {
      rowErrors.push(`Row ${rowNum}: Category cannot be empty.`);
    }

    // Validate date
    let isoDate = '';
    if (!rawDate) {
      rowErrors.push(`Row ${rowNum}: Date cannot be empty.`);
    } else {
      const parsedDate = parseISO(rawDate);
      if (!isValid(parsedDate)) {
        // Try fallback native date parsing
        const nativeParsed = new Date(rawDate);
        if (!isValid(nativeParsed)) {
          rowErrors.push(`Row ${rowNum}: Invalid date format "${rawDate}".`);
        } else {
          isoDate = nativeParsed.toISOString();
        }
      } else {
        isoDate = parsedDate.toISOString();
      }
    }

    // Note validation
    if (rawNote && rawNote.length > 150) {
      rowErrors.push(`Row ${rowNum}: Note exceeds maximum limit of 150 characters.`);
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    // Duplicate check
    const duplicateKey = `${rawType}_${parsedAmount.toFixed(2)}_${rawCategory.toLowerCase()}_${isoDate.split('T')[0]}_${rawNote.toLowerCase()}`;
    if (existingKeySet.has(duplicateKey)) {
      duplicatesCount++;
      continue;
    }
    existingKeySet.add(duplicateKey);

    validTransactions.push({
      id: rawId && !rawId.startsWith('tx-') ? `tx-csv-${Date.now()}-${rowIndex}` : rawId || `tx-csv-${Date.now()}-${rowIndex}`,
      type: rawType,
      amount: Math.round(parsedAmount * 100) / 100,
      category: rawCategory,
      date: isoDate,
      note: rawNote,
    });
  }

  return {
    validTransactions,
    errors,
    duplicatesCount,
  };
};
