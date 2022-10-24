const MissingParamsError = require('./missing-params-error')
const UnauthorizedError = require('./unathorized-error')
const ServerError = require('./server-error')

class HttpResponse {
  static ok (credentials) {
    return {
      statusCode: 200,
      body: credentials
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamsError(paramName)
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
