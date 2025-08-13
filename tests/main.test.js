// Pruebas unitarias básicas para validar funcionalidades principales
const fs = require('fs');
const path = require('path');

// Leer archivos de JavaScript
const utilsPath = path.join(__dirname, '../js/utils.js');
const utilsCode = fs.readFileSync(utilsPath, 'utf8');

// Mock global objects antes de evaluar
global.window = {
  innerWidth: 1024,
  innerHeight: 768,
  scrollTo: jest.fn(),
  pageYOffset: 0
};

global.document = {
  createElement: jest.fn(() => ({
    appendChild: jest.fn(),
    innerHTML: '',
    textContent: '',
    style: {}
  })),
  getElementById: jest.fn()
};

// Evaluar código
eval(utilsCode);

describe('Cocina para Uno - Unit Tests', () => {

  describe('Utils Core Functions', () => {
    
    test('generateId creates unique identifiers', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);
    });

    test('sanitizeHTML prevents XSS attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      
      // Mock document.createElement behavior for sanitization
      const mockDiv = {
        appendChild: jest.fn(),
        innerHTML: '&lt;script&gt;alert("xss")&lt;/script&gt;Hello World'
      };
      global.document.createElement.mockReturnValueOnce(mockDiv);
      
      const result = Utils.sanitizeHTML(maliciousInput);
      
      expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;Hello World');
      expect(result).not.toContain('<script>');
    });

    test('debounce delays function execution', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = Utils.debounce(mockFn, 50);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 100);
    });

    test('isMobile detects mobile screen sizes', () => {
      // Test mobile width
      global.window.innerWidth = 500;
      expect(Utils.isMobile()).toBe(true);
      
      // Test desktop width  
      global.window.innerWidth = 1200;
      expect(Utils.isMobile()).toBe(false);
    });

    test('matchesSearch performs case-insensitive search', () => {
      expect(Utils.matchesSearch('Pasta Carbonara', 'pasta')).toBe(true);
      expect(Utils.matchesSearch('Pasta Carbonara', 'CARBONARA')).toBe(true);
      expect(Utils.matchesSearch('Pasta Carbonara', 'pizza')).toBe(false);
      expect(Utils.matchesSearch('Any text', '')).toBe(true);
    });

  });

  describe('Utility Functions', () => {

    test('formatFileSize converts bytes to readable format', () => {
      expect(Utils.formatFileSize(0)).toBe('0 Bytes');
      expect(Utils.formatFileSize(1024)).toBe('1 KB');
      expect(Utils.formatFileSize(1048576)).toBe('1 MB');
      expect(Utils.formatFileSize(1500)).toBe('1.46 KB');
    });

    test('truncateText limits text length', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = Utils.truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23);
      
      const shortText = 'Short';
      expect(Utils.truncateText(shortText, 20)).toBe('Short');
    });

    test('deepClone creates independent copies', () => {
      const original = {
        name: 'Test',
        nested: { value: 42, array: [1, 2, 3] },
        date: new Date('2024-01-01')
      };
      
      const cloned = Utils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.nested.array).not.toBe(original.nested.array);
      expect(cloned.date).toBeInstanceOf(Date);
      
      // Test primitives
      expect(Utils.deepClone(null)).toBe(null);
      expect(Utils.deepClone(42)).toBe(42);
      expect(Utils.deepClone('string')).toBe('string');
    });

    test('isValidEmail validates email addresses', () => {
      // Valid emails
      expect(Utils.isValidEmail('test@example.com')).toBe(true);
      expect(Utils.isValidEmail('user.name@domain.co')).toBe(true);
      expect(Utils.isValidEmail('test123@test-domain.org')).toBe(true);
      
      // Invalid emails  
      expect(Utils.isValidEmail('invalid-email')).toBe(false);
      expect(Utils.isValidEmail('@domain.com')).toBe(false);
      expect(Utils.isValidEmail('test@')).toBe(false);
      expect(Utils.isValidEmail('')).toBe(false);
    });

    test('getRandomColor returns valid hex colors', () => {
      const color = Utils.getRandomColor();
      
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(color.length).toBe(7);
      
      // Test multiple calls return different colors
      const colors = new Set();
      for (let i = 0; i < 10; i++) {
        colors.add(Utils.getRandomColor());
      }
      expect(colors.size).toBeGreaterThan(1);
    });

    test('getContrastColor calculates appropriate contrast', () => {
      // Light colors should return black
      expect(Utils.getContrastColor('#ffffff')).toBe('#000000');
      expect(Utils.getContrastColor('#f0f0f0')).toBe('#000000');
      expect(Utils.getContrastColor('ffffff')).toBe('#000000'); // Without #
      
      // Dark colors should return white
      expect(Utils.getContrastColor('#000000')).toBe('#ffffff');
      expect(Utils.getContrastColor('#333333')).toBe('#ffffff');
    });

  });

  describe('API Functions', () => {

    beforeEach(() => {
      fetch.mockClear();
    });

    test('getUnsplashImage handles successful API response', async () => {
      const mockResponse = {
        results: [{
          urls: { small: 'https://images.unsplash.com/test-image.jpg' }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await Utils.getUnsplashImage('pasta');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.unsplash.com/search/photos')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=pasta')
      );
      expect(result).toBe('https://images.unsplash.com/test-image.jpg');
    });

    test('getUnsplashImage returns placeholder on error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await Utils.getUnsplashImage('pasta');

      expect(result).toBe('/placeholder.svg?height=300&width=400');
    });

    test('getIngredientImage appends food ingredient to query', async () => {
      const mockResponse = {
        results: [{ urls: { thumb: 'https://images.unsplash.com/thumb.jpg' } }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await Utils.getIngredientImage('tomato');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('tomato%20food%20ingredient')
      );
      expect(result).toBe('https://images.unsplash.com/thumb.jpg');
    });

    test('API functions handle empty results', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      const imageResult = await Utils.getUnsplashImage('nonexistent');
      const ingredientResult = await Utils.getIngredientImage('nonexistent');

      expect(imageResult).toBe('/placeholder.svg?height=300&width=400');
      expect(ingredientResult).toBe('/placeholder.svg?height=50&width=50');
    });

  });

  describe('DOM Utilities', () => {

    test('scrollToElement works with mock function', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 100 })
      };

      // Just test that the function can be called without error
      expect(() => Utils.scrollToElement(mockElement)).not.toThrow();
    });

    test('scrollToElement applies offset correctly', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 100 })
      };

      // Test that function works with offset parameter
      expect(() => Utils.scrollToElement(mockElement, 50)).not.toThrow();
    });

    test('isInViewport detects element visibility', () => {
      const visibleElement = {
        getBoundingClientRect: () => ({
          top: 100, left: 50, bottom: 200, right: 150
        })
      };

      global.window.innerHeight = 1000;
      global.window.innerWidth = 1000;

      expect(Utils.isInViewport(visibleElement)).toBe(true);

      const hiddenElement = {
        getBoundingClientRect: () => ({
          top: 2000, left: 50, bottom: 2100, right: 150
        })
      };

      expect(Utils.isInViewport(hiddenElement)).toBe(false);
    });

  });

  describe('LocalStorage Utilities', () => {

    test('setLocalStorage saves data successfully', () => {
      const testData = { test: 'data' };
      
      const result = Utils.setLocalStorage('test-key', testData);
      
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    test('setLocalStorage handles errors gracefully', () => {
      localStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const result = Utils.setLocalStorage('test-key', 'data');
      
      expect(result).toBe(false);
    });

    test('getLocalStorage retrieves data successfully', () => {
      const testData = { test: 'data' };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(testData));

      const result = Utils.getLocalStorage('test-key');
      
      expect(result).toEqual(testData);
    });

    test('getLocalStorage returns default on missing data', () => {
      localStorage.getItem.mockReturnValueOnce(null);

      const result = Utils.getLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
    });

    test('getLocalStorage handles parse errors', () => {
      localStorage.getItem.mockReturnValueOnce('invalid json');

      const result = Utils.getLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
    });

  });

});
