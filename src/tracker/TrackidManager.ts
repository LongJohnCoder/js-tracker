/// <reference path='./TrackidManager.d.ts' />

export default class implements ITrackidManager {
  private trackid = 0

  resetID() {
    this.trackid = 0
  }
  generateID() {
    return (++this.trackid).toString()
  }
}
