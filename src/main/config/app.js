const express = require('express')
const app = express()
const setupApp = require('../setup/config')

setupApp(app)

module.exports = app
