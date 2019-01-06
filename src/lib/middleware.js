/**
 * Default middleware applied to all requests
 */
exports.default = (options = {}) => (req, res, next) => {
  res.locals.user = req.user

  if (req.accepts('html')) {
    res.locals.title = options.title
    res.locals.alerts = req.flash && req.flash()
  }

  next()
}

/**
 * Adds a view() method to the response object that will
 * render a view from a file path that matches the request path.
 *
 * example:
 *  router.get('/user/login', (req, res) => {
 *    // renders ~/views/user/login.pug
 *    res.view()
 *  })
 */
exports.view = (indexView = 'home') => (req, res, next) => {
  const view = (req.path && req.path.substring(1)) || indexView
  res.view = viewData => {
    res.render(view, viewData)
  }
  next()
}

/**
 * Restrict route to authenticted users only.
 */
exports.authenticated = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login')
  }
  next()
}

/**
 * Restrict route to anonymous users only.
 */
exports.anonymous = (req, res, next) => {
  if (req.user) {
    return res.redirect('/')
  }
  next()
}
