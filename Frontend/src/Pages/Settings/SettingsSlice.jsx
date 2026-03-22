import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeTab: "personal",
    theme: "Light",
    goals: "Lose Fat",
    shame: "Off",
    units: "Imperial",
    gender: "",
    pronouns: "",
    dateOfBirth: "",
    locations: [],
    equipment: "None",
    experience: "Beginner",
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
