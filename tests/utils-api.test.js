// Pruebas para funciones asíncronas y API de Utils
const fs = require('fs');
const path = require('path');

// Leer y ejecutar el archivo Utils para tener acceso a la clase
const utilsPath = path.join(__dirname, '../js/utils.js');
const utilsCode = fs.readFileSync(utilsPath, 'utf8');
eval(utilsCode);

describe('Utils API Functions', () => {

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getUnsplashImage', () => {
    test('should fetch image from Unsplash API successfully', async () => {
      const mockResponse = {
        results: [{
          urls: {
            small: 'https://images.unsplash.com/test-image.jpg'
          }
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
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('client_id=test-api-key')
      );
      expect(result).toBe('https://images.unsplash.com/test-image.jpg');
    });

    test('should return placeholder when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await Utils.getUnsplashImage('pasta');

      expect(result).toBe('/placeholder.svg?height=300&width=400');
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching Unsplash image:',
        expect.any(Error)
      );
    });

    test('should return placeholder when no results', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      const result = await Utils.getUnsplashImage('nonexistent');

      expect(result).toBe('/placeholder.svg?height=300&width=400');
    });

    test('should properly encode search query', async () => {
      const mockResponse = {
        results: [{
          urls: { small: 'test-url' }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await Utils.getUnsplashImage('spicy food & drinks');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('spicy%20food%20%26%20drinks')
      );
    });
  });

  describe('getIngredientImage', () => {
    test('should fetch ingredient image successfully', async () => {
      const mockResponse = {
        results: [{
          urls: {
            thumb: 'https://images.unsplash.com/ingredient-thumb.jpg'
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await Utils.getIngredientImage('tomato');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=tomato%20food%20ingredient')
      );
      expect(result).toBe('https://images.unsplash.com/ingredient-thumb.jpg');
    });

    test('should return placeholder when ingredient image not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] })
      });

      const result = await Utils.getIngredientImage('rare-ingredient');

      expect(result).toBe('/placeholder.svg?height=50&width=50');
    });

    test('should handle fetch errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await Utils.getIngredientImage('tomato');

      expect(result).toBe('/placeholder.svg?height=50&width=50');
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching ingredient image:',
        expect.any(Error)
      );
    });

    test('should append "food ingredient" to search query', async () => {
      const mockResponse = {
        results: [{ urls: { thumb: 'test-url' } }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await Utils.getIngredientImage('cheese');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('cheese%20food%20ingredient')
      );
    });
  });

  describe('Color and Contrast Functions', () => {
    test('getRandomColor should return valid hex color', () => {
      const color = Utils.getRandomColor();
      
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(color.length).toBe(7);
    });

    test('getRandomColor should return different colors on multiple calls', () => {
      const colors = new Set();
      
      for (let i = 0; i < 10; i++) {
        colors.add(Utils.getRandomColor());
      }
      
      // Should get at least a few different colors in 10 tries
      expect(colors.size).toBeGreaterThan(1);
    });

    test('getContrastColor should return black for light colors', () => {
      const lightColors = ['#ffffff', '#f0f0f0', '#ffff00'];
      
      lightColors.forEach(color => {
        const contrast = Utils.getContrastColor(color);
        expect(contrast).toBe('#000000');
      });
    });

    test('getContrastColor should return white for dark colors', () => {
      const darkColors = ['#000000', '#333333', '#800080'];
      
      darkColors.forEach(color => {
        const contrast = Utils.getContrastColor(color);
        expect(contrast).toBe('#ffffff');
      });
    });

    test('getContrastColor should handle colors without # prefix', () => {
      const result = Utils.getContrastColor('ffffff');
      expect(result).toBe('#000000');
    });
  });

  describe('DOM Utility Functions', () => {
    let mockElement;

    beforeEach(() => {
      mockElement = {
        getBoundingClientRect: jest.fn(() => ({
          top: 100,
          left: 50,
          bottom: 200,
          right: 150,
          width: 100,
          height: 100
        }))
      };

      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
      global.window.scrollTo = jest.fn();
    });

    test('scrollToElement should scroll to element position', () => {
      Utils.scrollToElement(mockElement);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 100, // element top position
        behavior: 'smooth'
      });
    });

    test('scrollToElement should account for offset', () => {
      Utils.scrollToElement(mockElement, 50);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 50, // 100 - 50 offset
        behavior: 'smooth'
      });
    });

    test('isInViewport should return true for visible element', () => {
      Object.defineProperty(window, 'innerHeight', { value: 1000 });
      Object.defineProperty(window, 'innerWidth', { value: 1000 });

      const result = Utils.isInViewport(mockElement);
      expect(result).toBe(true);
    });

    test('isInViewport should return false for element outside viewport', () => {
      Object.defineProperty(window, 'innerHeight', { value: 50 });
      Object.defineProperty(window, 'innerWidth', { value: 50 });

      const result = Utils.isInViewport(mockElement);
      expect(result).toBe(false);
    });
  });

  describe('localStorage Utility Functions', () => {
    test('setLocalStorage should save data successfully', () => {
      const testData = { test: 'data' };
      
      const result = Utils.setLocalStorage('test-key', testData);
      
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    test('setLocalStorage should handle errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const result = Utils.setLocalStorage('test-key', 'data');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error saving to localStorage:',
        expect.any(Error)
      );
    });

    test('getLocalStorage should retrieve data successfully', () => {
      const testData = { test: 'data' };
      localStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = Utils.getLocalStorage('test-key');
      
      expect(result).toEqual(testData);
    });

    test('getLocalStorage should return default value when no data', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = Utils.getLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
    });

    test('getLocalStorage should handle JSON parse errors', () => {
      localStorage.getItem.mockReturnValue('invalid json');

      const result = Utils.getLocalStorage('test-key', 'default');
      
      expect(result).toBe('default');
      expect(console.error).toHaveBeenCalledWith(
        'Error reading from localStorage:',
        expect.any(Error)
      );
    });
  });

});
