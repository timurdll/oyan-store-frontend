import { createSlice } from "@reduxjs/toolkit";

const authModalSlice = createSlice({
  name: "authModal",
  initialState: {
    isOpen: false,
    sessionExpired: false, // Состояние для проверки истекшей сессии
  },
  reducers: {
    openAuthModal: (state) => {
      state.isOpen = true;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
      state.sessionExpired = false; // Сбрасываем при закрытии
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
    },
    resetSessionExpired: (state) => {
      state.sessionExpired = false; // Новый экшен для сброса
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setSessionExpired,
  resetSessionExpired,
} = authModalSlice.actions;

export default authModalSlice.reducer;
