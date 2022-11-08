const bcrypt = require('bcrypt')
const { MissingParamsError } = require('./erros')

class Encrypt {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamsError('value')
    }

    if (!hash) {
      throw new MissingParamsError('hash')
    }

    return bcrypt.compare(value, hash)
  }
}

module.exports = Encrypt
