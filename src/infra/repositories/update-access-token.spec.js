const MongoHelper = require('./helpers/mongo-helper')
const {
  MissingParamError
} = require('../../utils/erros')

let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    if (!userId) {
      throw new MissingParamError('userId')
    }

    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')

  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel
  }
}

describe('UpdateAccessTokenRepository', () => {
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

  test('Should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })

    await sut.update(fakeUser.insertedId, 'valid_token')

    const userInfo = await userModel.findOne({
      _id: fakeUser.insertedId
    })

    expect(userInfo.accessToken).toBe('valid_token')
  })
})
