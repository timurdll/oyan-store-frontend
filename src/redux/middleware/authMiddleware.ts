import { Middleware } from "@reduxjs/toolkit";
import { logout } from "@redux/slices/userSlice";
import { openAuthModal, setSessionExpired } from "@redux/slices/authModalSlice";

export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Check if there was a previous session (token exists)
    const token = localStorage.getItem("token");

    // Проверка на истекший токен (401 Unauthorized)
    if (
      (action.meta?.response?.status === 401 ||
        action?.payload?.status === 401) &&
      token // Only show session expired if there was a token
    ) {
      // Очищаем данные пользователя
      store.dispatch(logout());

      // Устанавливаем флаг истекшей сессии
      store.dispatch(setSessionExpired());

      // Открываем модальное окно
      store.dispatch(openAuthModal());
    } else if (
      (action.meta?.response?.status === 401 ||
        action?.payload?.status === 401) &&
      !token // If no token exists, just open the auth modal without session expired message
    ) {
      store.dispatch(openAuthModal());
    }

    return next(action);
  };
