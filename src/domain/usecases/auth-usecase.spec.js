const { MissingParamsError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashPassword) {
      this.password = password
      this.hashPassword = hashPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()

  encrypterSpy.isValid = true

  return {
    encrypterSpy
  }
}

const makeLoadUserByEmailSpy = () => {
  class LoadUserByEmailSpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailSpy = new LoadUserByEmailSpy()

  loadUserByEmailSpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return {
    loadUserByEmailSpy
  }
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()

  tokenGeneratorSpy.accessToken = 'any_access_token'

  return {
    tokenGeneratorSpy
  }
}

const makeSut = () => {
  const { encrypterSpy } = makeEncrypter()
  const { loadUserByEmailSpy } = makeLoadUserByEmailSpy()
  const { tokenGeneratorSpy } = makeTokenGeneratorSpy()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailSpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    loadUserByEmailSpy,
    encrypterSpy,
    tokenGeneratorSpy
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

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailSpy } = makeSut()
    loadUserByEmailSpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'valid_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailSpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashPassword).toBe(loadUserByEmailSpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailSpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailSpy.user.id)
  })

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailSpy()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: null, encrypter: null, tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid, encrypter: invalid, tokenGenerator: invalid }),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: invalid })
    )

    suts.forEach(sut => {
      const promise = sut.auth('valid@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    })
  })
})
