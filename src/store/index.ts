import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import quizReducer from './quizSlice';
import userReducer from './userSlice';
import resultReducer from './resultSlice';

export const store = configureStore({
  reducer: { auth: authReducer, quiz: quizReducer, users: userReducer, result: resultReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
