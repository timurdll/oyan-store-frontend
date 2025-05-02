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
}) => {
  const { t, i18n } = useTranslation();
  const siteName = "Oyan Store";
  const defaultTitle = t("seo.defaultTitle");
  const defaultDescription = t("seo.defaultDescription");
  const defaultKeywords = t("seo.defaultKeywords");
  const defaultImage = "/logo.png";

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
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
