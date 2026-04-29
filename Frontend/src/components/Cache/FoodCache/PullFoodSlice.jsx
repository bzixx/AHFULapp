import { createSlice } from "@reduxjs/toolkit";
const pullFoodSlice = createSlice({
  name: "pullFood",
  initialState: {
    food: [],
    error: null,
  },
  reducers: {
    setFood: (state, action) => { 
      state.food = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});
export const { setFood, setError } = pullFood.actions;
export default pullFoodSlice.reducer;