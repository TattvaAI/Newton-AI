import { describe, it, expect } from 'vitest';
import { debounce, throttle, cleanGeneratedCode, formatNumber } from './utils';

describe('utils', () => {
  describe('cleanGeneratedCode', () => {
    it('should remove markdown code blocks', () => {
      const input = '```javascript\nconst x = 5;\n```';
      const result = cleanGeneratedCode(input);
      expect(result).toBe('const x = 5;');
    });

    it('should remove AI prefixes', () => {
      const input = 'Here is the code:\nconst x = 5;';
      const result = cleanGeneratedCode(input);
      expect(result).toContain('const x = 5');
    });

    it('should preserve valid JavaScript', () => {
      const input = 'const box = Bodies.rectangle(400, 200, 80, 80);';
      const result = cleanGeneratedCode(input);
      expect(result).toBe(input);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      const result = formatNumber(1000);
      expect(result).toBe('1,000');
    });

    it('should handle decimals', () => {
      const result = formatNumber(1234.56);
      expect(result).toBe('1,234.56');
    });
  });

  describe('debounce', () => {
    it('should delay function execution', async () => {
      let called = false;
      const fn = debounce(() => { called = true; }, 100);
      
      fn();
      expect(called).toBe(false);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(called).toBe(true);
    });
  });

  describe('throttle', () => {
    it('should limit function calls', async () => {
      let count = 0;
      const fn = throttle(() => { count++; }, 100);
      
      fn();
      fn();
      fn();
      
      expect(count).toBe(1);
      
      await new Promise(resolve => setTimeout(resolve, 150));
      fn();
      expect(count).toBe(2);
    });
  });
});
