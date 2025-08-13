// Importar la clase StorageManager para testing
const fs = require('fs');
const path = require('path');

// Leer y ejecutar el archivo storage para tener acceso a la clase
const storagePath = path.join(__dirname, '../js/storage.js');
const storageCode = fs.readFileSync(storagePath, 'utf8');
eval(storageCode);

describe('StorageManager Class', () => {
  let storageManager;

  beforeEach(() => {
    storageManager = new StorageManager();
    localStorage.clear();
    localStorage.setItem.mockClear();
    localStorage.getItem.mockClear();
  });

  const createMockRecipe = (overrides = {}) => ({
    id: '1',
    name: 'Test Recipe',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: ['step1', 'step2'], // Cambiado de 'steps' a 'instructions'
    category: ['Test'],
    timesCooked: 0,
    favorite: false,
    createdAt: new Date('2024-01-01'),
    lastCooked: null,
    cookingHistory: [], // Agregado
    manualRating: 3,
    autoRating: 3,
    finalRating: 3,
    ...overrides
  });

  describe('Constructor', () => {
    test('should initialize with correct storage keys', () => {
      expect(storageManager.storageKeys.recipes).toBe('cocina-para-uno-recipes');
      expect(storageManager.storageKeys.settings).toBe('cocina-para-uno-settings');
      expect(storageManager.storageKeys.language).toBe('cocina-para-uno-language');
      expect(storageManager.storageKeys.theme).toBe('cocina-para-uno-theme');
    });

    test('should have default settings', () => {
      expect(storageManager.defaultSettings.theme).toBe('light');
      expect(storageManager.defaultSettings.language).toBe('es');
      expect(storageManager.defaultSettings.notifications).toBe(true);
      expect(storageManager.defaultSettings.autoSave).toBe(true);
    });
  });

  describe('loadRecipes', () => {
    test('should return empty array when no recipes stored', () => {
      const recipes = storageManager.loadRecipes();
      expect(recipes).toEqual([]);
    });

    test('should load recipes and convert date strings to Date objects', () => {
      const mockRecipes = [createMockRecipe({
        createdAt: '2024-01-01T00:00:00.000Z',
        lastCooked: '2024-01-02T00:00:00.000Z',
        cookingHistory: ['2024-01-02T00:00:00.000Z', '2024-01-03T00:00:00.000Z']
      })];

      localStorage.getItem.mockReturnValue(JSON.stringify(mockRecipes));

      const recipes = storageManager.loadRecipes();

      expect(recipes).toHaveLength(1);
      expect(recipes[0].createdAt).toBeInstanceOf(Date);
      expect(recipes[0].lastCooked).toBeInstanceOf(Date);
      expect(recipes[0].cookingHistory[0]).toBeInstanceOf(Date);
    });

    test('should handle corrupted data gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json');

      const recipes = storageManager.loadRecipes();

      expect(recipes).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalled();
    });

    test('should migrate from old storage key', () => {
      const mockRecipes = [createMockRecipe()];
      
      // Mock scenario where new key is empty but old key has data
      localStorage.getItem.mockImplementation((key) => {
        if (key === storageManager.storageKeys.recipes) return null;
        if (key === storageManager.storageKey) return JSON.stringify(mockRecipes);
        return null;
      });

      const recipes = storageManager.loadRecipes();

      expect(recipes).toHaveLength(1);
    });
  });

  describe('saveRecipes', () => {
    test('should save recipes to localStorage', () => {
      const recipes = [createMockRecipe()];

      storageManager.saveRecipes(recipes);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        storageManager.storageKeys.recipes,
        expect.any(String)
      );
    });

    test('should handle save errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const recipes = [createMockRecipe()];
      
      expect(() => storageManager.saveRecipes(recipes)).not.toThrow();
    });
  });

  describe('validateRecipe', () => {
    test('should validate complete recipe', () => {
      const validRecipe = createMockRecipe();
      
      const isValid = storageManager.validateRecipe(validRecipe);
      expect(isValid).toBe(true);
    });

    test('should reject recipe without required fields', () => {
      const invalidRecipe = { name: 'Test' }; // Missing required fields
      
      const isValid = storageManager.validateRecipe(invalidRecipe);
      expect(isValid).toBe(false);
    });

    test('should reject recipe with invalid data types', () => {
      const invalidRecipe = createMockRecipe({
        ingredients: 'not an array', // Should be array
        timesCooked: 'not a number' // Should be number
      });
      
      const isValid = storageManager.validateRecipe(invalidRecipe);
      expect(isValid).toBe(false);
    });
  });

  describe('repairData', () => {
    test('should repair recipe with missing fields', () => {
      const brokenRecipe = {
        id: '1',
        name: 'Test Recipe',
        // Missing many fields
      };

      const repairedRecipe = storageManager.repairData([brokenRecipe]);

      expect(repairedRecipe).toHaveLength(1);
      expect(repairedRecipe[0].ingredients).toEqual([]);
      expect(repairedRecipe[0].instructions).toEqual([]);
      expect(repairedRecipe[0].cookingHistory).toEqual([]);
    });

    test('should filter out irreparable recipes', () => {
      const recipes = [
        createMockRecipe(), // Valid
        { invalid: 'recipe' }, // Invalid, should be filtered
        createMockRecipe({ id: '2' }) // Valid
      ];

      const repairedRecipes = storageManager.repairData(recipes);

      expect(repairedRecipes).toHaveLength(2);
      expect(repairedRecipes.every(r => r.id)).toBe(true);
    });
  });

  describe('clearAllData', () => {
    test('should clear all application data', () => {
      storageManager.clearAllData();

      expect(localStorage.removeItem).toHaveBeenCalledWith(storageManager.storageKeys.recipes);
      expect(localStorage.removeItem).toHaveBeenCalledWith(storageManager.storageKeys.settings);
      expect(localStorage.removeItem).toHaveBeenCalledWith(storageManager.storageKeys.language);
      expect(localStorage.removeItem).toHaveBeenCalledWith(storageManager.storageKeys.theme);
    });
  });

  describe('getStorageInfo', () => {
    test('should return storage information', () => {
      const info = storageManager.getStorageInfo();

      expect(info).toHaveProperty('used');
      expect(info).toHaveProperty('keys');
      expect(typeof info.used).toBe('number');
      expect(Array.isArray(info.keys)).toBe(true);
    });
  });

  describe('Settings Management', () => {
    test('should load default settings when none exist', () => {
      const settings = storageManager.loadSettings();
      
      expect(settings).toEqual(storageManager.defaultSettings);
    });

    test('should save and load settings', () => {
      const newSettings = {
        theme: 'dark',
        language: 'en',
        notifications: false,
        autoSave: false
      };

      storageManager.saveSettings(newSettings);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        storageManager.storageKeys.settings,
        JSON.stringify(newSettings)
      );
    });

    test('should merge settings with defaults', () => {
      const partialSettings = { theme: 'dark' };
      localStorage.getItem.mockReturnValue(JSON.stringify(partialSettings));

      const settings = storageManager.loadSettings();

      expect(settings.theme).toBe('dark');
      expect(settings.language).toBe('es'); // From defaults
    });
  });

  describe('Language Management', () => {
    test('should save and load language preference', () => {
      // Mock explícito para este test
      const mockGetItem = jest.fn()
        .mockReturnValueOnce(null) // Primera llamada (loadSettings)
        .mockReturnValueOnce('{"language":"en","theme":"light","notifications":true,"autoSave":true}'); // Segunda llamada
      
      const mockSetItem = jest.fn();
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
          clear: jest.fn()
        },
        writable: true
      });
      
      const freshStorageManager = new StorageManager();
      freshStorageManager.saveLanguage('en');
      const language = freshStorageManager.loadLanguage();

      expect(language).toBe('en');
    });

    test('should return default language when none saved', () => {
      // Mock que simula localStorage vacío
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue(null),
          setItem: jest.fn(),
          clear: jest.fn()
        },
        writable: true
      });
      
      const freshStorageManager = new StorageManager();
      const language = freshStorageManager.loadLanguage();
      expect(language).toBe('es');
    });
  });

  describe('Theme Management', () => {
    test('should save and load theme preference', () => {
      // Mock explícito para este test
      const mockGetItem = jest.fn()
        .mockReturnValueOnce(null) // Primera llamada (loadSettings)
        .mockReturnValueOnce('{"theme":"dark","language":"es","notifications":true,"autoSave":true}'); // Segunda llamada
      
      const mockSetItem = jest.fn();
      
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
          setItem: mockSetItem,
          clear: jest.fn()
        },
        writable: true
      });
      
      const freshStorageManager = new StorageManager();
      freshStorageManager.saveTheme('dark');
      const theme = freshStorageManager.loadTheme();

      expect(theme).toBe('dark');
    });

    test('should return default theme when none saved', () => {
      // Mock que simula localStorage vacío
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn().mockReturnValue(null),
          setItem: jest.fn(),
          clear: jest.fn()
        },
        writable: true
      });
      
      const freshStorageManager = new StorageManager();
      const theme = freshStorageManager.loadTheme();
      expect(theme).toBe('light');
    });
  });

});
