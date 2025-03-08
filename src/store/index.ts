import { configureStore } from '@reduxjs/toolkit';
import iframeEditingReducer from './iframe-editing-slice';

export const store = configureStore({
  reducer: {
    iframeEditing: iframeEditingReducer,
    // outros slices aqui...
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
