import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedIn: false,
    role: "user", // "user" or "admin"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.role = action.payload.user.role || "user";
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.role = "user";
        },
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    }
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
