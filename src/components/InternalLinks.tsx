import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface InternalLinksProps {
  city?: string;
  productType?: string;
}

const InternalLinks: React.FC<InternalLinksProps> = ({
  city = "Казахстан",
  productType = "ноутбуки",
}) => {
  const { t, i18n } = useTranslation();

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

  return (
    <div className="internal-links">
      <div className="city-links">
        <h2>{t("internalLinks.cities")}</h2>
        <ul>
          {cities.map((city) => (
            <li key={city}>
              <Link to={`/${i18n.language}/city/${city.toLowerCase()}`}>
                {`${productType} в ${city}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="product-links">
        <h2>{t("internalLinks.products")}</h2>
        <ul>
          {productTypes.map((type) => (
            <li key={type}>
              <Link
                to={`/${i18n.language}/category/${type
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {`${type} ${city}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InternalLinks;
