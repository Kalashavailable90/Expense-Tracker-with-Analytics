import { useState, useEffect } from 'react';

/**
 * Debounce a rapidly changing value by delayMs.
 * @template T
 * @param {T} value
 * @param {number} delayMs
 * @returns {T}
 */
export const useDebounce = (value, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
};
