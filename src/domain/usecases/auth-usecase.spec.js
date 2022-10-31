
class AuthUseCase {
  async auth (email, password) {
    if (!email || !password) {
      throw new Error()
    }
  }
}

describe('Auth Usecase', () => {
  test('Should retrun null if no email provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth(null, 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should retrun null if no password provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow()
  })
})
