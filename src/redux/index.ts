import { createAction, createReducer } from "@reduxjs/toolkit";
import { getFirestoreUser, toObjectElements } from "../type";
import { elementsState, setElementsAction, setElementsPayload, setUserInfoPayload, userInfoState, setUserInfoAction, diagramState, setDiagramAction, setDiagramPayload } from "./type";

export const elementsAction = {
    setElements: createAction<setElementsPayload>("SETELEMENTS"),
}

const elementsInitialState: elementsState = {
    elements: [],
}

export const elementsReducer = {
    setElements: (state: elementsState, action: setElementsAction) => {
        state.elements = action.payload.elements
    },
}

export const setElementReducer = createReducer(elementsInitialState, builder => {
    builder
        .addCase(elementsAction.setElements, elementsReducer.setElements)
})

export const userInfoAction = {
    setUserInfo: createAction<setUserInfoPayload>("SETUSERINFO"),
}
const userInfoInitialState: userInfoState = {
    userInfo: {} as getFirestoreUser
}
export const userInfoReducer = {
    setUserInfo: (state: userInfoState, action: setUserInfoAction) => {
        state.userInfo = action.payload.userInfo
    }
}
export const setUserInfoReducer = createReducer(userInfoInitialState, builder => {
    builder
        .addCase(userInfoAction.setUserInfo, userInfoReducer.setUserInfo)
})

export const diagramAction = {
    setDiagram: createAction<setDiagramPayload>("SETDIAGRAM"),
}
const diagramInitialState: diagramState = {
    diagram: {} as toObjectElements
}
export const diagramReducer = {
    setDiagram: (state: diagramState, action: setDiagramAction) => {
        state.diagram = action.payload.diagram
    }
}
export const setDiagramReducer = createReducer(diagramInitialState, builder => {
    builder
        .addCase(diagramAction.setDiagram, diagramReducer.setDiagram)
})
