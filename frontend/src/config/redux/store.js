import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index.js";
/**
 * STEPS for state management
 * submit action
 * handle action in it's reducer
 * register here =>reducer
 */


export const store = configureStore({
    reducer:{
        auth:authReducer
    }
})