import { Elements } from "react-flow-renderer";

interface elementsState {
    elements: Elements;
}

interface setElementsPayload {
    elements: Elements
}

interface setElementsAction {
    payload: setElementsPayload
}
