import { Elements } from "react-flow-renderer"
export type disclosure = "PUBLIC" | "PRIVATE" | "FOLLOWERS"
export type page = "MAIN" | "DIAGRAM"
export type genre = "SCENARIO" | "POEM" | "NOVEL"
export type writingType = getFirestorePoem | getFirestoreNovel | getFirestoreScenario
export type tableType = "OVERVIEW" | "WRITE" | "SETTING" |"BROWSE"
export type gerneType = "NOVEL" | "POEM" | "SCENARIO"
export type alarmType = "error" | "warning" | "info" | "success"
export type getFirestoreUser = {
    dateCreated: number
    followers: Array<string>
    followering: Array<string>
    profileCaption: string
    profileImg: string
    uid: string
    userEmail: string
    username: string
    writingDocID: Array<string>
}

export type getFirestoreUserWritings = {
    novelDocID: Array<string>
    poemDocID: Array<string>
    scenarioDocID: Array<string>
    totalCommits: {[key:number] : string}
}

export type toObjectElements = {
  elements: Elements,
  position: [number, number],
  zoom: number,
  changed?: boolean
}

export type addNovelScenarioArg = {
  userEmail: string
  synopsis: string
  title: string
  userUID: string
  diagram: toObjectElements
  disclosure: string
}

export type addPoemArg = {
  userEmail: string
  title: string
  opening: string
  userUID: string
  disclosure: string
}

export type getFirestorePoem = {
  commits: [{ [key: number]: { contents: string, memo: string } } ]
  dateCreated: number
  done: boolean
  killingVerser: Array<string>
  opening: string
  tempSave: {contents: contentType[], date:number}
  title: string
  userEmail: string
  userUID: string
  genre: string
  id: string
  disclosure: disclosure
}
export type getFirestoreNovel = {
  commits: [{ [key: number]: { contents: string, memo: string } } ]
  dateCreated: number
  diagram: toObjectElements
  done: boolean
  killingVerser: Array<string>
  synopsis: string
  tempSave: {contents: contentType[], date:number}
  title: string
  userEmail: string
  userUID: string
  genre: string
  id: string
  disclosure: disclosure
}
export type getFirestoreScenario = {
  commits: [{ [key: number]: { contents: string, memo: string } } ]
  dateCreated: number
  diagram: toObjectElements
  done: boolean
  killingVerser: Array<string>
  synopsis: string
  tempSave: {contents: contentType[], date:number}
  title: string
  userEmail: string
  userUID: string
  genre: string
  id: string
  disclosure: disclosure
}
export type contentType = {
    type: string;
    children: {
        type: string;
        text: string;
        fontSize: number;
        fontStyle: string;
    }[];
}