import ActionRecorder from '../../private/ActionRecorder'
import {
  packActionInGivenContext,
  packActionInNonTrackingContext,
  packActionInTrackingContext
} from '../utils'

const SymbolAnim = Symbol('Animation')

class AnimationController {
  private static MAX_ANIM_NUM = 10000

  private animid = 0
  private untrackAnims: {
    [animid: number]: SourceLocation[]
  } = {}

  /* public */

  public addUntrackContextTo(element: Element) {
    const animid = element[SymbolAnim] || this.setAnimIDOnElement(element)
    const context = ActionRecorder.getRecordContext()

    if (!this.untrackAnims.hasOwnProperty(animid)) {
      this.untrackAnims[animid] = []
    }
    this.untrackAnims[animid].push(context)
  }

  public getUntrackContextFrom(element: Element): SourceLocation {
    const untrackList = this.untrackAnims[element[SymbolAnim]]
    // @NOTE: each element will animate by queueing order
    const context = untrackList.shift()

    if (untrackList.length === 0) {
      delete element[SymbolAnim]
    }
    return context
  }

  /* private */

  private setAnimIDOnElement(element: Element): number {
    return element[SymbolAnim] = (this.animid++ % AnimationController.MAX_ANIM_NUM + 1)
  }
}
export const AnimController = new AnimationController()

export function packAnimInGivenContextOnce(
  animFunc: (...args: any[]) => void,
  context: SourceLocation
): (...args: any[]) => void {
  const trackedAnimFunc =
    packActionInTrackingContext(
      packActionInGivenContext(animFunc, context)
    )
  return new Proxy(animFunc, {
    apply: function (target, thisArg, argumentList) {
      // @NOTE: when this function is called while queueing (MessageBroker is not empty),
      // it should not send any ActionContextMessage
      const result = trackedAnimFunc.apply(thisArg, argumentList)
      // const result = ActionRecorder.isRecording()
      //   ? target.apply(thisArg, argumentList)
      //   : packActionInGivenContext(target, context).apply(thisArg, argumentList)
      // @NOTE: reset animFunc and ignore already tracked actions (track only once)
      this.apply = packActionInNonTrackingContext(function (target, thisArg, argumentList) {
        return target.apply(thisArg, argumentList)
      })
      return result
    }
  })
}


