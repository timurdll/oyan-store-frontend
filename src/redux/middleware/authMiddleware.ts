import { Middleware } from "@reduxjs/toolkit";
import { logout } from "@redux/slices/userSlice";
import { openAuthModal, setSessionExpired } from "@redux/slices/authModalSlice";

export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Проверка на истекший токен (401 Unauthorized)
    if (
      action.meta?.response?.status === 401 || // Если статус ответа 401
      action?.payload?.status === 401
    ) {
      // Очищаем данные пользователя
      store.dispatch(logout());

      // Устанавливаем флаг истекшей сессии
      store.dispatch(setSessionExpired());

      // Открываем модальное окно
      store.dispatch(openAuthModal());
    }

    return next(action); // Передаём экшен дальше
  };
