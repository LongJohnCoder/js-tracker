/// <reference path='../src/tracker/types/ActionStore.d.ts'/>

import ActionType from '../src/tracker/public/ActionType'
import { hashSourceLocation } from '../src/tracker/public/SourceLocation'

function createAction(
  trackid: TrackID,
  type: ActionType,
  scriptUrl: string,
  lineNumber: number,
  columnNumber: number,
  code: string,
) {
  const loc = { scriptUrl, lineNumber, columnNumber }

  return {
    info: <ActionInfo>{ trackid, type, loc },
    record: <ActionRecord>{
      key: hashSourceLocation(loc),
      type, loc, code
    }
  }
}
// actions in js
const actionsOfJS = ((urlOfJS) => [
  // action[0] `div.id = 'id'`
  createAction('1', ActionType.Attr, urlOfJS, 2, 8, `div.id = 'id'`),
  // action[1] `div.style.color = 'red'`
  createAction('1', ActionType.Style, urlOfJS, 3, 17, `div.style.color = 'red'`),
  // action[2] `div.removeAttribute('style')`
  createAction('1', ActionType.Style, urlOfJS, 4, 5, `div.removeAttribute('style')`),
  // action[3] `div.innerText = 'js-tracker'`
  createAction('1', ActionType.Attr | ActionType.Node, urlOfJS, 5, 15, `div.innerText = 'js-tracker'`),
  // action[4] `div.addEventListener('click', function () {console.log('clicked')})`
  createAction('1', ActionType.Event, urlOfJS, 6, 5, `div.addEventListener('click', function () { ... })`),
  // action[5] `div.focus()`
  createAction('1', ActionType.Event, urlOfJS, 7, 7, `div.focus()`),
  // action[6] `div.classList.add('class' + i)`
  createAction('1', ActionType.Style, urlOfJS, 10, 17, `div.classList.add('class' + i)`),
])(`/script.js`)

// actions in html
const actionsOfHTML = ((urlOfHTML) => [
  // action[0] `div.innerText = 'js-tracker'`
  createAction('1', ActionType.Attr | ActionType.Node, urlOfHTML, 22, 23, `div.innerText = 'js-tracker'`),
  // action[1] `div.addEventListener('click', function () {console.log('clicked')})`
  createAction('1', ActionType.Event, urlOfHTML, 27, 13, `div.addEventListener('click', function () { ... })`),
])(`/script.html`)

// actions for minified html
const actionsOfMinHTML = ((urlOfMinHTML) => [
  // action[0] `div.id = 'id'`
  createAction('1', ActionType.Style, urlOfMinHTML, 4, 253, `$(div).addClass('class')`)
])(`/script.min.html`)

export { actionsOfJS, actionsOfHTML, actionsOfMinHTML }