import { createSlice } from "@reduxjs/toolkit";

// userChannelSlice for tracking user channel
const userChannelSlice = createSlice({
    name: "userChannel", // Name of the slice
    initialState: {
        userChannelDetails: {}, // Initial state with empty userChannelDetails
    },
    reducers: {
        setUserChannelDetails: (state, action) => {
            console.log("User channel details:", action.payload); // Logging the payload
            state.userChannelDetails = action.payload; // Directly assign payload to userChannelDetails
        },
        clearUserChannelDetails: (state) => {
            state.userChannelDetails = {}; // Clear userChannelDetails
        },
    }
});

// Exporting default reducer
export default userChannelSlice.reducer;

// Named exporting reducer functions
export const { setUserChannelDetails, clearUserChannelDetails } = userChannelSlice.actions;
