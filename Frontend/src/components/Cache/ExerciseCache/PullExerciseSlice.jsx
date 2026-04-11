import { createSlice } from "@reduxjs/toolkit";
const pullExerciseSlice = createSlice({
  name: "pullExercise",
  initialState: {
    exercises: [],
    error: null,
  },
  reducers: {
    setExercises: (state, action) => { 
      state.exercises = action.payload;
    },
    addExercises: (state, action) => { 
      state.exercises.push(action.payload);
    },
    removeExercises: (state, action) => {
      state.exercises = state.exercises.filter(post => post.id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});
export const { setExercises, addExercises, removeExercises, setError } = pullExerciseSlice.actions;
export default pullExerciseSlice.reducer;