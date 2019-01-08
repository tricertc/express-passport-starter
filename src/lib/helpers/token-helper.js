const crypto = require('crypto')

/**
 * Generate a hex token from a randomized byte
 * array of length n.
 *
 * @param {int} n (optional) Defaults to 48.
 */
function generate(n = 48) {
  return crypto.randomBytes(48).toString('hex')
}

// token types
exports.tokens = {
  CONFIRMATION: 'confirmation'
}

exports.generate = generate
