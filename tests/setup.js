// Jest setup file

// Mock environment variables
process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY = 'test-api-key';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: jest.fn((i) => Object.keys(store)[i] || null)
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

global.localStorage = localStorageMock;

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock document
Object.defineProperty(document, 'documentElement', {
  value: {
    clientHeight: 768,
    clientWidth: 1024
  }
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock DOM methods
global.document.createElement = jest.fn(() => ({
  appendChild: jest.fn(),
  innerHTML: '',
  textContent: '',
  getAttribute: jest.fn(),
  setAttribute: jest.fn(),
  getBoundingClientRect: jest.fn(() => ({
    top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0
  }))
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  fetch.mockClear();
});
