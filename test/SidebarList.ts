/// <reference path='../src/tracker/ActionStore.d.ts'/> 

import { expect } from 'chai'
import * as sinon from 'sinon'
import * as React from 'react'
import * as ReactTestUtils from 'react-dom/test-utils'

import ActionType from '../src/tracker/ActionType'
import SidebarList from '../src/SidebarList'

const PORT = 9876
const HOST = `http://localhost:${PORT}`
const TEST_SCRIPT = HOST + '/test-script.js'

describe('SidebarList', () => {
  const _records: ActionRecord[] = []

  before(() => {
    // refer to ./test-script.js
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':2:1',
      type: ActionType.Attr,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 2,
          columnNumber: 1
        },
        code: `div.id = 'id'`
      }
    })
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':3:1',
      type: ActionType.Style,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 3,
          columnNumber: 1
        },
        code: `div.style.color = 'red'`
      }
    })
    _records.push(<ActionRecord>{
      key: TEST_SCRIPT + ':4:1',
      type: ActionType.Style,
      source: <Source>{
        loc: {
          scriptUrl: TEST_SCRIPT,
          lineNumber: 4,
          columnNumber: 1
        },
        code: `div.removeAttribute('style')`
      }
    })
  })

  it('should render all records passed to it', () => {
    const sidebarList = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarList, {
        records: _records,
        openResource: () => { }
      })
    )
    const records = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarList,
      'record'
    )
    expect(records).to.have.length(_records.length)
    records.map((record, index) => {
      testRenderedRecordMatchesRecordData(record, _records[index])
    })
  })

  function testRenderedRecordMatchesRecordData(record: Element, data: ActionRecord) {
    const title = record.getElementsByClassName('record-title')
    const info = record.getElementsByClassName('record-info')

    expect(title).to.have.length(1)
    expect(info).to.have.length(1)

    testRenderedRecordTitle(title[0], data)
    testRenderedRecordInfo(info[0], data)
  }

  function testRenderedRecordTitle(title: Element, data: ActionRecord) {
    const tag = title.getElementsByClassName('record-tag')[0]
    const link = title.getElementsByClassName('record-link')[0]

    expect(tag.textContent).to.equal(ActionType[data.type])
    expect(link.textContent).to.equal(data.key)
  }

  function testRenderedRecordInfo(info: Element, data: ActionRecord) {
    expect(info.textContent).to.equal(data.source.code)
  }

  it('should call prop openResource with proper url and line when record link is clicked', () => {
    const openResource = sinon.spy()
    const sidebarList = ReactTestUtils.renderIntoDocument(
      React.createElement(SidebarList, {
        records: _records,
        openResource: openResource
      })
    )
    const links = ReactTestUtils.scryRenderedDOMComponentsWithClass(
      sidebarList,
      'record-link'
    )
    links.map((link, index) => {
      const record = _records[index]

      ReactTestUtils.Simulate.click(link)

      expect(
        openResource.calledWith(
          record.source.loc.scriptUrl,
          record.source.loc.lineNumber
        )
      ).to.be.true
    })
  })
})