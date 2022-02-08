import { createAction, createReducer } from "@reduxjs/toolkit";
import { elementsState, setElementsAction, setElementsPayload } from "./type";

export const elementsAction = {
    setElements: createAction<setElementsPayload>("SETELEMENTS"),
}

const elementsInitialState: elementsState = {
    elements: [],
}

export const elementsReducer = {
    setElements: (state: elementsState, action: setElementsAction) => {
        state.elements = action.payload.elements
    }
}

export const setElementReducer = createReducer(elementsInitialState, builder => {
    builder
        .addCase(elementsAction.setElements, elementsReducer.setElements)
})