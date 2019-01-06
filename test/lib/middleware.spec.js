/* eslint-disable no-unused-expressions */
const middleware = require('../../src/lib/middleware')
const expect = require('chai').expect
const sinon = require('sinon')

describe('Middleware', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      accepts: () => true
    }
    res = {
      locals: {},
      redirect: sinon.spy()
    }
    next = sinon.spy()
  })

  /**
   * Default middleware
   */
  describe('default', () => {
    it('should add a title', () => {
      middleware.default({ title: 'foo' })(req, res, next)
      expect(res.locals.title).to.equal('foo')
    })

    it('should process and add flash message alerts', () => {
      const errors = [ 'foo', 'bar', 'baz' ]
      req.flash = () => ({ error: errors })
      middleware.default()(req, res, next)
      expect(res.locals.alerts.error).to.equal(errors)
    })

    it('should pass the session user to the response', () => {
      req.user = { name: 'foo' }
      res.render = sinon.spy()

      middleware.default()(req, res, next)
      expect(req.user.name).to.equal('foo')
    })
  })

  /**
   * Anonymous middleware
   */
  describe('anonymous', () => {
    it('should redirect an authenticated user', () => {
      req.user = true
      middleware.anonymous(req, res, next)
      expect(res.redirect.calledWith('/')).to.be.true
    })

    it('should pass through an anonymous user', () => {
      middleware.anonymous(req, res, next)
      expect(next.called).to.be.true
    })
  })

  /**
   * Authenticated middleware
   */
  describe('authenticated', () => {
    it('should redirect an anonymous user', () => {
      middleware.authenticated(req, res, next)
      expect(res.redirect.calledWith('/user/login')).to.be.true
    })

    it('should pass through an authenticated user', () => {
      req.user = true
      middleware.authenticated(req, res, next)
      expect(next.called).to.be.true
    })
  })

  /**
   * View middleware
   */
  describe('view', () => {
    let view

    beforeEach(() => {
      res.render = sinon.spy()
      view = middleware.view('home')
    })

    it('should add a view method to the response', () => {
      view(req, res, next)
      expect(res.view).to.be.a('function')
    })

    it('should render the index view', () => {
      req.path = '/'
      view(req, res, next)
      res.view()
      expect(res.render.calledWith('home')).to.be.true
    })

    it('should render a mapped view', () => {
      req.path = '/user/login'
      view(req, res, next)
      res.view()
      expect(res.render.calledWith('user/login')).to.be.true
    })
  })
})
