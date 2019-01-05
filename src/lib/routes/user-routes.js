const express = require('express')
const router = express.Router()

router.route('/login')
  .get((req, res) => res.view())

router.route('/register')
  .get((req, res) => res.view())

module.exports = router
