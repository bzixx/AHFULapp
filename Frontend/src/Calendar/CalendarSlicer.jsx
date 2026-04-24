import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  selectedDate: null,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate=action.payload;
    },
        clearSelectedDate: (state) => {
            state.selectedDate = null;
    },
}});

export const {setSelectedDate, clearSelectedDate} = calendarSlice.actions;
export default calendarSlice.reducer;