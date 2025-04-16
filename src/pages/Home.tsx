import { useState } from "react";
import { Helmet } from "react-helmet";
import ProductList from "@components/Products";
import Navbar from "@components/NavBar";
import BannerSlider from "@components/UI/SlickSlider";

const Home = () => {
  const [selectedType, setSelectedType] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        {/* Заголовок страницы */}
        <title>
          Oyan Store – Доступные ноутбуки с гарантией и сервисом в Казахстане
        </title>

        {/* Описание страницы */}
        <meta
          name="description"
          content="Oyan Store – казахстанский бренд, предлагающий качественные и доступные ноутбуки с оригинальной гарантией и профессиональным сервисом. Покупайте технику прямо у производителя."
        />

        {/* Канонический URL */}
        <link rel="canonical" href="https://oyan-store.kz/" />

        {/* Open Graph теги для соцсетей */}
        <meta
          property="og:title"
          content="Oyan Store – Доступные ноутбуки в Казахстане"
        />
        <meta
          property="og:description"
          content="Оригинальные ноутбуки от казахстанского бренда Oyan Store. Гарантия и сервис от производителя. Узнайте больше и делайте заказ на официальном сайте."
        />
        <meta property="og:url" content="https://oyan-store.kz/" />
        <meta property="og:type" content="website" />
        {/* Можно добавить изображение для превью */}
        {/* <meta
          property="og:image"
          content="https://oyanstore.kz/path-to-image.jpg"
        /> */}
        {/* Альтернативные ссылки для мультиязычности (если требуется) */}
        {/* <link rel="alternate" href="https://oyanstore.kz/" hrefLang="ru" /> */}
        {/* <link rel="alternate" href="https://oyanstore.kz/en" hrefLang="en" /> */}
      </Helmet>

      <BannerSlider />
      <Navbar onTypeSelect={setSelectedType} />
      <ProductList selectedType={selectedType} />
    </>
  );
};

export default Home;
