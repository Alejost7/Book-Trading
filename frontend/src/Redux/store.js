import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import modalReducer from './modalSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        modal: modalReducer,
        auth: authReducer,
    },
});

export default store;