// src/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "types/types"; // Импортируйте ваш тип User

interface UserState {
  currentUser: User | null; // Текущий пользователь
  isLoggedIn: boolean; // Статус входа пользователя
  token: string | null; // Хранение токена
}

const initialState: UserState = {
  currentUser: null,
  isLoggedIn: false,
  token: null, // Инициализация токена как null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user; // Устанавливаем текущего пользователя
      state.isLoggedIn = true; // Пользователь вошел в систему
      state.token = action.payload.token; // Сохраняем токен
    },
    logout: (state) => {
      state.currentUser = null; // Очищаем текущего пользователя
      state.isLoggedIn = false; // Пользователь вышел из системы
      state.token = null; // Очищаем токен
      localStorage.removeItem("token"); // Удаляем токен из localStorage
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload; // Устанавливаем пользователя (можно использовать для обновления информации)
    },
  },
});

// Экспортируем действия
export const { login, logout, setUser } = userSlice.actions;

// Экспортируем редюсер
export default userSlice.reducer;
