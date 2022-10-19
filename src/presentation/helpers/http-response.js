const MissingParamsError = require('./missing-params-error')

class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamsError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

module.exports = HttpResponse
