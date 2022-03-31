import { Elements } from "react-flow-renderer";
export type disclosure = "PUBLIC" | "PRIVATE" | "FOLLOWERS";
export type page = "MAIN" | "DIAGRAM";
export type genre = "SCENARIO" | "POEM" | "NOVEL";
export type tableType = "OVERVIEW" | "WRITE" | "SETTING" | "BROWSE";
export type gerneType = "NOVEL" | "POEM" | "SCENARIO";
export type alarmType = "error" | "warning" | "info" | "success";
export type contestType = "HOST" | "PARTICIPATION" | "TOTAL";
export type alarmCategory = "ADDCOMMENT" | "FOLLOWING" | "NEWWRITING";
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

export type getFirestoreAlarmType = {
  category: alarmCategory;
  dateCreated: number;
  seen: boolean;
  key: string;
  info?: alarmAddCommentInfo | alarmFollowingInfo | alarmAddWritingInfo;
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
  hostEmail: string;
  deadline: string;
  writings: { [key: string]: { writingDocID: string; updateDate: number } };
  dateCreated: number;
}
export interface getFirestoreContest extends addContestArg {
  contestDocID: string;
}
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

export type medal = "GOLD" | "SILVER" | "BRONZE";
