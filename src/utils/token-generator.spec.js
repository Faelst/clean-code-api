const jwt = require('jsonwebtoken')
const { MissingParamsError } = require('./erros')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const sut = new TokenGenerator('secret')

  return {
    sut
  }
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    jwt.token = null
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })

  test('Should return a token if JWT returns token', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Should call JWT with correct values', async () => {
    const { sut } = makeSut()
    await sut.generate('correct_id')
    expect(jwt.id).toBe('correct_id')
    expect(jwt.secret).toBe('secret')
  })

  test('Should throw if no secret or id are provided', () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('correct_id')
    expect(promise).rejects.toThrow(new MissingParamsError('secret'))
  })

  test('Should throw if no id are provided', () => {
    const { sut } = makeSut()
    const promise = sut.generate('')
    expect(promise).rejects.toThrow(new MissingParamsError('id'))
  })
})
