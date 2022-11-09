const bcrypt = require('bcrypt')
const Encrypt = require('./encrypt')
const {
  MissingParamError
} = require('./erros')

const makeSut = () => {
  const encrypt = new Encrypt()

  return {
    sut: encrypt
  }
}

describe('Encrypt', () => {
  test('Should return if bcrypt returns true', async () => {
    const {
      sut
    } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return if bcrypt returns false', async () => {
    bcrypt.isValid = false

    const {
      sut
    } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const {
      sut
    } = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })

  test('Should throw if no params are provided', async () => {
    const {
      sut
    } = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
