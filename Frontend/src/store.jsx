import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import calendarReducer from "./Components/Calendar/CalendarSlicer";
import authReducer from "./Pages/Login/AuthSlicer";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    auth: authReducer,
  },
});

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}