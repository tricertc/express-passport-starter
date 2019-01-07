const url = require('url')

/**
 * Build a url with optinoal query parameters.
 *
 * @param {Express.Request} req
 * @param {string} pathname
 */
function build(req, pathname, query) {
  return url.format({
    protocol: req.protocol,
    host: req.headers.host,
    pathname,
    query
  })
}

exports.build = build
