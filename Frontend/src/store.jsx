import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import calendarReducer from "./components/Calendar/CalendarSlicer";
import authReducer from "./pages/Login/AuthSlice";
import settingsReducer from "./pages/Settings/SettingsSlice";
import pullExerciseReducer from "./components/Cache/ExerciseCache/PullExerciseSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    auth: authReducer,
    setting: settingsReducer,
    pullExercise: pullExerciseReducer,
  },
});

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}