import { configureStore } from '@reduxjs/toolkit';
import demoReducer from '../features/demo/demo-slice';

export const store = configureStore({
  reducer: {
    demo: demoReducer,
    // Outros slices podem ser adicionados aqui
  },
});

// Tipos para uso com hooks (useDispatch, useSelector)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
