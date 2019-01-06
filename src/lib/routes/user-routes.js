const express = require('express')
const passport = require('passport')
const middleware = require('../middleware')

const router = express.Router()

router.route('/login')
  .all(middleware.anonymous)
  .get((req, res) => res.view())
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
  }))

router.route('/register')
  .all(middleware.anonymous)
  .get((req, res) => res.view())
  .post(passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/user/register',
    failureFlash: true
  }))

router.get('/logout', (req, res) => {
  req.logout && req.logout()
  res.redirect('/')
})

module.exports = router
