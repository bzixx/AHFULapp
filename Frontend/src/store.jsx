import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import calendarReducer from "./Components/Calendar/CalendarSlicer";
import authReducer from "./Pages/Login/AuthSlice";
import settingsReducer from "./Pages/Settings/SettingsSlice";
import pullExerciseSlice from "./components/Cache/ExerciseCache/PullExerciseSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    auth: authReducer,
    setting:settingsReducer,
    pullExercise: pullExerciseSlice.reducer,
  },
});

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}