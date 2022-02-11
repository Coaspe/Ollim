import { configureStore } from '@reduxjs/toolkit'
import { setDiagramReducer, setElementReducer, setUserInfoReducer } from '.'

export const store = configureStore({
    reducer: {
    setElements: setElementReducer,
    setUserInfo: setUserInfoReducer,
    setDiagram: setDiagramReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch