import { createSlice } from "@reduxjs/toolkit";


export const settingSlice = createSlice({
    name: "setting",
    initialState: {
        theme: "Light", // default to light theme
        units: "Imperial",
        goals: "Maintain",
        shame: "Off",
        equipment: [],
        gender: "",
        pronouns: "",
        dateOfBirth: "",
        locations: [],
        tutorialComplete: false,
        timezone: "EST",
    },
    reducers: {
    updateSetting: (state, action) => {
        const { key, value } = action.payload;
        state[key] = value;
    },
    setSettings: (state, action) => {
        return { ...state, ...action.payload };
    },
    }
});

export const { updateSetting, setSettings } = settingSlice.actions;
export default settingSlice.reducer;
