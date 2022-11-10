const express = require('express')

module.exports = (app) => {
  app.use(express.json())
  app.use((_, res, next) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
  app.disable('x-powered-by')
}
