/* eslint-disable no-unused-expressions */
const helper = require('../../../src/lib/helpers/token-helper')
const expect = require('chai').expect

describe('Token helper', () => {
  it('should generate a random token', () => {
    const t1 = helper.generate()
    const t2 = helper.generate()

    expect(t1).is.not.null
    expect(t2).is.not.null
    expect(t1).does.not.equal(t2)
  })
})
