import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import calendarReducer from "./components/Calendar/CalendarSlicer";
import authReducer from "./pages/Login/AuthSlice";
import settingsReducer from "./pages/Settings/SettingsSlice";
import pullExerciseReducer from "./components/Cache/ExerciseCache/PullExerciseSlice";
import pullTemplateReducer from "./components/Cache/TemplateCache/PullTemplateSlice";
import pullWorkoutReducer from "./components/Cache/WorkoutCache/PullWorkoutSlice";
import pullPersonalExerciseReducer from "./components/Cache/PersonalExerciseCache/PersonalExerciseSlice";

const persistExerciseConfig = {
  key: "pullExercise",
  storage,
};

const persistTemplateConfig = {
  key: "pullTemplate",
  storage,
};

const persistWorkoutConfig = {
  key: "pullWorkout",
  storage,
};
const persistCalendarConfig = {
  key: "calendar",
  storage,
};
const persistPersonalExerciseConfig = {
  key: "pullPersonalExercise",
  storage,
};

const persistedPullExerciseReducer = persistReducer(persistExerciseConfig, pullExerciseReducer);
const persistedPullTemplateReducer = persistReducer(persistTemplateConfig, pullTemplateReducer);
const persistedPullWorkoutReducer = persistReducer(persistWorkoutConfig, pullWorkoutReducer);
const persistedCalendarReducer = persistReducer(persistCalendarConfig, calendarReducer);
const persistedPersonalExerciseReducer = persistReducer(persistPersonalExerciseConfig, pullPersonalExerciseReducer);

export const store = configureStore({
  reducer: {
    calendar: persistedCalendarReducer,
    auth: authReducer,
    setting: settingsReducer,
    pullExercise: persistedPullExerciseReducer,
    pullTemplate: persistedPullTemplateReducer,
    pullWorkout: persistedPullWorkoutReducer,
    pullPersonalExercise: persistedPersonalExerciseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}