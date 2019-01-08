const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const tokenHelper = require('../helpers/token-helper')
const emailService = require('../services/email-service')

const User = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  tokens: { type: Map, of: String }
})

/**
 * Saves a hash of the password to the user record.
 *
 * @param {string} password
 */
async function setPassword(password) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(password, salt)
}

/**
 * Verifies the password against the hashed password on the user record.
 *
 * @param {string} password
 * @returns
 */
async function verifyPassword(password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

/**
 * Send the user an email to confirm their account.
 *
 * @param {Express.Request} req
 */
async function sendConfirmationEmail(req) {
  this.set('tokens.confirmation', tokenHelper.generate())
  await this.save()
  emailService.sendConfirmationEmail(req, this.email, this.tokens.get('confirmation'))
}

User.methods.setPassword = setPassword
User.methods.verifyPassword = verifyPassword
User.methods.sendConfirmationEmail = sendConfirmationEmail

module.exports = mongoose.models.User || mongoose.model('User', User)
