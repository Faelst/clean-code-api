const { MissingParamsError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailSpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailSpy = new LoadUserByEmailSpy()

  loadUserByEmailSpy.user = {}

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
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('valid@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailSpy } = makeSut()
    loadUserByEmailSpy.user = null
    const acessToken = await sut.auth('invalid_email@mail.com', 'valid_password')
    expect(acessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth('valid_email@mail.com', 'incalid_password')
    expect(acessToken).toBeNull()
  })
})
