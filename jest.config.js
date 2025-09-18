module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts', // ← Вот это исправление!
    '^@api/(.*)$': '<rootDir>/src/utils/$1',
    '^@slices/constructor/(.*)$':
      '<rootDir>/src/services/slices/constructor/$1',
    '^@slices/feeds/(.*)$': '<rootDir>/src/services/slices/feeds/$1',
    '^@slices/ingredients/(.*)$':
      '<rootDir>/src/services/slices/ingredients/$1',
    '^@slices/newOrder/(.*)$': '<rootDir>/src/services/slices/newOrder/$1',
    '^@slices/user/(.*)$': '<rootDir>/src/services/slices/user/$1',
    '^@slices/userOrders/(.*)$': '<rootDir>/src/services/slices/userOrders/$1',
    '^@utils-types/(.*)$': '<rootDir>/src/utils/types/$1'
  }
};
