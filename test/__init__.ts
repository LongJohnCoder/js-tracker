import { expect } from 'chai'
import * as sinon from 'sinon'

import TrackIDManager from '../src/tracker/TrackIDManager'

const postMessage = window.postMessage

before(() => {
  // @NOTE: in case contentscript get unexpected info while testing
  window.postMessage = sinon.stub()
})

after(() => {
  window.postMessage = postMessage
})

beforeEach(function () {
  (<any>TrackIDManager).resetID()
})

describe('__init__', function () {
  it('should pass this canary test', function () {
    expect(true).to.be.true
  })
})