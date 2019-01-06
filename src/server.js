const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const morgan = require('morgan')
const debug = require('debug')('app:server')
const path = require('path')
const middleware = require('./lib/middleware')

const app = express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
})

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(flash())
app.use(morgan('dev'))
app.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

require('./lib/config/auth')(app)

app.use(middleware.default({ title: process.env.TITLE }))
app.use(middleware.view('home'))

app.use(require('./lib/routes'))

app.listen(PORT, () => {
  debug(`Server is listening on port ${PORT}`)
})
