const MongoHelper = require('../infra/helpers/mongo-helper')
const app = require('./config/app')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(3000, () => console.log('Server running at http://localhost:3000'))
  })
  .catch(console.error)
