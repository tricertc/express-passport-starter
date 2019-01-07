const DEVLOCK_KEY = process.env.DEVLOCK_KEY || 'letmein'

module.exports = app => {
  app.route('/devlock/unlock')
    .get((req, res) => res.render('devlock/unlock'))
    .post((req, res) => {
      if (req.body.key === DEVLOCK_KEY) {
        req.session.devlock = true
      }
      res.redirect('/')
    })

  app.get('/devlock/lock', (req, res) => {
    delete req.session.devlock
    res.redirect('/')
  })

  app.use((req, res, next) => {
    if (!req.session.devlock) {
      return res.redirect('/devlock/unlock')
    }
    next()
  })
}
