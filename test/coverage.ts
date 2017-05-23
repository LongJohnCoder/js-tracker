import * as chai from 'chai'
import ActionTypeMap from '../src/tracker/ActionTypeMap'

const expect = chai.expect

describe('track coverage', function () {
  describe('property setter coverage', function () {
    const EXCLUDE_PROPS: Object = {
      'attributes': true,
      'classList': true,
      'dataset': true,
      'style': true
    }
    function isExcludedProp(prop) {
      return EXCLUDE_PROPS.hasOwnProperty(prop)
    }
    const PROXY_CTRS: Object = {
      'CSSStyleDeclaration': true,
      'DOMStringMap': true
    }
    function isProxyCtr(ctr) {
      return PROXY_CTRS.hasOwnProperty(ctr)
    }
    for (let ctr in ActionTypeMap) {
      if (!isProxyCtr(ctr)) {
        const proto = window[ctr].prototype
        const trackProps = ActionTypeMap[ctr]

        it(`should track ${ctr} all property setters`, function () {
          Object.getOwnPropertyNames(proto).forEach((prop) => {
            const descriptor = Object.getOwnPropertyDescriptor(proto, prop)

            if (descriptor.set && !isExcludedProp(prop)) {
              expect(trackProps).to.have.property(prop)
            }
          })
        })
      }
    }
  })

  describe('manipulation method coverage', function () {
    function isManipulationMethod(method) {
      return /^(set|add|append|prepend|insert|remove|replace|toggle)/.test(method)
    }
    for (let ctr in ActionTypeMap) {
      const proto = window[ctr].prototype
      const trackProps = ActionTypeMap[ctr]

      it(`should track ${ctr} all manipulation methods`, function () {
        Object.getOwnPropertyNames(proto).forEach((prop) => {
          if (isManipulationMethod(prop)) {
            expect(trackProps).to.have.property(prop)
          }
        })
      })
    }
  })
})
