const bcrypt = require('bcrypt')

class Encrypt {
  async compare (value, hash) {
    return bcrypt.compare(value, hash)
  }
}

module.exports = Encrypt
