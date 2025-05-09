
// Configure testing library
import '@testing-library/jest-dom';

// Add the missing type declarations
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
    }
  }
}

// Mock IntersectionObserver
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

global.IntersectionObserver = MockIntersectionObserver as any;

// Mock LocalStorage
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

Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });

// Mock matchMedia
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

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
