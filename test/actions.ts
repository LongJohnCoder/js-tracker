/// <reference path='../src/tracker/public/ActionStore.d.ts'/>

import StackFrame from 'stackframe'
import ActionType from '../src/tracker/public/ActionType'
import {
  dummyStackFrame as _,
  createActionRecord
} from './utils'

// all actions refer to ./script.js
const scriptUrl = '/script.js'

export default [
  // action[0]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'id',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Element.id',
        fileName: scriptUrl,
        lineNumber: 2,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Attr,
      scriptUrl, 2, 1,
      `div.id = 'id'`
    )
  },
  // action[1]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'CSSStyleDeclaration',
      action: 'color',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Object.set',
        fileName: scriptUrl,
        lineNumber: 3,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 3, 1,
      `div.style.color = 'red'`
    ),
  },
  // action[2]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'Element',
      action: 'removeAttribute',
      actionTag: 'style',
      stacktrace: [_, _, new StackFrame({
        functionName: 'Element.removeAttribute',
        fileName: scriptUrl,
        lineNumber: 4,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Style,
      scriptUrl, 4, 1,
      `div.removeAttribute('style')`
    )
  },
  // action[3]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'HTMLElement',
      action: 'innerText',
      stacktrace: [_, _, new StackFrame({
        functionName: 'HTMLElement.innerText',
        fileName: scriptUrl,
        lineNumber: 5,
        columnNumber: 1
      })]
    },
    record: createActionRecord(
      ActionType.Attr | ActionType.Node,
      scriptUrl, 5, 1,
      `div.innerText = 'js-tracker'`
    )
  },
  // action[4]
  {
    info: <ActionInfo>{
      trackid: '1',
      target: 'EventTarget',
      action: 'addEventListener',
      stacktrace: [_, _, new StackFrame({
        functionName: 'EventTarget.addEventListener',
        fileName: scriptUrl,
        lineNumber: 6,
        columnNumber: 5
      })]
    },
    record: createActionRecord(
      ActionType.Event,
      scriptUrl, 6, 5,
      `div.addEventListener('click', function () {console.log('clicked')})`
    )
  }
]