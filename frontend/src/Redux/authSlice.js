import { createSlice } from '@reduxjs/toolkit';

const storedAuth = localStorage.getItem("isAuthenticated");
const initialState = {
    isAuthenticated: storedAuth ? JSON.parse(storedAuth) : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", "true");
        },
        logout: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem("isAuthenticated");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;