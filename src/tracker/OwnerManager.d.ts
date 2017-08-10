/// <reference path='./index.d.ts'/>
/// <reference path='./ActionStore.d.ts'/>
/// <reference path='./Owner.d.ts'/>

interface IOwnerManager {
  createShadowElement(this: IOwnerManager): Element;
  getOwner(this: IOwnerManager, target: ActionTarget): Owner;
  getTrackIDFromOwnerOf(this: IOwnerManager, target: ActionTarget): TrackID;
  hasOwner(this: IOwnerManager, target: ActionTarget): boolean;
  hasShadowOwner(this: IOwnerManager, target: ActionTarget): boolean;
  setOwner(this: IOwnerManager, target: ActionTarget, ownerElement: Element): boolean;
  setOwnerByGetter(this: IOwnerManager, target: ActionTarget, ownerGetter: (context: ActionTarget) => Element): boolean;
}