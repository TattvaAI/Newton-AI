import { useEffect } from 'react';
import { SHORTCUTS } from '../constants';

interface KeyboardShortcuts {
  onPause?: () => void;
  onToggleDashboard?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onPause,
  onToggleDashboard,
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
      } else if ((e.key === 'm' || e.key === 'M') && !e.repeat) {
        e.preventDefault();
        onToggleDashboard?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPause, onToggleDashboard, enabled]);
}
