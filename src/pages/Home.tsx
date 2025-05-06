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
    description:
      "Oyan Store - интернет-магазин ноутбуков в Казахстане. Большой выбор ноутбуков по доступным ценам с доставкой по всему Казахстану. Официальная гарантия, рассрочка, кредит.",
    keywords:
      "ноутбуки, купить ноутбук, ноутбуки недорого, ноутбуки в рассрочку, ноутбуки с гарантией, ноутбуки алматы, ноутбуки астана, ноутбуки караганда, ноутбуки шымкент, ноутбуки павлодар, ноутбуки усть-каменогорск, ноутбуки петропавловск, ноутбуки костанай, ноутбуки актау, ноутбуки атырау, ноутбуки уральск, ноутбуки тараз, ноутбуки кызылорда, ноутбуки актобе, ноутбуки талдыкорган, ноутбуки кокшетау, ноутбуки туркестан, ноутбуки семей, ноутбуки экибастуз, ноутбуки жезказган, ноутбуки капчагай, ноутбуки сатпаев, ноутбуки ридер",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KZT",
      lowPrice: "150000",
      highPrice: "2000000",
      offerCount: "100",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Oyan Store",
        url: "https://oyan-store.kz",
        logo: "https://oyan-store.kz/logo.png",
        address: {
          "@type": "PostalAddress",
          addressCountry: "KZ",
          addressLocality: "Алматы",
          postalCode: "050000",
          streetAddress: "ул. Абая, 150",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+7 (777) 777-77-77",
          contactType: "customer service",
          areaServed: "KZ",
          availableLanguage: ["Russian", "Kazakh"],
        },
      },
    },
  };

  return (
    <>
      <SEO
        title="Купить ноутбук в Казахстане"
        description="Oyan Store - интернет-магазин ноутбуков в Казахстане. Большой выбор ноутбуков по доступным ценам с доставкой по всему Казахстану. Официальная гарантия, рассрочка, кредит."
        keywords="ноутбуки, купить ноутбук, ноутбуки недорого, ноутбуки в рассрочку, ноутбуки с гарантией, ноутбуки алматы, ноутбуки астана, ноутбуки караганда, ноутбуки шымкент, ноутбуки павлодар, ноутбуки усть-каменогорск, ноутбуки петропавловск, ноутбуки костанай, ноутбуки актау, ноутбуки атырау, ноутбуки уральск, ноутбуки тараз, ноутбуки кызылорда, ноутбуки актобе, ноутбуки талдыкорган, ноутбуки кокшетау, ноутбуки туркестан, ноутбуки семей, ноутбуки экибастуз, ноутбуки жезказган, ноутбуки капчагай, ноутбуки сатпаев, ноутбуки ридер"
        canonicalUrl={`https://oyan-store.kz/${i18n.language}`}
        type="website"
        structuredData={structuredData}
        locale={i18n.language}
        alternateLocales={[
          { locale: "ru", url: "https://oyan-store.kz/ru" },
          { locale: "kk", url: "https://oyan-store.kz/kk" },
        ]}
        location="Казахстан"
        price="доступные"
      />
      <BannerSlider />
      <Navbar onTypeSelect={setSelectedType} />
      <ProductList selectedType={selectedType} />
    </>
  );
};

export default Home;
