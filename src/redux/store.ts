import { configureStore } from "@reduxjs/toolkit";
import {
  setAlarmReducer,
  setAlarmTimerReducer,
  setDiagramReducer,
  setElementReducer,
  setIsFullScreenReducer,
  setUserInfoReducer,
  setWidthSizeReducer,
} from ".";

export const store = configureStore({
  reducer: {
    setElements: setElementReducer,
    setUserInfo: setUserInfoReducer,
    setDiagram: setDiagramReducer,
    setAlarm: setAlarmReducer,
    setAlarmTimer: setAlarmTimerReducer,
    setIsFullScreen: setIsFullScreenReducer,
    setWidthSize: setWidthSizeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
