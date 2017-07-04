type Target =
  'HTMLElement'
  | 'Element'
  | 'Node'
  | 'EventTarget'
  | 'Attr' // attr (e.g. attributes[0])
  | 'CSSStyleDeclaration' // style
  | 'DOMStringMap' // dataset
  | 'DOMTokenList' // classList
  | 'NamedNodeMap' // attributes

type Action = PropertyKey

type ActionTarget =
  HTMLElement
  | SVGElement
  | Element
  | Attr
  | CSSStyleDeclaration
  | DOMStringMap
  | DOMTokenList
  | NamedNodeMap

interface Owner {
  _trackid: string;
  _isShadow: boolean;
}

interface IActionTarget {
  _owner: Owner;
}

type ActionInfo = {
  trackid: string,
  target: Target,
  action: Action,
  stacktrace: StackTrace.StackFrame[],
  actionTag?: string,
  merge?: string
}

type ActionRecord = {
}

/**
 * Extend Native Interfaces
 */

interface SVGElement {
  // @TODO: pull request to typescript repo
  readonly dataset: DOMStringMap
}
interface Element extends Owner, IActionTarget { }
interface Attr extends IActionTarget { }
interface CSSStyleDeclaration extends IActionTarget { }
interface DOMStringMap extends IActionTarget {
  // @NOTE: bypass index signature of DOMStringMap in typescript/lib/lib.es6.d.ts
  _owner: any
}
interface DOMTokenList extends IActionTarget {
  _which: string;
}
interface NamedNodeMap extends IActionTarget { }