const { MissingParamsError, InvalidParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailSpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailSpy = new LoadUserByEmailSpy()
  const sut = new AuthUseCase(loadUserByEmailSpy)

  return {
    sut, loadUserByEmailSpy
  }
}

describe('Auth Usecase', () => {
  test('Should retrun null if no email provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth(null, 'any_password')
    expect(promise).rejects.toThrow(new MissingParamsError('email'))
  })

  test('Should retrun null if no password provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamsError('password'))
  })

  test('Should call LoadUserByEmail with correct email', async () => {
    const expectEmail = 'valid@mail.com'
    const { sut, loadUserByEmailSpy } = makeSut()
    sut.auth(expectEmail, 'any password')
    expect(loadUserByEmailSpy.email).toEqual(expectEmail)
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('valid@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamsError('loadUserByEmailRepository'))
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('valid@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  test('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth('invalid_email@mail.com', 'invalid_password')
    expect(acessToken).toBeNull()
  })
})
