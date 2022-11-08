const validator = require('validator')
const { MissingParamsError } = require('./erros')

class EmailValidator {
  isValid (email) {
    if (!email) {
      throw new MissingParamsError('email')
    }

    return validator.isEmail(email)
  }
}

module.exports = EmailValidator
