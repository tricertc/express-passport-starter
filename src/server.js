const express = require('express')
const debug = require('debug')('app:server')
const morgan = require('morgan')
const path = require('path')
const middleware = require('./lib/middleware')

const app = express()
const PORT = process.env.PORT || 5000

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.use(morgan('dev'))

app.use(middleware.default({ title: process.env.TITLE }))
app.use(require('./lib/routes'))

app.listen(PORT, () => {
  debug(`Server is listening on port ${PORT}`)
})
