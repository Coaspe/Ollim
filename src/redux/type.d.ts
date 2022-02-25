import { Elements } from "react-flow-renderer";
import { alarmType, getFirestoreUser, toObjectElements } from "../type";

interface elementsState {
    elements: Elements;
}
interface setElementsPayload {
    elements: Elements
}
interface setElementsAction {
    payload: setElementsPayload
}


interface userInfoState {
    userInfo: getFirestoreUser;
}

interface setUserInfoPayload {
    userInfo: getFirestoreUser
}

interface setUserInfoAction {
    payload: setUserInfoPayload
}

interface diagramState {
    diagram: toObjectElements;
}
interface setDiagramPayload {
    diagram: toObjectElements
}
interface setDiagramAction {
    payload: setDiagramPayload
}

interface alarmState {
    alarm: [string, alarmType, boolean];
}
interface setAlarmPayload {
    alarm: [string, alarmType, boolean]
}
interface setAlarmAction {
    payload: setAlarmPayload
}

interface alarmTimerState {
    timer: NodeJS.Timeout | null
}
interface setAlarmTimerPayload {
    timer: NodeJS.Timeout | null
}
interface setAlarmTimerAction {
    payload: setAlarmTimerPayload
}

