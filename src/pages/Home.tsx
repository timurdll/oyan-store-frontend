import { useState } from "react";
import ProductList from "@components/Products";
import Navbar from "@components/NavBar";
import BannerSlider from "@components/UI/SlickSlider";
import SEO from "@components/SEO";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const { t, i18n } = useTranslation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Oyan Store",
    url: "https://oyan-store.kz",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://oyan-store.kz/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SEO
        title={t("seo.homeTitle")}
        description={t("seo.homeDescription")}
        keywords={t("seo.homeKeywords")}
        canonicalUrl={`https://oyan-store.kz/${i18n.language}`}
        type="website"
        structuredData={structuredData}
        locale={i18n.language}
        alternateLocales={[
          { locale: "ru", url: "https://oyan-store.kz/ru" },
          { locale: "kk", url: "https://oyan-store.kz/kk" },
        ]}
      />
      <BannerSlider />
      <Navbar onTypeSelect={setSelectedType} />
      <ProductList selectedType={selectedType} />
    </>
  );
};

export default Home;
