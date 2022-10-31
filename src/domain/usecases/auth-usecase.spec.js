const { MissingParamsError } = require('../../utils/erros')
class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamsError('email')
    }

    if (!password) {
      throw new MissingParamsError('password')
    }

    await this.loadUserByEmailRepository.load(email)
  }
}

describe('Auth Usecase', () => {
  test('Should retrun null if no email provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth(null, 'any_password')
    expect(promise).rejects.toThrow(new MissingParamsError('email'))
  })

  test('Should retrun null if no password provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamsError('password'))
  })

  test('Should call LoadUserByEmail with correct email', async () => {
    const expectEmail = 'valid@mail.com'

    class LoadUserByEmailSpy {
      async load (email) {
        this.email = email
      }
    }

    const loadUserByEmailSpy = new LoadUserByEmailSpy()
    const sut = new AuthUseCase(loadUserByEmailSpy)
    sut.auth(expectEmail, 'any password')
    expect(loadUserByEmailSpy.email).toEqual(expectEmail)
  })
})
