
/**
 * Jest configuration for React Testing Library
 * This file configures Jest to work with TypeScript and React components
 */
module.exports = {
  // Use ts-jest to transform TypeScript files
  preset: 'ts-jest',
  // Use jsdom to simulate a browser environment for tests
  testEnvironment: 'jsdom',
  // Setup file that includes global configurations and mock implementations
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Map module aliases to their actual paths
  moduleNameMapper: {
    // Map @ imports to the src directory
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports in tests
    '\\.css$': 'identity-obj-proxy',
  },
  // Configuration for the TypeScript transformer
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // Improves performance by transforming files in isolation
      isolatedModules: true,
    }],
  },
  // Pattern to find test files
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(test).ts?(x)'],
  // Files to collect coverage information from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
    '!src/main.tsx',
    '!src/App.tsx',
  ],
  // Coverage thresholds - minimum coverage percentages required
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // Paths to ignore when running tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  // Global configuration for ts-jest
  globals: {
    'ts-jest': {
      // Improves performance by avoiding type checking during tests
      isolatedModules: true
    }
  }
};
