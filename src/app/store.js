import { configureStore } from '@reduxjs/toolkit';
import sesionSlice from '../features/sesion/sesionSlice';
import contractSlice from '../features/contract/contractSlice';

export const store = configureStore({
  reducer: {
    sesion: sesionSlice,
    contract: contractSlice
  },
});
