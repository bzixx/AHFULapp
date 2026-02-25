import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import calendarReducer from "./Components/Calendar/CalendarSlicer";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}