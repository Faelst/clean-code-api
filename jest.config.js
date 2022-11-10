module.exports = {
  coverageDirectory: 'coverage',
  clearMocks: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**'],
  preset: '@shelf/jest-mongodb'
}
