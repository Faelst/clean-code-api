const { UnauthorizedError } = require('../errors')
const { MissingParamsError, InvalidParamError } = require('../../utils/erros')
const LoginRouter = require('./login-router')

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidator()
  const authUseCase = makeAuthUseCase()

  const sut = new LoginRouter(authUseCase, emailValidatorSpy)

  return {
    sut,
    authUseCase,
    emailValidatorSpy
  }
}

const makeAuthUseCase = () => {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCase = new AuthUseCase()
  authUseCase.accessToken = 'valid_token'

  return authUseCase
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      return this.isEmailValid
    }
  }

  const emailValidator = new EmailValidatorSpy()

  emailValidator.isEmailValid = true

  return emailValidator
}

describe('Login Router', () => {
  test('Should return 200 if valid email and password', async () => {
    const { sut, authUseCase } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCase.accessToken)
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'any-pass'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    emailValidatorSpy.isEmailValid = false

    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'valid_email'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any-email@mail.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no body is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCase } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any-password'
      }
    }

    await sut.route(httpRequest)
    expect(authUseCase.email).toBe(httpRequest.body.email)
    expect(authUseCase.password).toBe(httpRequest.body.password)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCase } = makeSut()

    authUseCase.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid@mail.com',
        password: 'invalid-password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({})

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if no EmailValidator is provided', async () => {
    const authUseCase = makeAuthUseCase()
    const sut = new LoginRouter(authUseCase, {})

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if AuthUseCase throws', async () => {
    class AuthUseCase {
      auth () {
        throw new Error()
      }
    }
    const authUseCase = new AuthUseCase()
    authUseCase.accessToken = 'valid_token'

    const sut = new LoginRouter(authUseCase)

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
