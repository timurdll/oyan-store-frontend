import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { startTransition } from "react";
import styles from "@styles/languageSwitcher.module.scss";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: "ru", name: "Рус" },
    { code: "kk", name: "Қаз" },
  ];

  const changeLanguage = (language: string) => {
    if (language === i18n.language) return;

    // Полностью заменяем путь, вместо добавления префикса
    // Убираем все языковые префиксы и добавляем только один новый
    const pathParts = location.pathname.split("/").filter(Boolean);

    // Удаляем все языковые префиксы из пути
    const nonLanguageParts = pathParts.filter(
      (part) => !languages.some((l) => l.code === part)
    );

    // Собираем новый путь с префиксом выбранного языка
    const newPath = `/${language}${
      nonLanguageParts.length > 0 ? "/" + nonLanguageParts.join("/") : ""
    }`;

    // Используем startTransition для предотвращения блокировки UI
    startTransition(() => {
      // Важно: сначала меняем URL, затем язык
      navigate(newPath + location.search + location.hash);

      // Небольшая задержка для плавной смены языка
      setTimeout(() => {
        i18n.changeLanguage(language);
      }, 10);
    });
  };

  return (
    <div className={`${styles.menuButtons} ${className || ""}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          className={`${styles.langButton} ${
            i18n.language === language.code ? styles.activeLang : ""
          }`}
          onClick={() => changeLanguage(language.code)}
          aria-label={`Switch to ${language.name}`}
        >
          {language.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
