const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return jwt.sign(id, 'secret')
  }
}

const makeSut = () => {
  const sut = new TokenGenerator()

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
})
