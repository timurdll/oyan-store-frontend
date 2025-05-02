import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface DynamicMetaTagsProps {
  city?: string;
  productType?: string;
  priceRange?: string;
}

const DynamicMetaTags: React.FC<DynamicMetaTagsProps> = ({
  city = "Казахстан",
  productType = "ноутбуки",
  priceRange = "доступные",
}) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const title = `${productType} в ${city} | Купить ${productType} ${priceRange} | Oyan Store`;
    const description = `Купить ${productType} ${priceRange} в ${city}. Большой выбор ${productType} с доставкой по ${city}. Официальная гарантия, рассрочка, кредит.`;
    const keywords = [
      `${productType} ${city}`,
      `купить ${productType} ${city}`,
      `${productType} недорого ${city}`,
      `${productType} в рассрочку ${city}`,
      `${productType} с гарантией ${city}`,
      `${productType} ${priceRange} ${city}`,
      `магазин ${productType} ${city}`,
      `интернет-магазин ${productType} ${city}`,
    ].join(", ");

    // Обновляем title
    document.title = title;

    // Обновляем мета-теги
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `https://oyan-store.kz${pathname}` },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];

    // Удаляем старые мета-теги
    const existingMetaTags = document.querySelectorAll(
      "meta[name], meta[property]"
    );
    existingMetaTags.forEach((tag) => tag.remove());

    // Добавляем новые мета-теги
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.name) meta.setAttribute("name", tag.name);
      if (tag.property) meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // Добавляем структурированные данные
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: `https://oyan-store.kz${pathname}`,
      inLanguage: i18n.language,
      about: {
        "@type": "Product",
        name: productType,
        description: description,
        category: productType,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "KZT",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Oyan Store",
            url: "https://oyan-store.kz",
            address: {
              "@type": "PostalAddress",
              addressCountry: "KZ",
              addressLocality: city,
            },
          },
        },
      },
    };

    // Удаляем старые структурированные данные
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) existingScript.remove();

    // Добавляем новые структурированные данные
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [city, productType, priceRange, pathname, i18n.language]);

  return null;
};

export default DynamicMetaTags;
