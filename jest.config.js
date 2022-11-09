module.exports = {
  coverageDirectory: 'coverage',
  clearMocks: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/src/**/*.js'],
  preset: '@shelf/jest-mongodb'
}
