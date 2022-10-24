const UnauthorizedError = require('./unathorized-error')
const ServerError = require('./server-error')

class HttpResponse {
  static ok (credentials) {
    return {
      statusCode: 200,
      body: credentials
    }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static acessDened () {
    return {
      statusCode: 403
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

module.exports = HttpResponse
