import { Route, Routes, Navigate, useParams } from "react-router-dom";
import { publicRoutes, userRoutes, adminRoutes } from "./routes";
import { useSelector } from "react-redux";
import ScrollToTopWrapper from "./ScrollToTopWrapper";
import { useEffect, startTransition, useCallback } from "react";
import { useTranslation } from "react-i18next";

const AppRouter: React.FC = () => {
  const user = useSelector((state: any) => state.user.currentUser);
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const supportedLanguages = ["ru", "kk"];

  // Создаем мемоизированную функцию изменения языка
  const changeLanguageSafely = useCallback(
    (newLang: string) => {
      if (newLang === i18n.language) return;

      startTransition(() => {
        i18n.changeLanguage(newLang);
      });
    },
    [i18n]
  );

  // Устанавливаем язык из URL
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang)) {
      changeLanguageSafely(lang);
    }
  }, [lang, changeLanguageSafely, supportedLanguages]);

  // Если язык не поддерживается, перенаправляем на русский
  if (lang && !supportedLanguages.includes(lang)) {
    return <Navigate to="/ru" replace />;
  }

  return (
    <ScrollToTopWrapper>
      <Routes>
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {user ? (
          <>
            {userRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {user.role === "admin" &&
              adminRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
          </>
        ) : (
          <Route
            path="*"
            element={<Navigate to={`/${lang || "ru"}/login`} replace />}
          />
        )}
      </Routes>
    </ScrollToTopWrapper>
  );
};

export default AppRouter;
