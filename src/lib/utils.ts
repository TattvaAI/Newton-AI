import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

/**
 * Generate a unique identifier
 */
export const generateId = (): string => uuidv4();

/**
 * Clean AI-generated code by removing markdown and prefixes
 */
export const cleanGeneratedCode = (code: string): string => {
  let cleaned = code;
  
  // Remove markdown code blocks (all variations)
  cleaned = cleaned.replace(/```(?:javascript|js|typescript|ts)?\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  
  // Remove common AI prefixes (case insensitive)
  cleaned = cleaned.replace(/^here'?s?\s*(the\s*)?(code|solution|implementation|answer)[:\s]*/im, '');
  cleaned = cleaned.replace(/^(the\s*)?code[:\s]*/im, '');
  cleaned = cleaned.replace(/^output[:\s]*/im, '');
  cleaned = cleaned.replace(/^\s*[→\-]\s*/im, '');
  
  // Remove any standalone backticks (but preserve template literals)
  cleaned = cleaned.replace(/^`+$/gm, '');
  
  // Remove common explanation patterns at start
  cleaned = cleaned.replace(/^(certainly|sure|of course|okay)[!,.]?\s*/im, '');
  
  // Remove "Here is..." patterns
  cleaned = cleaned.replace(/^here\s+(is|are)\s+.{0,50}?[:\n]/im, '');
  
  // Trim and ensure no leading/trailing whitespace issues
  cleaned = cleaned.trim();
  
  // If the code starts with explanatory text before actual code, try to extract just the code
  const lines = cleaned.split('\n');
  let codeStartIndex = 0;
  
  // Find where actual code starts (usually with const, let, var, for, if, etc.)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line && (line.startsWith('const ') || line.startsWith('let ') || 
                 line.startsWith('var ') || line.startsWith('for ') || 
                 line.startsWith('if ') || line.startsWith('function ') ||
                 line.startsWith('//') || line.includes('Bodies.') || 
                 line.includes('Composite.') || line.includes('World.'))) {
      codeStartIndex = i;
      break;
    }
  }
  
  if (codeStartIndex > 0) {
    cleaned = lines.slice(codeStartIndex).join('\n');
  }
  
  // Final validation - ensure it looks like JavaScript
  if (cleaned && !cleaned.match(/^(const|let|var|for|if|function|\s*\/\/)/)) {
    logger.warn('Cleaned code doesn\'t start with valid JavaScript:', cleaned.substring(0, 100));
  }
  
  return cleaned;
};

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generate random HSL color
 */
export const randomHSL = (saturation = 70, lightness = 60): string => {
  const hue = Math.random() * 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Check if code string is valid
 */
export const isValidCode = (code: string): boolean => {
  return code.trim().length > 0 && !code.includes('undefined');
};

/**
 * Safe JSON parse
 */
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};
