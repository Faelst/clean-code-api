const MongoHelper = require('../helpers/mongo-helper')
const {
  MissingParamError
} = require('../../utils/erros')
const UpdateAccessTokenRepository = require('./update-access-token')

let db

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

  test('Should throw if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()

    const promise = sut.update()

    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update('any_id')).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
