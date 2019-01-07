const helper = require('../../../src/lib/helpers/url-helper')
const expect = require('chai').expect

describe('URL helper', () => {
  let req

  beforeEach(() => {
    req = {
      headers: {
        host: 'localhost:5000'
      },
      protocol: 'http'
    }
  })

  it('should build a url', () => {
    const link = helper.build(req, '/user/login')
    expect(link).equals('http://localhost:5000/user/login')
  })

  it('should build a parameterized url', () => {
    const link = helper.build(req, '/user/email/confirm', {
      email: 'foo@bar.com',
      token: '123456789'
    })

    expect(link).equals('http://localhost:5000/user/email/confirm?email=foo%40bar.com&token=123456789')
  })
})
