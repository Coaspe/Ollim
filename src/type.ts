import { Elements } from "react-flow-renderer";
export type bgColorType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type disclosure = "PUBLIC" | "PRIVATE" | "FOLLOWERS";
export type page = "MAIN" | "DIAGRAM";
export type genre = "SCENARIO" | "POEM" | "NOVEL";
export type tableType = "OVERVIEW" | "WRITE" | "SETTING" | "BROWSE";
export type contestTableType = "OVERVIEW" | "BROWSE" | "VOTE" | "SETTING";
export type gerneType = "NOVEL" | "POEM" | "SCENARIO";
export type gerneDocIDType = "novelDocID" | "poemDocID" | "scenarioDocID";
export type alarmType = "error" | "warning" | "info" | "success";
export type contestType = "HOST" | "PARTICIPATION" | "TOTAL";
export type medal = "GOLD" | "SILVER" | "BRONZE";
export type AlarmMap = Map<string, getFirestoreAlarmType>
export type alarmCategory =
  | "ADDCOMMENT"
  | "FOLLOWING"
  | "NEWWRITING"
  | "RANKIN"
  | "NEWCOMMIT";
export type rankInType =
  | "NEW"
  | "THIRDTOSECOND"
  | "SECONDTOFIRST"
  | "THIRDTOFIRST";
export type totalAlarmType =
  | alarmNewCommit
  | alarmRankInInfo
  | alarmCommitInfo
  | alarmAddCommentInfo
  | alarmFollowingInfo
  | alarmAddWritingInfo;

export type alarmNewCommit = {
  writingTitle: string;
  writingDocID: string;
  writingOwnerUID: string;
  writingOwnerUsername: string;
};
export type alarmRankInInfo = {
  rankedInWritingTitle: string;
  type: rankInType;
};
export type alarmCommitInfo = {
  commitKey: number;
  writingDocID: string;
  writingTitle: string;
  writingOwnerUID: string;
};
export type alarmAddCommentInfo = {
  commentDocID: string;
  commentUserUID: string;
  commentUsername: string;
  writingOwnerUID: string;
  writingDocID: string;
  writingTitle: string;
};
export type alarmFollowingInfo = {
  followingUserUID: string;
  followingUsername: string;
};
export type alarmAddWritingInfo = {
  writingDocID: string;
  writingTitle: string;
  writingOwnerUID: string;
  writingOwnerUsername: string;
};
export type getFirestoreUser = {
  dateCreated: number;
  followers: Array<string>;
  followings: Array<string>;
  profileCaption: string;
  profileImg: string;
  uid: string;
  userEmail: string;
  username: string;
  writingDocID: Array<string>;
  contestAuth: boolean;
  contests: Array<string>;
};
export type submissionTableType = "MAIN" | "";
export type getFirestoreAlarmType = {
  category: alarmCategory;
  dateCreated: number;
  seen: boolean;
  key: string;
  info:
  | alarmAddCommentInfo
  | alarmFollowingInfo
  | alarmAddWritingInfo
  | alarmRankInInfo;
};

export type getFirestoreUserWritings = {
  novelDocID: Array<string>;
  poemDocID: Array<string>;
  scenarioDocID: Array<string>;
  totalCommits: { [key: number]: string };
};

export type toObjectElements = {
  elements: Elements;
  position: [number, number];
  zoom: number;
  changed?: boolean;
};
export type commitType = { [key: number]: { contents: string; memo: string } };

export type collectionType = {
  [collectionNum: number]: {
    commits: [];
    tempSave: {};
    title: string;
  };
};

export type addWritingArg = {
  collection: collectionType;
  isCollection: boolean;
  userEmail: string;
  synopsis: string;
  title: string;
  userUID: string;
  diagram?: toObjectElements;
  disclosure: string;
  writingUID?: string;
};
export interface addContestArg {
  limitNumOfPeople: number;
  title: string;
  genre: genre;
  description: string;
  hostUID: string;
  hostEmail: string;
  deadline: string;
  writings: { [key: string]: contestWriting };
  dateCreated: number;
  whoVoted: { [key: string]: string };
  prize: Array<contestWriting>;
}
export interface getFirestoreContest extends addContestArg {
  contestDocID: string;
}
export type contestWriting = {
  writingDocID: string;
  updateDate: number;
  vote: number;
  synopsis: string;
  title: string;
  collectionTitle?: string;
  userUID: string;
};
export type getFirestoreWriting = {
  collection: collectionType;
  dateCreated: number;
  diagram?: toObjectElements;
  done: boolean;
  killingVerse: Array<string>;
  synopsis: string;
  title: string;
  userEmail: string;
  userUID: string;
  genre: string;
  writingDocID: string;
  disclosure: disclosure;
  memo: string;
  likes: string[];
  isCollection: boolean;
  bgm?: string;
  duplicatedForContest?: boolean;
};
export type contentType = {
  type: string;
  children: {
    type: string;
    text: string;
    fontSize: number;
    fontStyle: string;
  }[];
};

export interface commentType {
  content: string;
  likes: string[];
  commentOwnerUID: string;
  docID: string;
  dateCreated: number;
  replies: { [key: number]: string };
}

export type editorValue = {
  type: string;
  children: {
    type: string;
    text: string;
    fontSize: number;
    fontStyle: string;
  }[];
};
export type leftPartType = "INTRO" | "LOGIN" | "SIGNUP";