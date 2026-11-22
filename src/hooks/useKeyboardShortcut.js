import { useEffect } from 'react';

/**
 * Custom hook to register keyboard shortcuts.
 * Ignores keystrokes when typing inside inputs, textareas, or selects.
 * @param {string} targetKey - e.g. 'n' or 'Escape'
 * @param {() => void} callback
 * @param {Object} options
 * @param {boolean} options.ctrl - whether ctrl/cmd is required
 * @param {boolean} options.alt - whether alt is required
 */
export const useKeyboardShortcut = (targetKey, callback, options = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is currently typing in a form field
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isEditable = document.activeElement?.isContentEditable;

      if (
        (activeTag === 'input' ||
          activeTag === 'textarea' ||
          activeTag === 'select' ||
          isEditable) &&
        targetKey.toLowerCase() !== 'escape'
      ) {
        return;
      }

      const matchKey = event.key.toLowerCase() === targetKey.toLowerCase();
      const matchCtrl = options.ctrl ? event.ctrlKey || event.metaKey : true;
      const matchAlt = options.alt ? event.altKey : true;

      if (matchKey && matchCtrl && matchAlt) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, callback, options]);
};
