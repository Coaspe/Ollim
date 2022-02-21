import { Elements } from "react-flow-renderer";
import { getFirestoreUser, toObjectElements } from "../type";

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



