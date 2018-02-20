import { expect } from 'chai'
import $ from 'jquery'

import ActionType from '../../../src/tracker/public/ActionType'
import OwnerManager from '../../../src/tracker/private/OwnerManager'
import trackJqueryApis from '../../../src/tracker/trackers/jquery/tracker'
import * as utils from './utils'

/* this test is based on dom tracker initialized in__init__.ts */

describe('jQuery API tracker', () => {
  const receiver = new utils.TrackerMessageReceiver(window)

  before(() => {
    trackJqueryApis($)
    receiver.setup()
  })

  after(() => {
    receiver.teardown()
  })

  beforeEach(() => {
    receiver.reset()
  })

  describe('Attr action type', () => {
    it('should track attr setter properly', () => {
      const div = document.createElement('div')

      $(div).attr('id', '1')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should not track attr getter', () => {
      const div = document.createElement('div')

      $(div).attr('id')

      receiver.verifyNoMessage()
    })

    it('should track prop setter properly', () => {
      const div = document.createElement('div')

      $(div).prop('id', '1')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Attr)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should not track prop getter', () => {
      const div = document.createElement('div')

      $(div).prop('id')

      receiver.verifyNoMessage()
    })

    it('should track multiple targets of attr action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).prop('id', '1')
      const context = utils.getRecordContextFromPrevLine()

      // for div1
      const record1 = utils.createRecordData('1', ActionType.Attr)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifySingleMessageChunk(context, record1)

      // for div2
      const record2 = utils.createRecordData('2', ActionType.Attr)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifySingleMessageChunk(context, record2)
    })
  })

  describe('Behav action type', () => {
    it('should have no error when no matched element', () => {
      $(null).click()
      expect(true).to.be.true
    })

    it('should track click with no listener', () => {
      const div = document.createElement('div')

      $(div).click()
      const context1 = utils.getRecordContextFromPrevLine()
      const record1 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifySingleMessageChunk(context1, record1)
    })

    it('should track click with native listener', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).click()
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 },
      ])
    })

    it('should track click with jquery listener', () => {
      const div = document.createElement('div')

      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).click()
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 },
      ])
    })

    it('should track focus (which will use special trigger, same as blur) with no listener', () => {
      const div = document.createElement('div')

      $(div).focus()
      const context1 = utils.getRecordContextFromPrevLine()
      const record1 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifySingleMessageChunk(context1, record1)
    })

    function createFocusableDiv() {
      const div = document.createElement('div')
      // @NOTE: https://stackoverflow.com/questions/3656467/is-it-possible-to-focus-on-a-div-using-javascript-focus-function
      // make div focusable (1) set tabIndex (2) attach to page
      div.tabIndex = -1
      document.body.appendChild(div)
      receiver.reset()

      return div
    }

    it('should track focus (which will use special trigger, same as blur) with native listener', () => {
      const div = createFocusableDiv()

      div.addEventListener('focus', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).focus()
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 }
      ])
    })

    it('should track focus (which will use special trigger, same as blur) with jquery listener', () => {
      const div = createFocusableDiv()

      $(div).on('focus', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).focus()
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal('1')
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 }
      ])
    })

    it('should track mouseenter (and those have no native trigger method like click()) and actions triggered by it properly', () => {
      const div = document.createElement('div')

      $(div).on('mouseenter', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).mouseenter()
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 },
      ])
    })

    it('should track trigger and actions triggered by it properly (add native event listener)', () => {
      const div = document.createElement('div')

      div.addEventListener('click', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).trigger('click')
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 }
      ])
    })

    it('should track triggerHandler and actions triggered by it properly', () => {
      const div = document.createElement('div')
      // @NOTE: triggerHandler only trigger event registered by jquery 
      $(div).on('click', () => {
        div.style.color = 'red'
      })
      const context1 = utils.getRecordContextFromPrevLine(-1)
      const record1 = utils.createRecordData('1', ActionType.Style)

      receiver.reset()

      $(div).triggerHandler('click')
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData('1', ActionType.Behav | ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div.style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID1).to.equal(record1.trackid)
      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 }
      ])
    })

    describe('low level api: event.trigger', () => {
      const MessageBroker = require('../../../src/tracker/private/MessageBroker').default

      it('should not record event.trigger given event is fired by page interaction (e.g., focusin -> event.simulate -> event.trigger)', () => {
        const div = document.createElement('div')

        $.event.trigger('click', null, div)

        expect(MessageBroker.isEmpty()).to.be.true
      })

      it('should not record anything during ajax executing', () => {
        // @NOTE: [http://api.jquery.com/jquery.ajax/]
        // use ajax to fetch javascript will load and execute immediately,
        // thus we use html file for this test
        return $.ajax({ method: 'GET', url: '/script.html' }).done(() => {
          expect(MessageBroker.isEmpty()).to.be.true
          receiver.verifyNoMessage()
        })
      })
    })
  })

  describe('Event action type', () => {
    it('should track ajax event properly', () => {
      const div = document.createElement('div')

      $(div).ajaxStart(() => { })
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track on (general event) properly', () => {
      const div = document.createElement('div')

      $(div).on('click', () => { })
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track click (explicit event) properly', () => {
      const div = document.createElement('div')

      $(div).click(() => { })
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Event)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track multiple targets of event action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).on('click', () => { })
      const context = utils.getRecordContextFromPrevLine()

      // for div1
      const record1 = utils.createRecordData('1', ActionType.Event)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifySingleMessageChunk(context, record1)

      // for div2
      const record2 = utils.createRecordData('2', ActionType.Event)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifySingleMessageChunk(context, record2)
    })
  })

  describe('Node action type', () => {
    it('should track after properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      const content = `<span>content</span>`

      parent.appendChild(child)
      receiver.reset()
      // @NOTE: this record will be saved on parent
      $(child).after(content)
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(parent)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track append properly', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')

      $(parent).append(child)
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Node)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(parent)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track multiple targets of node action properly', () => {
      const parent1 = document.createElement('div')
      const parent2 = document.createElement('div')
      const child = document.createElement('div')

      $(parent1).add(parent2).append(child)
      const context = utils.getRecordContextFromPrevLine()

      // for parent1
      const record1 = utils.createRecordData('1', ActionType.Node)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(parent1)

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifySingleMessageChunk(context, record1)

      // for parent2
      const record2 = utils.createRecordData('2', ActionType.Node)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(parent2)

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifySingleMessageChunk(context, record2)
    })
  })

  describe('Style action type', () => {
    it('should track addClass properly', () => {
      const div = document.createElement('div')

      $(div).addClass('class')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track css setter properly', () => {
      const div = document.createElement('div')

      $(div).css('background-color', 'red')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should not track css getter', () => {
      const div = document.createElement('div')
      // @NOTE: jQuery will do initial process on dom while getting the first call of css getter
      $(div).css('background-color')
      receiver.reset()

      $(div).css('background-color')

      receiver.verifyNoMessage()
    })

    it('should track prop setter (class) properly', () => {
      const div = document.createElement('div')

      $(div).prop('class', 'class')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should not track prop getter (class)', () => {
      const div = document.createElement('div')

      $(div).prop('class')

      receiver.verifyNoMessage()
    })

    it('should track prop setter (style) properly', () => {
      const div = document.createElement('div')

      $(div).prop('style', 'background-color: red')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should not track prop getter (style)', () => {
      const div = document.createElement('div')

      $(div).prop('style')

      receiver.verifyNoMessage()
    })

    it('should track show properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      receiver.reset()

      $(div).show()
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track hide properly', () => {
      const div = document.createElement('div')

      $(div).hide()
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track toggle properly', () => {
      const div = document.createElement('div')

      $(div).toggle()
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData('1', ActionType.Style)
      const ownerID = OwnerManager.getTrackIDFromItsOwner(div)

      expect(ownerID).to.equal(record.trackid)
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track multiple targets of style action properly', () => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      $(div1).add(div2).addClass('class')
      const context = utils.getRecordContextFromPrevLine()

      // for div1
      const record1 = utils.createRecordData('1', ActionType.Style)
      const ownerID1 = OwnerManager.getTrackIDFromItsOwner(div1)

      expect(ownerID1).to.equal(record1.trackid)
      receiver.verifySingleMessageChunk(context, record1)

      // for div2
      const record2 = utils.createRecordData('2', ActionType.Style)
      const ownerID2 = OwnerManager.getTrackIDFromItsOwner(div2)

      expect(ownerID2).to.equal(record2.trackid)
      receiver.verifySingleMessageChunk(context, record2)
    })
  })

  describe('animation apis', () => {
    it('should track only animate and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).animate({ "top": "100px" }, 100, () => {
        const context = utils.getRecordContextFromPrevLine()
        const record = utils.createRecordData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifySingleMessageChunk(context, record)
        done()
      })
    })

    it('should track only specific animation (e.g., fadeIn, fadeOut) and exclude all details of its implementation code', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100, () => {
        const context = utils.getRecordContextFromPrevLine()
        const record = utils.createRecordData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifySingleMessageChunk(context, record)
        done()
      })
    })

    it('should track other Style actions after animation finishes', (done) => {
      const div = document.createElement('div')

      $(div).slideUp(100, () => {
        receiver.reset()

        $(div).css('color', 'red')
        const context = utils.getRecordContextFromPrevLine()
        const record = utils.createRecordData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifySingleMessageChunk(context, record)
        done()
      })
    })

    it('should track other Style actions properly given animation executes only one tick ', () => {
      const div = document.createElement('div')

      $(div).fadeOut(0)
      receiver.reset()

      $(div).css('color', 'red')
      const context = utils.getRecordContextFromPrevLine()
      const record = utils.createRecordData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      receiver.verifySingleMessageChunk(context, record)
    })

    it('should track other Style actions during animation', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100, () => { done() })
      const context1 = utils.getRecordContextFromPrevLine()
      const record1 = utils.createRecordData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      $(div).css('color', 'red')
      const context2 = utils.getRecordContextFromPrevLine()
      const record2 = utils.createRecordData(
        OwnerManager.getTrackIDFromItsOwner(div),
        ActionType.Style
      )
      receiver.verifyMultipleMessageChunks([
        { context: context1, data: record1 },
        { context: context2, data: record2 }
      ])
    })

    it('should track delay animation properly', (done) => {
      const div = document.createElement('div')

      $(div).css('display', 'none')
      receiver.reset()

      $(div).delay(100).slideDown(100, () => {
        const context = utils.getRecordContextFromPrevLine()
        const record = utils.createRecordData(
          OwnerManager.getTrackIDFromItsOwner(div),
          ActionType.Style
        )
        receiver.verifySingleMessageChunk(context, record)
        done()
      })
    })

    it('should track stop properly', (done) => {
      const div = document.createElement('div')

      $(div).fadeOut(100)
      $(div)
        .stop()
        .queue(function () {
          receiver.reset()
          $(this).dequeue()
        })
        .fadeIn(100, () => {
          const context = utils.getRecordContextFromPrevLine()
          const record = utils.createRecordData(
            OwnerManager.getTrackIDFromItsOwner(div),
            ActionType.Style
          )
          receiver.verifySingleMessageChunk(context, record)
          done()
        })
    })

    it('should track double animation properly', (done) => {
      const div1 = document.createElement('div')
      const div2 = document.createElement('div')

      // for div1
      $(div1).animate({ 'margin-top': '300px', 'opacity': 0 }, 100)
      const context1 = utils.getRecordContextFromPrevLine()
      const record1 = utils.createRecordData(
        OwnerManager.getTrackIDFromItsOwner(div1),
        ActionType.Style
      )
      receiver.verifySingleMessageChunk(context1, record1)
      receiver.reset()

      // for div2
      $(div2).animate({ 'top': -200 }, 100)
      const context2 = utils.getRecordContextFromPrevLine()
      // @NOTE: setTimeout to wait for animation executing of div2.
      // jquery will not execute second immediately, it will wait 
      // until next animate cycle and do animation after first one.
      setTimeout(() => {
        const record2 = utils.createRecordData(
          OwnerManager.getTrackIDFromItsOwner(div2),
          ActionType.Style
        )
        receiver.verifySingleMessageChunk(context2, record2)
        done()
      }, 10)
    })
  })
})