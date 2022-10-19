class UnauthorizedError extends Error {
  constructor (paramName) {
    super('Unathorized Error')
    this.name = 'UnathorizedError'
  }
}

module.exports = UnauthorizedError
