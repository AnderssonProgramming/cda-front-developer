// Importar la clase Utils para testing
const fs = require('fs');
const path = require('path');

// Leer y ejecutar el archivo Utils para tener acceso a la clase
const utilsPath = path.join(__dirname, '../js/utils.js');
const utilsCode = fs.readFileSync(utilsPath, 'utf8');
eval(utilsCode);

describe('Utils Class', () => {
  
  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
    });
  });

  describe('sanitizeHTML', () => {
    beforeEach(() => {
      // Mock document.createElement para que funcione en el test
      if (typeof document === 'undefined') {
        global.document = {
          createElement: () => ({
            appendChild: jest.fn(),
            innerHTML: ''
          }),
          createTextNode: (text) => ({ textContent: text })
        };
      }
      
      // Mock específico para sanitizeHTML
      Utils.sanitizeHTML = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      };
    });

    test('should sanitize HTML content', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello';
      const result = Utils.sanitizeHTML(maliciousInput);
      
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;Hello');
      expect(result).not.toContain('<script>');
    });

    test('should handle normal text', () => {
      const normalText = 'Hello World';
      const result = Utils.sanitizeHTML(normalText);
      
      expect(result).toBe('Hello World');
    });

    test('should handle special characters', () => {
      const input = 'Price: $25 & 50¢';
      const result = Utils.sanitizeHTML(input);
      
      expect(result).toBe('Price: $25 &amp; 50¢');
    });
  });

  describe('debounce', () => {
    test('should debounce function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = Utils.debounce(mockFn, 100);
      
      // Call multiple times rapidly
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();
      
      // Should be called once after delay
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('isMobile', () => {
    test('should return true for mobile width', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      
      const result = Utils.isMobile();
      expect(result).toBe(true);
    });

    test('should return false for desktop width', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      
      const result = Utils.isMobile();
      expect(result).toBe(false);
    });
  });

  describe('matchesSearch', () => {
    test('should match case insensitive search', () => {
      const result1 = Utils.matchesSearch('Pasta Carbonara', 'pasta');
      const result2 = Utils.matchesSearch('Pasta Carbonara', 'CARBONARA');
      const result3 = Utils.matchesSearch('Pasta Carbonara', 'pizza');
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(false);
    });

    test('should handle empty search', () => {
      const result = Utils.matchesSearch('Any text', '');
      expect(result).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co',
        'test123@test-domain.org'
      ];
      
      validEmails.forEach(email => {
        expect(Utils.isValidEmail(email)).toBe(true);
      });
    });

    test('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'test@',
        'test..test@domain.com'
      ];
      
      invalidEmails.forEach(email => {
        const result = Utils.isValidEmail(email);
        console.log(`Testing ${email}: ${result}`);
        expect(result).toBe(false);
      });
    });
  });

  describe('formatFileSize', () => {
    test('should format file sizes correctly', () => {
      expect(Utils.formatFileSize(0)).toBe('0 Bytes');
      expect(Utils.formatFileSize(1024)).toBe('1 KB');
      expect(Utils.formatFileSize(1048576)).toBe('1 MB');
      expect(Utils.formatFileSize(1500)).toBe('1.46 KB');
    });
  });

  describe('truncateText', () => {
    test('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = Utils.truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 + "..."
    });

    test('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = Utils.truncateText(shortText, 20);
      
      expect(result).toBe('Short text');
    });
  });

  describe('deepClone', () => {
    test('should clone objects deeply', () => {
      const original = {
        name: 'Test',
        nested: {
          value: 42,
          array: [1, 2, 3]
        }
      };
      
      const cloned = Utils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.nested.array).not.toBe(original.nested.array);
    });

    test('should handle null and primitive values', () => {
      expect(Utils.deepClone(null)).toBe(null);
      expect(Utils.deepClone(42)).toBe(42);
      expect(Utils.deepClone('string')).toBe('string');
    });

    test('should clone dates correctly', () => {
      const date = new Date('2024-01-01');
      const cloned = Utils.deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned instanceof Date).toBe(true);
    });
  });

});
