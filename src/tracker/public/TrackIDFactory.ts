/// <reference path='./TrackIDFactory.d.ts'/>

class TrackIDFactory implements ITrackIDFactory {
  private trackid

  constructor() {
    this.trackid = 0
  }

  /* public */

  public generateNullID() {
    return 'Track_ID_Does_Not_Exist'
  }

  /* private */

  private generateID() {
    return (++this.trackid).toString()
  }

  private resetID() {
    this.trackid = 0
  }
}
// @NOTE: TrackIDFactory is a singleton
export default new TrackIDFactory()

