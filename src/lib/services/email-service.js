const sgMail = require('@sendgrid/mail')
const urlHelper = require('../helpers/url-helper')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send an HTML-formatted email.
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
function sendHtmlEmail(to, subject, html) {
  const from = process.env.NO_REPLY
  sgMail.send({ from, to, subject, html })
}

/**
 * Send formatted confirmation email
 *
 * @param {Express.Request} req
 * @param {string} to
 * @param {string} token
 */
function sendConfirmationEmail(req, to, token) {
  const link = urlHelper.build(req, '/user/email/confirm', { email: to, token })

  const html = `
    <div>
      <h3>${process.env.TITLE}</h3>
      <p><a href="${link}">Click here to confirm your email.</a></p>
    </div>
  `

  sendHtmlEmail(to, 'Confirm your email', html)
}

exports.sendConfirmationEmail = sendConfirmationEmail
