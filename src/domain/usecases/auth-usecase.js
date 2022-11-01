const { MissingParamsError } = require('../../utils/erros')

class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypter) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamsError('email')
    }

    if (!password) {
      throw new MissingParamsError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)

    if (!isValid) {
      return null
    }
  }
}

module.exports = AuthUseCase
