import { Elements } from "react-flow-renderer";
export type disclosure = "PUBLIC" | "PRIVATE" | "FOLLOWERS";
export type page = "MAIN" | "DIAGRAM";
export type genre = "SCENARIO" | "POEM" | "NOVEL";
export type tableType = "OVERVIEW" | "WRITE" | "SETTING" | "BROWSE";
export type gerneType = "NOVEL" | "POEM" | "SCENARIO";
export type alarmType = "error" | "warning" | "info" | "success";

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
    commits: [{ [key: number]: { contents: string; memo: string } }];
    tempSave: { contents: contentType[]; date: number };
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
