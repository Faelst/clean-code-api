const {
  MissingParamError
} = require('../../utils/erros')

class AuthUseCase {
  constructor ({
    loadUserByEmailRepository,
    encrypt,
    tokenGenerator,
    updateAccessTokenRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypt = encrypt
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)
    const isValid =
      user && (await this.encrypt.compare(password, user.password))

    if (!isValid) {
      return null
    }

    const token = await this.tokenGenerator.generate(user.id)
    await this.updateAccessTokenRepository.update(user.id, token)

    return token
  }
}

module.exports = AuthUseCase
