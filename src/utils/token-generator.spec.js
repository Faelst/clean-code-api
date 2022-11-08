const jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    return jwt.sign(id, this.secret)
  }
}

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
})
