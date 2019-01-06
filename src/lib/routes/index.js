const express = require('express')
const middleware = require('../middleware')
const router = express.Router()

router.use('/user', require('./user-routes'))

router.get('/', middleware.authenticated, (req, res) => {
  res.render('home')
})

module.exports = router
