/// <reference path='../tracker/public/types/MessageTypes.d.ts'/>

/// <reference path='./private/types/ActionRecordStore.d.ts'/>
/// <reference path='./private/types/ContentscriptHelpers.d.ts'/>
/// <reference path='./private/types/Message.d.ts'/>

import {
  RECORD_CONTEXT_START,
  RECORD_CONTEXT_END,
  RECORD_DATA
} from '../tracker/public/MessageTypes'
import { match } from '../tracker/public/SourceLocation'
import { isTestEnv } from './utils'

class ContentscriptController {
  static SELECTION_IS_CHANGED = true
  static SELECTION_IS_NOT_CHANGED = false

  public selection: Element = null

  private context: RecordContext = null
  private store: IActionRecordStore
  private updateSidebar: (message: Message, callback?: (response: any) => void) => void

  constructor(
    store: IActionRecordStore,
    updateSidebar: (message: Message, callback?: (response: any) => void) => void
  ) {
    this.store = store
    this.updateSidebar = updateSidebar
  }

  /* public */

  public messageHandler = async (message: RecordMessage) => {
    switch (message.type) {
      case RECORD_CONTEXT_START:
        if (!this.context) {
          this.context = message.data
        }
        break

      case RECORD_DATA:
        await this.recordDataHandler(message.data)
        break

      case RECORD_CONTEXT_END:
        if (match(this.context.loc, message.data.loc)) {
          this.context = null
        }
        break
    }
  }

  public devtoolSelectionChangedHandler = (element: Element) => {
    console.group('contentscript')
    console.log('--- On Devtool Selection Changed ---')
    console.log('selected:', element)
    console.log('------------------------------------')
    console.groupEnd()

    this.selection = element

    this.updateSidebar({
      records: this.store.get(this.getTrackIDFromSelection()),
      selectionChanged: ContentscriptController.SELECTION_IS_CHANGED
    }, this.responseLogger)
  }

  /* private */

  private async recordDataHandler(data: RecordData) {
    const info: ActionInfo = Object.assign({}, data, this.context)
    const success = await this.store.registerFromActionInfo(info)
    // @NOTE: it's easy to forget await store, success must be resolved value of boolean instead of Promise
    if (success === true && !this.isSelectionChanged(info.trackid)) {
      console.group('contentscript')
      console.log('--- On Selected Element Updated ---')
      console.log('selected:', this.selection)
      console.log('------------------------------------')
      console.groupEnd()

      this.updateSidebar({
        records: this.store.get(info.trackid),
        selectionChanged: ContentscriptController.SELECTION_IS_NOT_CHANGED
      }, this.responseLogger)
    }
  }

  private isSelectionChanged(trackid: TrackID): boolean {
    return this.getTrackIDFromSelection() !== trackid
  }

  private getTrackIDFromSelection(): TrackID {
    return this.selection instanceof Element ? this.selection.getAttribute('trackid') : null
  }

  private responseLogger(response: any) {
    console.group('contentscript')
    console.log('--- Response from Background---')
    console.log('response:', response)
    console.log('-------------------------------')
    console.groupEnd()
  }
}

function injectScript(container: Node, scriptText: string) {
  const script = document.createElement('script')

  script.textContent = scriptText

  container.appendChild(script)
  container.removeChild(script)
}

export default function (
  store: IActionRecordStore,
  updateSidebar: (message: Message, callback?: (response: any) => void) => void
): ContentscriptHelpers {
  const contentscriptController = new ContentscriptController(store, updateSidebar)
  const helpers = {
    messageHandler: contentscriptController.messageHandler,
    devtoolSelectionChangedHandler: contentscriptController.devtoolSelectionChangedHandler,
    injectScript
  }
  if (isTestEnv()) {
    Object.assign(helpers, { contentscriptController })
  }
  return helpers
}