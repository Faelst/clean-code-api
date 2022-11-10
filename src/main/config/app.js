const express = require('express')
const app = express()
const setupRoutes = require('./routes')
const setupApp = require('../setup/config')

setupApp(app)
setupRoutes(app)

module.exports = app
