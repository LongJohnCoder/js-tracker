/// <reference path='../public/ActionStore.d.ts'/>

interface Owner {
  getTrackID(): TrackID;
  getOwnerElement(): Element;
  hasTrackID(): boolean;
  isShadow(): boolean;
  setTrackID(): void;
}