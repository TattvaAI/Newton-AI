/**
 * Production-safe logging utility
 * Logs only in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) console.log(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) console.info(...args);
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) console.debug(...args);
  },
};
