/**
 * Production-safe logging utility
 * Logs only in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
  },
  
  error: (...args: unknown[]) => {
    console.error(...args); // Always log errors
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) console.info(...args);
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) console.debug(...args);
  },
};
