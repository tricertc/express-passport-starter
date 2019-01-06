/* eslint-disable no-unused-expressions */
const User = require('../../../src/lib/models/user-model')
const expect = require('chai').expect

describe('User model', () => {
  let user

  beforeEach(() => {
    user = new User()
  })

  it('should set a password', async () => {
    await user.setPassword('foo')
    expect(user.password).to.not.be.null
    expect(user.password).to.not.equal('foo')
  })

  describe('verifyPassword', () => {
    beforeEach(async () => {
      await user.setPassword('foo')
    })

    it('should return true if password matches', async () => {
      const result = await user.verifyPassword('foo')
      expect(result).to.be.true
    })

    it('should return false if a password does not match', async () => {
      const result = await user.verifyPassword('bar')
      expect(result).to.be.false
    })
  })
})
