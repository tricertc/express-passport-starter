exports.default = (options = {}) => (req, res, next) => {
  res.locals.title = options.title
  next()
}
