import { useEffect } from 'react';
import { SHORTCUTS } from '../constants';

interface KeyboardShortcuts {
  onPause?: () => void;
  onReset?: () => void;
  onDebug?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onPause,
  onReset,
  onDebug,
  enabled = true,
}: KeyboardShortcuts) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === SHORTCUTS.PAUSE && !e.repeat) {
        e.preventDefault();
        onPause?.();
      } else if (e.code === SHORTCUTS.RESET && !e.repeat) {
        e.preventDefault();
        onReset?.();
      } else if (e.code === SHORTCUTS.DEBUG && !e.repeat) {
        e.preventDefault();
        onDebug?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPause, onReset, onDebug, enabled]);
}
