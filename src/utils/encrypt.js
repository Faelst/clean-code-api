const bcrypt = require('bcrypt')
const {
  MissingParamError
} = require('./erros')

class Encrypt {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!hash) {
      throw new MissingParamError('hash')
    }

    return bcrypt.compare(value, hash)
  }
}

module.exports = Encrypt
