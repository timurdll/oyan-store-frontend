import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Sitemap = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const cities = [
      "Алматы",
      "Астана",
      "Караганда",
      "Шымкент",
      "Павлодар",
      "Усть-Каменогорск",
      "Петропавловск",
      "Костанай",
      "Актау",
      "Атырау",
      "Уральск",
      "Тараз",
      "Кызылорда",
      "Актобе",
      "Талдыкорган",
      "Кокшетау",
      "Туркестан",
      "Семей",
      "Экибастуз",
      "Жезказган",
      "Капчагай",
      "Сатпаев",
      "Ридер",
    ];

    const productTypes = [
      "ноутбуки",
      "ноутбуки недорого",
      "ноутбуки в рассрочку",
      "ноутбуки с гарантией",
    ];

    const sitemap = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("sitemap.home"),
          url: `https://oyan-store.kz/${i18n.language}`,
        },
        ...cities.map((city, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: `${t("sitemap.city")} ${city}`,
          url: `https://oyan-store.kz/${
            i18n.language
          }/city/${city.toLowerCase()}`,
        })),
        ...productTypes.map((type, index) => ({
          "@type": "ListItem",
          position: index + cities.length + 2,
          name: type,
          url: `https://oyan-store.kz/${i18n.language}/category/${type
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        })),
      ],
    };

    // Удаляем старые структурированные данные
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) existingScript.remove();

    // Добавляем новые структурированные данные
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(sitemap);
    document.head.appendChild(script);
  }, [i18n.language, t]);

  return null;
};

export default Sitemap;
