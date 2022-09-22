import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sesion: undefined
};

export const sesionSlice = createSlice({
  name: 'sesion',
  initialState,
  reducers: {
    sesion: (state, value) => {

      state.sesion = value.payload?.sesion;
      state.modal = value.payload?.modal;
      
    },
  },
  actions: {
    
  }
});

export const { sesion } = sesionSlice.actions;
export default sesionSlice.reducer;
