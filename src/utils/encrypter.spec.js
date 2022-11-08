const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    return bcrypt.compare(value, hash)
  }
}

describe('Encrypter', () => {
  test('Should return if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return if bcrypt returns false', async () => {
    bcrypt.isValid = false

    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })
})
