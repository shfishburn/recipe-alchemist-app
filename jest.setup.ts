
/**
 * Jest Setup File
 * 
 * This file configures the testing environment before tests are run.
 * It includes:
 * 1. Testing Library configurations for DOM testing
 * 2. Type declarations for custom matchers
 * 3. Mock implementations of browser APIs not available in the test environment
 */

// Import Testing Library DOM matchers
import '@testing-library/jest-dom';

/**
 * Type Declarations for Testing Library matchers
 * 
 * These declarations extend Jest's matcher types to include the custom
 * matchers provided by Testing Library, which are used to assert against
 * DOM elements. Without these declarations, TypeScript would show errors
 * when using matchers like toBeInTheDocument(), toBeDisabled(), etc.
 */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveStyle(css: Record<string, any>): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

/**
 * Mock IntersectionObserver
 * 
 * IntersectionObserver is not available in the JSDOM environment,
 * so we need to provide a mock implementation for tests that use it.
 */
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    this.elements = new Set();
  }
  
  private callback: IntersectionObserverCallback;
  private elements: Set<Element>;
  
  observe(element: Element) {
    this.elements.add(element);
    this.callback(
      [
        {
          isIntersecting: true,
          target: element,
          intersectionRatio: 1,
        } as IntersectionObserverEntry,
      ],
      this,
    );
    return this;
  }
  
  unobserve(element: Element) {
    this.elements.delete(element);
    return this;
  }
  
  disconnect() {
    this.elements.clear();
    return this;
  }
}

// Assign the mock to the global object
global.IntersectionObserver = MockIntersectionObserver as any;

/**
 * Mock LocalStorage
 * 
 * JSDOM doesn't include a localStorage implementation,
 * so we create a simple in-memory implementation for testing.
 */
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

// Assign the mock localStorage to the window object
Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });

/**
 * Mock matchMedia
 * 
 * The matchMedia API is used for responsive design testing,
 * but it's not available in JSDOM. This mock provides the
 * necessary methods with empty implementations.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * Mock requestAnimationFrame and cancelAnimationFrame
 * 
 * These browser APIs are used for animation timing,
 * but they're not available in JSDOM. We implement them
 * using setTimeout/clearTimeout for testing purposes.
 */
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
