/// <reference path='./ActionType.d.ts'/>
/// <reference path='./TrackIDFactory.d.ts'/>
/// <reference path='../private/ActionMap.d.ts'/>

type ActionInfo = {
  trackid: TrackID,
  type: ActionType,
  loc: SourceLocation,
  merge?: TrackID,
}

type SourceLocation = {
  scriptUrl: string;
  lineNumber: number;
  columnNumber: number;
}

type ActionRecord = {
  key: string;
  type: ActionType;
  source: Source;
}

type Source = {
  loc: SourceLocation;
  code: string;
}

interface IActionStore {
  get(
    trackid: TrackID
  ): ActionRecord[];

  registerFromActionInfo(
    info: ActionInfo
  ): Promise<boolean>;
}