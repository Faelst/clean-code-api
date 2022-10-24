const HttpResponse = require('../helpers/http-response')
const MissingParamsError = require('../helpers/missing-params-error')

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamsError('email'))
      }

      // if (!/email/.test(email)) {
      //   return HttpResponse.badRequest('email')
      // }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamsError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (err) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = LoginRouter
