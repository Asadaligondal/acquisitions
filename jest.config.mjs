const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',

  transform: {},

  moduleNameMapper: {
    '^#src/(.*)$': '<rootDir>/src/$1',
  },

  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.test.js'],

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  verbose: true,
};

export default config;
