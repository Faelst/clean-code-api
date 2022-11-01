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

    const user = await this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }

    return null
  }
}

module.exports = AuthUseCase
