import { createSlice } from "@reduxjs/toolkit";
const pullExerciseSlice = createSlice({
  name: "pullExercise",
  initialState: {
    personalExercises: [],
    error: null,
  },
  reducers: { 
    setPersonalExercises: (state, action) => {
      state.personalExercises = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});
export const { setPersonalExercises, setError } = pullExerciseSlice.actions;
export default pullExerciseSlice.reducer;