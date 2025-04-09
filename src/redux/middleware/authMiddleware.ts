import { Middleware } from "@reduxjs/toolkit";
import { logout } from "@redux/slices/userSlice";
import { openAuthModal, setSessionExpired } from "@redux/slices/authModalSlice";

export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const token = localStorage.getItem("token");
    const hasLoggedInBefore = localStorage.getItem("hasLoggedIn"); // новый флаг

    const isUnauthorized =
      action.meta?.response?.status === 401 || action?.payload?.status === 401;

    if (isUnauthorized) {
      if (token && hasLoggedInBefore === "true") {
        store.dispatch(logout());
        store.dispatch(setSessionExpired());
        store.dispatch(openAuthModal());
      } else {
        // Не открываем модалку, если пользователь никогда не логинился
        // Можешь сюда добавить лог или трекинг, если нужно
      }
    }

    return next(action);
  };
