const bcrypt = require('bcrypt')

const makeSut = () => {
  class Encrypter {
    async compare (value, hash) {
      return bcrypt.compare(value, hash)
    }
  }

  const encrypter = new Encrypter()

  return {
    sut: encrypter
  }
}

describe('Encrypter', () => {
  test('Should return if bcrypt returns true', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return if bcrypt returns false', async () => {
    bcrypt.isValid = false

    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })
})
