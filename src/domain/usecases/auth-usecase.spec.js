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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncrypterSpy()
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

const makeLoadUserByEmailSpyWithError = () => {
  class LoadUserByEmailSpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailSpy()
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

const makeTokenGeneratorSpyWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeUpdateAccessTokenRepositorySpy = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (userId, token) {
      this.userId = userId
      this.token = token
    }
  }

  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  return {
    updateAccessTokenRepositorySpy
  }
}

const makeUpdateAccessTokenRepositorySpyWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update () {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepositorySpy()
}

const makeSut = () => {
  const { encrypterSpy } = makeEncrypter()
  const { loadUserByEmailSpy } = makeLoadUserByEmailSpy()
  const { tokenGeneratorSpy } = makeTokenGeneratorSpy()
  const { updateAccessTokenRepositorySpy } = makeUpdateAccessTokenRepositorySpy()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailSpy,
    encrypt: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailSpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
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

  test('Should call Encrypt with correct values', async () => {
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

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, tokenGeneratorSpy, loadUserByEmailSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailSpy.user.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailSpy()
    const encrypt = makeEncrypter()
    const tokenGenerator = makeTokenGeneratorSpy()

    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: null, encrypt: null, tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid, encrypt: invalid, tokenGenerator: invalid }),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator, updateAccessTokenRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator, updateAccessTokenRepository: invalid })
    )

    suts.forEach(sut => {
      const promise = sut.auth('valid@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    })
  })

  test('Should throw if any dependencies throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailSpy()
    const encrypt = makeEncrypter()
    const tokenGenerator = makeTokenGeneratorSpy()

    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailSpyWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt: makeEncrypterWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator: makeTokenGeneratorSpyWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypt, tokenGenerator, updateAccessTokenRepository: makeUpdateAccessTokenRepositorySpyWithError() })
    )

    suts.forEach(sut => {
      const promise = sut.auth('any_email@mail.com', 'any_password')
      expect(promise).rejects.toThrow()
    })
  })
})
