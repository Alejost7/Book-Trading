import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: "modal",
    initialState: { isOpen: false, modalType: null},
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.modalType = action.payload; // El tipo de modal que se abrirá
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.modalType = null; 
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;