/// <reference path='../../src/extension/background.d.ts'/>

import { expect } from 'chai'
import * as sinon from 'sinon'

import ActionStore from '../../src/tracker/public/ActionStore'
import TrackIDFactory from '../../src/tracker/public/TrackIDFactory'

import actions from '../actions'

describe('contentscript', () => {
  const chrome = window.chrome
  const sandbox = sinon.sandbox.create()
  const inputFromTracker = function (info: ActionInfo) {
    window.dispatchEvent(new CustomEvent('js-tracker', {
      detail: { info }
    }))
  }
  const outputToBackground = sinon.spy()

  before(() => {
    (<any>window).chrome = {
      runtime: {
        sendMessage: outputToBackground
      }
    }
  })

  after(() => {
    (<any>window).chrome = chrome
  })

  beforeEach(() => {
    outputToBackground.reset()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('on message from tracker', () => {
    const registerFromActionInfo = ActionStore.prototype.registerFromActionInfo
    const registerFromActionInfoStub = sinon.stub()

    function select(element: Element) {
      window.onDevtoolSelectionChanged(element)
      outputToBackground.reset()
    }
    before(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfoStub
    })

    after(() => {
      ActionStore.prototype.registerFromActionInfo = registerFromActionInfo
    })

    beforeEach(() => {
      select(null)
    })

    afterEach(() => {
      registerFromActionInfoStub.reset()
    })

    it('should call ActionStore.registerFromActionInfo with info collected from tracker', (done) => {
      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          registerFromActionInfoStub
            .calledWith(actions[0].info)
        ).to.be.true
        done()
      }, 10)
    })

    it('should not send message given registering is failed', (done) => {
      registerFromActionInfoStub.returns(false)

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(outputToBackground.called).to.be.false
        done()
      }, 10)
    })

    it('should not send message given updated target is not current selection', (done) => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.setAttribute('trackid', '1')
      div2.setAttribute('trackid', '2')

      select(div)

      registerFromActionInfoStub.returns(true)

      inputFromTracker(Object.assign({}, actions[0].info, { trackid: '2' }))

      setTimeout(() => {
        expect(outputToBackground.called).to.be.false
        done()
      }, 10)
    })

    it('should send message with new records and true shouldTagDiffs to background given registering is successful and updated target is current selection', (done) => {
      const div = document.createElement('div')

      div.setAttribute('trackid', '1')

      select(div)

      registerFromActionInfoStub.returns(true)

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs('1')
        .returns([actions[0].record])

      inputFromTracker(actions[0].info)

      setTimeout(() => {
        expect(
          outputToBackground
            .calledAfter(registerFromActionInfoStub)
        ).to.be.true
        expect(
          outputToBackground.calledWith(
            <Message>{
              records: [actions[0].record],
              shouldTagDiffs: true
            }
          )
        ).to.be.true
        done()
      }, 10)
    })
  })

  describe('on devtool selection changed', () => {
    it('should set onDevtoolSelectionChanged on window', () => {
      expect(window.onDevtoolSelectionChanged).to.be.a('function')
    })

    it('should send message with empty records and false shouldTagDiffs to background given element has no trackid', () => {
      const div = document.createElement('div')

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            records: [],
            shouldTagDiffs: false
          }
        )
      ).to.be.true
    })

    it('should send message with existed records and false shouldTagDiffs to background given element has tradckid', () => {
      const div = document.createElement('div')

      div.setAttribute('trackid', '1')

      sandbox.stub(ActionStore.prototype, 'get')
        .withArgs('1')
        .returns([actions[0].record])

      window.onDevtoolSelectionChanged(div)

      expect(
        outputToBackground.calledWith(
          <Message>{
            records: [actions[0].record],
            shouldTagDiffs: false
          }
        )
      ).to.be.true
    })
  })
})