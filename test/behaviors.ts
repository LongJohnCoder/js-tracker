import * as chai from 'chai'

const expect = chai.expect

describe('tracker\'s behaviors', function () {
  let msgs: ActionInfo[]

  before(function () {
    window.postMessage = function (msg) {
      msgs.push(msg)
    }
  })

  beforeEach(function () {
    msgs = []
  })

  type ExpectInfo = {
    caller: ActionTarget,
    trackid: string,
    target: string,
    action: Action,
    stacktrace?: string,
    actionTag?: string,
    merge?: string,
  }

  function matchActionData(got: ActionInfo, expected: ExpectInfo) {
    expect(expected.caller._owner)
      .to.have.property('_trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('trackid')
      .to.equal(expected.trackid)

    expect(got)
      .to.have.property('target')
      .to.equal(expected.target)

    expect(got)
      .to.have.property('action')
      .to.equal(expected.action)

    if (!expected.stacktrace) {
      expect(got.stacktrace[1])
        .to.have.property('functionName')
        .to.equal(`${expected.caller.constructor.name}.${expected.action}`)
    } else {
      expect(got.stacktrace[1])
        .to.have.property('functionName')
        .to.equal(expected.stacktrace)
    }
    if (expected.merge) {
      expect(got.merge).to.equal(expected.merge)
    }
  }

  describe('HTMLElement', () => {
    it('should track property assignment', () => {
      const div = document.createElement('div')

      div.accessKey = 'accessKey'

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'HTMLElement',
        action: 'accessKey',
      })
    })

    it('should track method call', () => {
      const div = document.createElement('div')

      div.click()

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'HTMLElement',
        action: 'click'
      })
    })

    /* anomalies */

    it('should track dataset property assignment', () => {
      const div = document.createElement('div')

      div.dataset.data = 'data'

      expect(div.dataset._owner).to.equal(div)
      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div.dataset,
        trackid: '1',
        target: 'DOMStringMap',
        action: 'data',
        stacktrace: 'Object.set'
      })
    })

    it('should track style property assignment', () => {
      const div = document.createElement('div')

      div.style.color = 'red'

      expect(div.style._owner).to.equal(div)
      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div.style,
        trackid: '1',
        target: 'CSSStyleDeclaration',
        action: 'color',
        stacktrace: 'Object.set'
      })
    })
  })

  describe('Element', () => {
    it('should track property assignment', () => {
      const div = document.createElement('div')

      div.id = 'id'

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'id'
      })
    })

    it('should track method call', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.insertAdjacentElement('afterbegin', div2)

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'insertAdjacentElement'
      })
    })

    /* anomalies */

    // @NOTE: setAttributeNode & setAttributeNodeNS track behaviors
    // are identical, only test setAttributeNode here of two scenarios
    it('should track setAttributeNode{NS}', () => {
      const div = document.createElement('div')
      const idAttr = document.createAttribute('id')

      div.setAttributeNode(idAttr)

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: div,
        trackid: '1',
        target: 'Element',
        action: 'setAttributeNode'
      })
    })

    it('should track setAttributeNode{NS} (merge scenario)', () => {
      const div = document.createElement('div')
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id' // msgs[0] generate trackid 1
      div.setAttributeNode(idAttr) // msgs[1] generate trackid 2

      expect(msgs).to.have.length(2)

      matchActionData(msgs[1], {
        caller: div,
        trackid: '2',
        target: 'Element',
        action: 'setAttributeNode',
        merge: '1'
      })
    })

    it('should track setAttributeNode{NS} (error scenario)', () => {
      const div = document.createElement('div')
      const div2 = document.createElement('div')

      div.id = 'id'

      const error = function () {
        div2.setAttributeNode(div.attributes[0])
      }
      expect(error).to.throw()
    })
  })

  describe('Node', () => {

  })

  describe('EventTarget', () => {

  })

  describe('Attr', () => {
    it('should track value assignment', () => {
      const idAttr = document.createAttribute('id')

      idAttr.value = 'id'

      expect(msgs).to.have.length(1)

      matchActionData(msgs[0], {
        caller: idAttr,
        trackid: '1',
        target: 'Attr',
        action: 'value'
      })
    })
  })

  describe('CSSStyleDeclaration', () => {

  })

  describe('DOMStringMap', () => {

  })

  describe('DOMTokenList', () => {

  })

  describe('NamedNodeMap', () => {

  })
})