import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import cartReducer from "./cartSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    }
});

export default store;
