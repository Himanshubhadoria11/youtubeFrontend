import { configureStore } from "@reduxjs/toolkit"; // Importing configureStore from Redux Toolkit
import authReducer from "./authSlice"; // Importing authReducer from authSlice
import userChannelReducer from "./userChannelSlice"; // Importing userChannelReducer from userChannelSlice

const store = configureStore({
    reducer: {
        auth: authReducer, // Adding authReducer to the store
        userChannel: userChannelReducer, // Adding userChannelReducer to the store
    },
});

export default store; // Exporting the configured store
