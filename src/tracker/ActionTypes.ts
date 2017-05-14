// HTMLElement -> Element (ChildNode) -> Node -> EventTarget
// categories: attribute, behavior, event, node, style
// attributes, classList, (dataset, style) proxy only
export enum ActionTypes {
  Attribute = 1 << 0,
  Behavior = 1 << 1,
  Event = 1 << 2,
  Node = 1 << 3,
  Style = 1 << 4
}
const Attribute = ActionTypes.Attribute
const Behavior = ActionTypes.Behavior
const Event = ActionTypes.Event
const Node = ActionTypes.Node
const Style = ActionTypes.Style
// @NOTE: 
//    those actions whose type determined by argument or property
//    (1) Element.attributes methods (e.g. setAttribute, removeAttribute)
//    (2) Attr value setter
const attrTypesMap: object = {
  'class': Style,
  'style': Style,
  'default': Attribute
}
// @NOTE:
//    those actions whose type determined by caller object
//    (1) classList -> Style
//    (2) others -> Attribute
const domTokenListTypesMap: object = {
  'classList': Style,
  'default': Attribute
}
export const ActionTypesMap: {
  'HTMLElement': object,
  'Element': object,
  'Node': object,
  'EventTarget': object,
  'Attr': object, // attr (e.g. attributes[0])
  'CSSStyleDeclaration': object, // style
  'DOMStringMap': object, // dataset
  'DOMTokenList': object, // classList
  'NamedNodeMap': object, // attributes
} = {
    'HTMLElement': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLElement

      /* special cases */

      // dataset: Attribute
      // style: Style


      /* properties */

      'accessKey': Attribute,
      'contentEditable': Attribute,
      'dir': Attribute,
      'draggable': Attribute,
      'hidden': Attribute,
      'innerText': Node,
      'lang': Attribute,
      'outerText': Node,
      'spellcheck': Attribute,
      'tabIndex': Attribute,
      'title': Attribute,
      'translate': Attribute,

      'onabort': Event,
      'onanimationcancel': Event,
      'onanimationend': Event,
      'onanimationiteration': Event,
      'onauxclick': Event,
      'onblur': Event,
      'oncancel': Event,
      'oncanplay': Event,
      'oncanplaythrough': Event,
      'onchange': Event,
      'onclick': Event,
      'onclose': Event,
      'oncontextmenu': Event,
      'oncopy': Event,
      'oncuechange': Event,
      'oncut': Event,
      'ondblclick': Event,
      'ondrag': Event,
      'ondragend': Event,
      'ondragenter': Event,
      'ondragleave': Event,
      'ondragover': Event,
      'ondragstart': Event,
      'ondrop': Event,
      'ondurationchange': Event,
      'onemptied': Event,
      'onended': Event,
      'onerror': Event,
      'onfocus': Event,
      'ongotpointercapture': Event,
      'oninput': Event,
      'oninvalid': Event,
      'onkeydown': Event,
      'onkeypress': Event,
      'onkeyup': Event,
      'onload': Event,
      'onloadeddata': Event,
      'onloadedmetadata': Event,
      'onloadend': Event,
      'onloadstart': Event,
      'onlostpointercapture': Event,
      'onmousedown': Event,
      'onmouseenter': Event,
      'onmouseleave': Event,
      'onmousemove': Event,
      'onmouseout': Event,
      'onmouseover': Event,
      'onmouseup': Event,
      'onmousewheel': Event,
      'onpause': Event,
      'onplay': Event,
      'onplaying': Event,
      'onprogress': Event,
      'onpaste': Event,
      'onpointercancel': Event,
      'onpointerdown': Event,
      'onpointerenter': Event,
      'onpointerleave': Event,
      'onpointermove': Event,
      'onpointerout': Event,
      'onpointerover': Event,
      'onpointerup': Event,
      'onratechange': Event,
      'onreset': Event,
      'onresize': Event,
      'onscroll': Event,
      'onseeked': Event,
      'onseeking': Event,
      'onselect': Event,
      'onselectionchange': Event,
      'onselectstart': Event,
      'onshow': Event,
      'onstalled': Event,
      'onsubmit': Event,
      'onsuspend': Event,
      'ontimeupdate': Event,
      'ontoggle': Event,
      'ontouchcancel': Event,
      'ontouchmove': Event,
      'ontouchstart': Event,
      'ontransitioncancel': Event,
      'ontransitionend': Event,
      'onvolumechange': Event,
      'onwaiting': Event,

      /* methods */

      'blur': Behavior,
      'click': Behavior,
      'focus': Behavior,
      'forceSpellCheck': Behavior,
    },
    'Element': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/Element

      /* special cases */

      // attributes: Attribute
      // classList: Style

      /* properties */

      'id': Attribute,
      'name': Attribute,
      'slot': Attribute,

      'scrollTop': Behavior,
      'scrollLeft': Behavior,

      'onbeforecopy': Event,
      'onbeforecut': Event,
      'onbeforepaste': Event,
      'oncopy': Event,
      'oncut': Event,
      'onpaste': Event,
      'onsearch': Event,
      'onselectstart': Event,
      'onwheel': Event,
      'onwebkitfullscreenchange': Event,
      'onwebkitfullscreenerror': Event,

      'innerHTML': Node,
      'outerHTML': Node,

      'className': Style,

      /* methods */

      'removeAttribute': attrTypesMap,
      'removeAttributeNode': attrTypesMap,
      'removeAttributeNS': attrTypesMap,
      'setAttribute': attrTypesMap,
      'setAttributeNode': attrTypesMap,
      'setAttributeNodeNS': attrTypesMap,
      'setAttributeNS': attrTypesMap,

      'scrollIntoView': Behavior,

      'append': Node,
      'attachShadow': Node,
      'insertAdjacentElement': Node,
      'insertAdjacentHTML': Node,
      'insertAdjacentText': Node,
      'prepend': Node,

      // ChildNode https://developer.mozilla.org/zh-TW/docs/Web/API/ChildNode
      // Chrome sets these methods in Element
      'remove': Node,
      'before': Node,
      'after': Node,
      'replaceWith': Node,

      'animate': Style
    },
    'Node': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/Node

      /* properties */

      'nodeValue': Attribute,

      'textContent': Node,
      'innerText': Node,

      /* methods */

      'appendChild': Node,
      'insertBefore': Node,
      'normalize': Node, // [https://developer.mozilla.org/zh-TW/docs/Web/API/Node/normalize] The Node.normalize() method puts the specified node and all of its sub-tree into a 'normalized' form. In a normalized sub-tree, no text nodes in the sub-tree are empty and there are no adjacent text nodes.
      'removeChild': Node,
      'replaceChild': Node,
    },
    'EventTarget': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/EventTarget

      /* methods */

      'addEventListener': Event,
      'dispatchEvent': Event,
      'removeEventListener': Event,
    },
    'Attr': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/Attr

      /* properties */

      'value': attrTypesMap
    },
    'CSSStyleDeclaration': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/CSSStyleDeclaration

      /* methods */

      'removeProperty': Style,
      'setProperty': Style
    },
    'DOMStringMap': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/DOMStringMap
    },
    'DOMTokenList': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/DOMTokenList

      /* properties */

      'value': domTokenListTypesMap,

      /* methods */

      'add': domTokenListTypesMap,
      'remove': domTokenListTypesMap,
      'replace': domTokenListTypesMap,
      'toggle': domTokenListTypesMap
    },
    'NamedNodeMap': {
      // https://developer.mozilla.org/zh-TW/docs/Web/API/NamedNodeMap

      /* methods */

      'setNamedItem': attrTypesMap,
      'removeNamedItem': attrTypesMap,
      'setNamedItemNS': attrTypesMap,
      'removeNamedItemNS': attrTypesMap
    },
  }
export const Utils: {
  isSimpleActionType(actionTypesMap: object, prop: string): boolean;
  isMethodDescriptor(descriptor: PropertyDescriptor): boolean;
  isWritableDescriptor(descriptor: PropertyDescriptor): boolean;
} = {
    isSimpleActionType(actionTypesMap, prop) {
      return actionTypesMap.hasOwnProperty(prop) && Number.isInteger(actionTypesMap[prop])
    },
    isMethodDescriptor(descriptor) {
      return !!descriptor.value && typeof descriptor.value === 'function'
    },
    isWritableDescriptor(descriptor) {
      return !!descriptor.set
    }
  }
