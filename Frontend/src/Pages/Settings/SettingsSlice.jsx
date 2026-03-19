import { createSlice } from "@reduxjs/toolkit";
// Will be removed later when I add pulling from backend to AuthRouteChecker or a different hook
const initialState = {
    activeTab: "personal",
    theme: "Light",
    goals: "Lose Fat",
    shame: "Off",
    location: "",
    units: "Imperial",
    email: "",
    dob: "",
    gender: "Male",
    experience: "Beginner",
    equipment: "None",
    warmup: "On",
    rest: "On"
};

export const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
    updateSetting: (state, action) => {
        const { key, value } = action.payload;
        state[key] = value;
    },
    setSettings: (state, action) => {
        return { ...state, ...action.payload };
    },
        resetSettings: () => initialState
    }
});

export const { updateSetting, setSettings, resetSettings } = settingSlice.actions;
export default settingSlice.reducer;