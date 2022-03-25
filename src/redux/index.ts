import { createAction, createReducer } from "@reduxjs/toolkit";
import { getFirestoreUser, toObjectElements } from "../type";
import {
  elementsState,
  setElementsAction,
  setElementsPayload,
  setUserInfoPayload,
  userInfoState,
  setUserInfoAction,
  diagramState,
  setDiagramAction,
  setDiagramPayload,
  alarmState,
  setAlarmPayload,
  setAlarmAction,
  setAlarmTimerPayload,
  alarmTimerState,
  setAlarmTimerAction,
  setIsFullScreenAction,
  isFullScreenState,
  setIsFullScreenPayload,
  setWidthSizePayload,
  widthSizeState,
  setWidthSizeAction,
} from "./type";

export const elementsAction = {
  setElements: createAction<setElementsPayload>("SETELEMENTS"),
};

const elementsInitialState: elementsState = {
  elements: [],
};

export const elementsReducer = {
  setElements: (state: elementsState, action: setElementsAction) => {
    state.elements = action.payload.elements;
  },
};

export const setElementReducer = createReducer(
  elementsInitialState,
  (builder) => {
    builder.addCase(elementsAction.setElements, elementsReducer.setElements);
  }
);

export const userInfoAction = {
  setUserInfo: createAction<setUserInfoPayload>("SETUSERINFO"),
};
const userInfoInitialState: userInfoState = {
  userInfo: {} as getFirestoreUser,
};
export const userInfoReducer = {
  setUserInfo: (state: userInfoState, action: setUserInfoAction) => {
    state.userInfo = action.payload.userInfo;
  },
};
export const setUserInfoReducer = createReducer(
  userInfoInitialState,
  (builder) => {
    builder.addCase(userInfoAction.setUserInfo, userInfoReducer.setUserInfo);
  }
);

export const diagramAction = {
  setDiagram: createAction<setDiagramPayload>("SETDIAGRAM"),
};
const diagramInitialState: diagramState = {
  diagram: {} as toObjectElements,
};
export const diagramReducer = {
  setDiagram: (state: diagramState, action: setDiagramAction) => {
    state.diagram = action.payload.diagram;
  },
};
export const setDiagramReducer = createReducer(
  diagramInitialState,
  (builder) => {
    builder.addCase(diagramAction.setDiagram, diagramReducer.setDiagram);
  }
);

export const alarmAction = {
  setAlarm: createAction<setAlarmPayload>("SETALARM"),
};
const alarmInitialState: alarmState = {
  alarm: ["", "success", false],
};
export const alarmReducer = {
  setAlarm: (state: alarmState, action: setAlarmAction) => {
    state.alarm = action.payload.alarm;
  },
};
export const setAlarmReducer = createReducer(alarmInitialState, (builder) => {
  builder.addCase(alarmAction.setAlarm, alarmReducer.setAlarm);
});

export const alarmTimerAction = {
  setAlarmTimer: createAction<setAlarmTimerPayload>("SETALARMTIMER"),
};
const alarmTimerInitialState: alarmTimerState = {
  timer: null,
};
export const alarmTimerReducer = {
  setAlarmTimer: (state: alarmTimerState, action: setAlarmTimerAction) => {
    state.timer = action.payload.timer;
  },
};
export const setAlarmTimerReducer = createReducer(
  alarmTimerInitialState,
  (builder) => {
    builder.addCase(
      alarmTimerAction.setAlarmTimer,
      alarmTimerReducer.setAlarmTimer
    );
  }
);

export const isFullScreenAction = {
  setIsFullScreen: createAction<setIsFullScreenPayload>("SETISFULLSCREEN"),
};
const isFullScreenInitialState: isFullScreenState = {
  isFullScreen: false,
};
export const isFullScreenReducer = {
  setIsFullScreen: (
    state: isFullScreenState,
    action: setIsFullScreenAction
  ) => {
    state.isFullScreen = action.payload.isFullScreen;
  },
};
export const setIsFullScreenReducer = createReducer(
  isFullScreenInitialState,
  (builder) => {
    builder.addCase(
      isFullScreenAction.setIsFullScreen,
      isFullScreenReducer.setIsFullScreen
    );
  }
);

export const widthSizeAction = {
  setWidthSize: createAction<setWidthSizePayload>("SETWIDTHSIZE"),
};
const widthSizeInitialState: widthSizeState = {
  widthSize: window.innerWidth,
};
export const widthSizeReducer = {
  setWidthSize: (state: widthSizeState, action: setWidthSizeAction) => {
    state.widthSize = action.payload.widthSize;
  },
};
export const setWidthSizeReducer = createReducer(
  widthSizeInitialState,
  (builder) => {
    builder.addCase(
      widthSizeAction.setWidthSize,
      widthSizeReducer.setWidthSize
    );
  }
);
