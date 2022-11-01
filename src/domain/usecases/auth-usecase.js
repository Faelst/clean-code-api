const { MissingParamsError, InvalidParamError } = require('../../utils/erros')

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

    if (!this.loadUserByEmailRepository) {
      throw new MissingParamsError('loadUserByEmailRepository')
    }

    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository')
    }

    const user = await this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }
  }
}

module.exports = AuthUseCase
