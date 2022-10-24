const MissingParamsError = require('./missing-params-error')
const UnauthorizedError = require('./unathorized-error')

class HttpResponse {
  static ok () {
    return {
      statusCode: 200
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
      body: 'Internal Server Error'
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
