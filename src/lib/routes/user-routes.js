const express = require('express')
const passport = require('passport')
const middleware = require('../middleware')
const User = require('../models/user-model')
const tokenHelper = require('../helpers/token-helper')

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
    successRedirect: '/user/welcome',
    failureRedirect: '/user/register',
    failureFlash: true
  }))

router.get('/welcome', (req, res) => {
  if (req.session.welcome) {
    delete req.session.welcome
    return res.view({ email: req.user.email })
  }
  return res.redirect('/')
})

router.get('/confirm', async (req, res) => {
  const { email, token } = req.query
  const user = await User.findOne({ email })
  if (user && token && user.get('tokens.confirmation') === token) {
    user.tokens.set('confirmation', undefined)
    user.confirmed = true
    await user.save()
    return res.render('user/confirm/success')
  }
  return res.render('user/confirm/error')
})

router.route('/confirm/resend')
  .all(middleware.authenticated, middleware.unconfirmed)
  .get((req, res) => {
    const nonce = tokenHelper.generate(8)
    req.session.nonce = nonce
    res.view({ nonce })
  })
  .post((req, res) => {
    if (req.session.nonce === req.body.nonce) {
      User.sendConfirmationEmail(req, req.user.id)
    }
    delete req.session.nonce
    res.render('user/confirm/sent', { email: req.user.email })
  })

router.get('/confirm/success', (req, res) => res.view({ email: req.user.email }))
router.get('/confirm/error', (req, res) => res.view())

router.get('/logout', (req, res) => {
  req.logout && req.logout()
  res.redirect('/')
})

module.exports = router
