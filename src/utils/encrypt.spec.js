const bcrypt = require('bcrypt')
const Encrypt = require('./encrypt')

const makeSut = () => {
  const encrypt = new Encrypt()

  return {
    sut: encrypt
  }
}

describe('Encrypt', () => {
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
