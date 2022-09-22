import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contract: []
};

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    contract: (state, value) => {
      state.contract.push(value);
    },
  },
  actions: {
    
  }
});

export const { contract } = contractSlice.actions;
export default contractSlice.reducer;