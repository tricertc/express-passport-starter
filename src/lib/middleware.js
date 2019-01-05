exports.default = (options = {}) => (req, res, next) => {
  res.locals.title = options.title
  next()
}

exports.view = (indexView = 'home') => (req, res, next) => {
  const view = req.path.substring(1) || indexView
  res.view = viewData => {
    res.render(view, viewData)
  }
  next()
}
