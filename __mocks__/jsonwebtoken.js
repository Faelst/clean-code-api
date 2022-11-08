module.exports = {
  token: 'valid_token',
  async sign (value, secret, options) {
    return this.token
  }
}
