module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@frameworks/(.*)$': '<rootDir>/frameworks/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
