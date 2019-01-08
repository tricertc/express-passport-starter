const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user-model')

/**
 * Authenticates existing users who used email registration.
 */
passport.use('local',
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await User.findOne({ email })
      if (user && await user.verifyPassword(password)) {
        return done(null, user)
      }
      done(null, false, 'Invalid email or password')
    }
  ))

/**
 * Registers and authenticates a new user using email signup.
 */
passport.use('local-signup',
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      let user = await User.findOne({ email })

      if (user) {
        return done(null, false, 'Email is already registered.')
      }

      user = new User({ name: req.body.name, email })

      try {
        await user.setPassword(password)
        await user.save()
      } catch (err) {
        return done(null, false, err.message)
      }

      user.sendConfirmationEmail(req)
      req.session.welcome = true

      done(null, user)
    }
  ))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)

  if (user) {
    return done(null, {
      id: user._id,
      name: user.name,
      email: user.email,
      confirmed: user.confirmed
    })
  }

  done(new Error('User not found.'))
})

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
}
