import { configureStore } from '@reduxjs/toolkit';
import iframeEditingReducer from './iframe-editing-slice';
import demoReducer from './demo.slice';

export const store = configureStore({
  reducer: {
    iframeEditing: iframeEditingReducer,
    demo: demoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
