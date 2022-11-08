module.exports = {
  secret: '',
  id: 'correct_id',
  token: 'valid_token',
  async sign (id, secret, options) {
    this.id = id
    this.secret = secret
    return this.token
  }
}
