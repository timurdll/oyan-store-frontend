// Файл: App.tsx

import Footer from "@components/Footer";
import Header from "@components/Header";
import useIsMobile from "@components/Hooks/UseIsMobile";
import MobileMenu from "@components/MobileMenu";
import Auth from "@pages/Auth";
import AppRouter from "@routes/AppRouter";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import socket from "./socket";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const isMobile = useIsMobile();
  const { token } = useSelector((state: RootState) => state.user);
  const [userId, setUserId] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Эффект для декодирования токена и установки userId
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ userId: string }>(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
        setUserId(null); // Сброс userId, если токен некорректный
      }
    } else {
      setUserId(null); // Сброс userId, если токен отсутствует
    }
  }, [token]);

  // Эффект для работы с WebSocket
  useEffect(() => {
    if (userId) {
      socket.connect();

      // Регистрация пользователя
      socket.emit("register", userId);

      // Прослушивание уведомлений
      socket.on("notification", (message: string) => {
        console.log("Получено уведомление:", message);
      });

      // Прослушивание обновлений статуса заказа
      socket.on(
        "orderStatusUpdate",
        (data: { orderId: number; status: string }) => {
          console.log(
            `Статус заказа обновлен: Заказ ${data.orderId} -> ${data.status}`
          );
          // Вы можете добавить обновление состояния или уведомление пользователя
        }
      );

      // Очистка подключения при размонтировании компонента
      return () => {
        socket.disconnect();
        console.log("WebSocket отключен.");
      };
    }
  }, [userId]); // Эффект срабатывает при изменении userId

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="content">
            <Routes>
              {/* Root redirects to current language */}
              <Route
                path="/"
                element={<Navigate to={`/${i18n.language}`} replace />}
              />

              {/* Render routes for each language */}
              <Route path="/:lang/*" element={<AppRouter />} />
            </Routes>
          </main>
          {isMobile ? <MobileMenu /> : <></>}
          <Auth />
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
