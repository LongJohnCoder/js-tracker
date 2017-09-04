/// <reference path='../../tracker/public/ActionStore.d.ts'/>

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ActionType, {
  ActionTypeNames
} from '../../tracker/public/ActionType'

interface ISidebarListProps {
  records: ActionRecord[];
  shouldTagDiffs: boolean;
  openSource: (url: string, line: number) => void;
}

interface ISidebarListState {
  recordsInDiffState: { [key: string]: boolean; };
}

export default class SidebarList extends React.Component<ISidebarListProps, ISidebarListState> {
  constructor(props) {
    super(props)

    this.state = {
      recordsInDiffState: {}
    }
  }

  componentWillReceiveProps(nextProps: ISidebarListProps) {
    const records = this.filterDiffRecords(this.props, nextProps)

    this.setDiffStateOn(records)

    setTimeout(() => {
      this.clearDiffStateOn(records)
    }, this.DIFF_STATE_DURATION)
  }

  render() {
    return (
      <div className="sidebar-list">
        {
          this.props.records.length > 0
            ? this.props.records.map((record) => {
              return renderRecord(
                record,
                this.isInDiffState(record),
                this.props.openSource
              )
            })
            : renderEmptyRecord()
        }
      </div>
    )
  }

  /* private */

  private DIFF_STATE_DURATION = 2000

  private filterDiffRecords(preProps: ISidebarListProps, nextProps: ISidebarListProps): ActionRecord[] {
    if (nextProps.shouldTagDiffs) {
      // @NOTE: new records will always be added to the head of record list
      const lastDiffIndex
        = nextProps.records.length - preProps.records.length

      return nextProps.records.filter((_, index) => index < lastDiffIndex)
    }
    return []
  }

  private setDiffStateOn(records: ActionRecord[]) {
    this.setState((preState: ISidebarListState) => {
      return {
        recordsInDiffState: Object.assign({},
          preState.recordsInDiffState,
          records.reduce((_, record) => {
            return Object.assign(_, { [record.key]: true })
          }, {})
        )
      }
    })
  }

  private clearDiffStateOn(records: ActionRecord[]) {
    this.setState((preState: ISidebarListState) => {
      const nextState = Object.assign({}, preState)

      records.map((record) => {
        delete nextState.recordsInDiffState[record.key]
      })
      return nextState
    })
  }

  private isInDiffState(record: ActionRecord): boolean {
    return this.state.recordsInDiffState.hasOwnProperty(record.key)
  }
}

function renderEmptyRecord(): JSX.Element {
  return (
    <div className='record record-empty'>
      <span>Have no matched records yet :)</span>
    </div>
  )
}

function renderRecord(
  record: ActionRecord,
  isInDiffState: boolean,
  openSource: (url: string, line: number) => void
) {
  // @NOTE: new records will be prepended to the head of list
  // @NOTE: key should reflect new added items,
  // react use key to identify new items in list, 
  // and only re-render those items with new key 
  // from previous rendering
  return (
    <div
      key={record.key}
      className={`record ${isInDiffState ? 'record-diff' : ''}`}
    >
      {renderRecordTags(record.type)}
      {renderRecordLink(record.source.loc, openSource)}
      {renderRecordInfo(record)}
    </div>
  )
}

function renderRecordTags(actionType: ActionType): JSX.Element {
  const tags = ActionTypeNames.reduce((tags, type, index) => {
    if (actionType & ActionType[type]) {
      tags.push((
        <div
          key={index}
          className={`tag tag-${type.toLowerCase()}`}
        >
          {type}
        </div>)
      )
    }
    return tags
  }, [])
  return (
    <div className="tags">
      {tags}
    </div>
  )
}

function renderRecordLink(
  { scriptUrl, lineNumber, columnNumber },
  openSource: (url: string, line: number) => void
): JSX.Element {
  return (
    <div className="link">
      <a onClick={
        (e: any) => {
          e.preventDefault()
          openSource(scriptUrl, lineNumber)
        }
      }>
        {`${scriptUrl}:${lineNumber}:${columnNumber}`}
      </a>
    </div>
  )
}

function renderRecordInfo(record: ActionRecord): JSX.Element {
  return (
    <div className="info">
      <span>{record.source.code}</span>
    </div>
  )
}