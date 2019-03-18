module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['src'],
  moduleNameMapper: {
    '^ugrade/(.*)$': '<rootDir>/src/$1',
  },
}
