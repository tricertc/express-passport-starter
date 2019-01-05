const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('home')
})

router.use('/user', require('./user-routes'))

module.exports = router
