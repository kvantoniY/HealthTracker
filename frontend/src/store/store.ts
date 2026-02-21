import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
