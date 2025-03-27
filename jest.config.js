module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  // Two test configurations - one for unit tests, one for integration tests
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/backend/tests/unit/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/src/backend/tests/setup/unit-setup.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/backend/tests/integration/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/src/backend/tests/setup/integration-setup.js'],
    }
  ],
  // Global settings
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/backend/**/*.js',
    '!src/backend/tests/**',
    '!**/node_modules/**'
  ],
  testTimeout: 30000, // 30 seconds
};