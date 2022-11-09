const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongoHelper = require('./helpers/mongo-helper')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail', () => {
  beforeAll(async () => {
    const client = await MongoHelper.connect(process.env.MONGO_URL)
    db = client.db
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const {
      sut
    } = makeSut()
    const user = await sut.load('any_email@mail.com')
    expect(user).toBe(null)
  })

  test('Should return user if user is found', async () => {
    const {
      sut,
      userModel
    } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })
    const userInfo = await userModel.findOne({
      _id: fakeUser.insertedId
    })

    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: userInfo._id,
      password: userInfo.password
    })
  })
})
