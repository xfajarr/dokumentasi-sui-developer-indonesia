import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; meta?: boolean; alt?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrlMatch = modifiers.ctrl ? e.ctrlKey : true;
      const metaMatch = modifiers.meta ? e.metaKey : true;
      const altMatch = modifiers.alt ? e.altKey : true;
      const shiftMatch = modifiers.shift ? e.shiftKey : true;

      // Handle 'Meta' key specifically (Command on Mac, Windows key on Windows)
      // Usually detailed as 'metaKey' in modifiers
      // Note: we're checking e.key which might be case sensitive depending on shift
      
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (modifiers.ctrl === undefined || e.ctrlKey === modifiers.ctrl) &&
        (modifiers.meta === undefined || e.metaKey === modifiers.meta) &&
        (modifiers.alt === undefined || e.altKey === modifiers.alt) &&
        (modifiers.shift === undefined || e.shiftKey === modifiers.shift)
      ) {
        e.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}
