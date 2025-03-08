import { configureStore } from '@reduxjs/toolkit';
import iframeEditingReducer from './iframe-editing.slice';
import demoReducer from './demo.slice';
import homeReducer from './home.slice';

export const store = configureStore({
  reducer: {
    iframeEditing: iframeEditingReducer,
    demo: demoReducer,
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
