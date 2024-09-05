module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@adapters/(.*)$': '<rootDir>/adapters/$1',
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@frameworks/(.*)$': '<rootDir>/frameworks/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};
