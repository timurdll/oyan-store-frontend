import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonicalUrl?: string;
  type?: string;
  structuredData?: any;
  robots?: string;
  noindex?: boolean;
  nofollow?: boolean;
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
  location?: string;
  price?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  canonicalUrl,
  type = "website",
  structuredData,
  robots,
  noindex = false,
  nofollow = false,
  locale,
  alternateLocales = [],
  location = "Казахстан",
  price = "доступные",
}) => {
  const { t, i18n } = useTranslation();
  const siteName = "Oyan Store";
  const defaultTitle = t("seo.defaultTitle");
  const defaultDescription = t("seo.defaultDescription");
  const defaultKeywords = t("seo.defaultKeywords");
  const defaultImage = "/logo.png";

  // Генерируем локализованные ключевые слова
  const locationKeywords = [
    "купить ноутбук",
    "ноутбуки",
    "ноутбуки недорого",
    "ноутбуки в рассрочку",
    "ноутбуки с гарантией",
    `купить ноутбук ${location}`,
    `ноутбуки ${location}`,
    `ноутбуки недорого ${location}`,
    `ноутбуки в рассрочку ${location}`,
    `ноутбуки с гарантией ${location}`,
    "ноутбуки алматы",
    "ноутбуки астана",
    "ноутбуки караганда",
    "ноутбуки шымкент",
    "ноутбуки павлодар",
    "ноутбуки усть-каменогорск",
    "ноутбуки петропавловск",
    "ноутбуки костанай",
    "ноутбуки актау",
    "ноутбуки атырау",
    "ноутбуки уральск",
    "ноутбуки тараз",
    "ноутбуки кызылорда",
    "ноутбуки актобе",
    "ноутбуки талдыкорган",
    "ноутбуки кокшетау",
    "ноутбуки туркестан",
    "ноутбуки семей",
    "ноутбуки экибастуз",
    "ноутбуки жезказган",
    "ноутбуки капчагай",
    "ноутбуки сатпаев",
    "ноутбуки ридер",
    "ноутбуки ридер алматы",
    "ноутбуки ридер астана",
    "ноутбуки ридер караганда",
    "ноутбуки ридер шымкент",
    "ноутбуки ридер павлодар",
    "ноутбуки ридер усть-каменогорск",
    "ноутбуки ридер петропавловск",
    "ноутбуки ридер костанай",
    "ноутбуки ридер актау",
    "ноутбуки ридер атырау",
    "ноутбуки ридер уральск",
    "ноутбуки ридер тараз",
    "ноутбуки ридер кызылорда",
    "ноутбуки ридер актобе",
    "ноутбуки ридер талдыкорган",
    "ноутбуки ридер кокшетау",
    "ноутбуки ридер туркестан",
    "ноутбуки ридер семей",
    "ноутбуки ридер экибастуз",
    "ноутбуки ридер жезказган",
    "ноутбуки ридер капчагай",
    "ноутбуки ридер сатпаев",
    "купить ноутбук недорого",
    "купить ноутбук в рассрочку",
    "купить ноутбук с гарантией",
    "купить ноутбук алматы",
    "купить ноутбук астана",
    "купить ноутбук караганда",
    "купить ноутбук шымкент",
    "купить ноутбук павлодар",
    "купить ноутбук усть-каменогорск",
    "купить ноутбук петропавловск",
    "купить ноутбук костанай",
    "купить ноутбук актау",
    "купить ноутбук атырау",
    "купить ноутбук уральск",
    "купить ноутбук тараз",
    "купить ноутбук кызылорда",
    "купить ноутбук актобе",
    "купить ноутбук талдыкорган",
    "купить ноутбук кокшетау",
    "купить ноутбук туркестан",
    "купить ноутбук семей",
    "купить ноутбук экибастуз",
    "купить ноутбук жезказган",
    "купить ноутбук капчагай",
    "купить ноутбук сатпаев",
    "купить ноутбук ридер",
    "купить ноутбук ридер алматы",
    "купить ноутбук ридер астана",
    "купить ноутбук ридер караганда",
    "купить ноутбук ридер шымкент",
    "купить ноутбук ридер павлодар",
    "купить ноутбук ридер усть-каменогорск",
    "купить ноутбук ридер петропавловск",
    "купить ноутбук ридер костанай",
    "купить ноутбук ридер актау",
    "купить ноутбук ридер атырау",
    "купить ноутбук ридер уральск",
    "купить ноутбук ридер тараз",
    "купить ноутбук ридер кызылорда",
    "купить ноутбук ридер актобе",
    "купить ноутбук ридер талдыкорган",
    "купить ноутбук ридер кокшетау",
    "купить ноутбук ридер туркестан",
    "купить ноутбук ридер семей",
    "купить ноутбук ридер экибастуз",
    "купить ноутбук ридер жезказган",
    "купить ноутбук ридер капчагай",
    "купить ноутбук ридер сатпаев",
    "ноутбуки недорого алматы",
    "ноутбуки недорого астана",
    "ноутбуки недорого караганда",
    "ноутбуки недорого шымкент",
    "ноутбуки недорого павлодар",
    "ноутбуки недорого усть-каменогорск",
    "ноутбуки недорого петропавловск",
    "ноутбуки недорого костанай",
    "ноутбуки недорого актау",
    "ноутбуки недорого атырау",
    "ноутбуки недорого уральск",
    "ноутбуки недорого тараз",
    "ноутбуки недорого кызылорда",
    "ноутбуки недорого актобе",
    "ноутбуки недорого талдыкорган",
    "ноутбуки недорого кокшетау",
    "ноутбуки недорого туркестан",
    "ноутбуки недорого семей",
    "ноутбуки недорого экибастуз",
    "ноутбуки недорого жезказган",
    "ноутбуки недорого капчагай",
    "ноутбуки недорого сатпаев",
    "ноутбуки недорого ридер",
    "ноутбуки недорого ридер алматы",
    "ноутбуки недорого ридер астана",
    "ноутбуки недорого ридер караганда",
    "ноутбуки недорого ридер шымкент",
    "ноутбуки недорого ридер павлодар",
    "ноутбуки недорого ридер усть-каменогорск",
    "ноутбуки недорого ридер петропавловск",
    "ноутбуки недорого ридер костанай",
    "ноутбуки недорого ридер актау",
    "ноутбуки недорого ридер атырау",
    "ноутбуки недорого ридер уральск",
    "ноутбуки недорого ридер тараз",
    "ноутбуки недорого ридер кызылорда",
    "ноутбуки недорого ридер актобе",
    "ноутбуки недорого ридер талдыкорган",
    "ноутбуки недорого ридер кокшетау",
    "ноутбуки недорого ридер туркестан",
    "ноутбуки недорого ридер семей",
    "ноутбуки недорого ридер экибастуз",
    "ноутбуки недорого ридер жезказган",
    "ноутбуки недорого ридер капчагай",
    "ноутбуки недорого ридер сатпаев",
  ].join(", ");

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords
    ? `${keywords}, ${locationKeywords}`
    : `${defaultKeywords}, ${locationKeywords}`;
  const seoImage = image || defaultImage;
  const seoCanonicalUrl =
    canonicalUrl || `https://oyan-store.kz/${i18n.language}`;
  const seoLocale = locale || i18n.language;
  const seoRobots =
    robots ||
    `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`;

  useEffect(() => {
    // Update title
    document.title = seoTitle;

    // Update meta tags
    const metaTags = [
      // Basic meta tags
      { name: "description", content: seoDescription },
      { name: "keywords", content: seoKeywords },
      { name: "robots", content: seoRobots },
      { name: "author", content: siteName },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },

      // Open Graph meta tags
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: type },
      { property: "og:url", content: seoCanonicalUrl },
      { property: "og:image", content: seoImage },
      { property: "og:site_name", content: siteName },
      { property: "og:locale", content: seoLocale },

      // Twitter meta tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seoTitle },
      { name: "twitter:description", content: seoDescription },
      { name: "twitter:image", content: seoImage },
      { name: "twitter:site", content: "@oyanstore" },

      // Additional meta tags
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
      { name: "apple-mobile-web-app-title", content: siteName },
      { name: "application-name", content: siteName },
      { name: "format-detection", content: "telephone=no" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-config", content: "/browserconfig.xml" },
    ];

    // Remove existing meta tags
    const existingMetaTags = document.querySelectorAll(
      "meta[name], meta[property]"
    );
    existingMetaTags.forEach((tag) => tag.remove());

    // Add new meta tags
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.name) meta.setAttribute("name", tag.name);
      if (tag.property) meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", seoCanonicalUrl);

    // Update language alternates
    const alternates = [
      { hreflang: "x-default", href: "https://oyan-store.kz" },
      { hreflang: "ru", href: "https://oyan-store.kz/ru" },
      { hreflang: "kk", href: "https://oyan-store.kz/kk" },
      ...alternateLocales.map((locale) => ({
        hreflang: locale.locale,
        href: locale.url,
      })),
    ];

    // Remove existing alternate links
    const existingAlternates = document.querySelectorAll(
      'link[rel="alternate"]'
    );
    existingAlternates.forEach((link) => link.remove());

    // Add new alternate links
    alternates.forEach((alt) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", alt.hreflang);
      link.setAttribute("href", alt.href);
      document.head.appendChild(link);
    });

    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    seoCanonicalUrl,
    type,
    structuredData,
    seoLocale,
    alternateLocales,
  ]);

  return null;
};

export default SEO;
