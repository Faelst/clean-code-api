const {
  MongoClient
} = require('mongodb')

module.exports = {
  async connect (uri, dbName) {
    this.uri = uri
    this.dbName = dbName

    this.connection = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.connection.db(dbName)

    return {
      connection: this.connection,
      db: this.db
    }
  },

  async disconnect () {
    await this.connection.close()
  }
}
