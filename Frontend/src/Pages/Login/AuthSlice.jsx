import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    authLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    authLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});
  
export const { authLogin, authLogout } = authSlice.actions;
export default authSlice.reducer;