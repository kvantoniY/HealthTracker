import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/users/usersSlice';
import { postsReducer } from './slices/posts/postsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
      posts: postsReducer
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(/* rtk-query если используешь */),
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];