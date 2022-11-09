class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({
      email
    }, {
      projection: {
        _id: 1,
        password: 1
      }
    })
    return user
  }
}

module.exports = LoadUserByEmailRepository
