class ServerError extends Error {
  constructor (paramName) {
    super('ServerError')
    this.name = 'ServerError'
  }
}

module.exports = ServerError
