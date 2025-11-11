import styles from "@styles/footer.module.scss";
import instagram from "@assets/images/instagram.svg";
import whatsapp from "@assets/images/whatsapp.svg";
import telegram from "@assets/images/telegram.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <div className={styles.menu}>
            <div className={styles.group}>
              <h6 className={styles.title}>{t("footer.company.title")}</h6>
              <ul className={styles.submenu}>
                <li>
                  <Link to={`/${i18n.language}/about-us`}>
                    {t("footer.company.about")}
                  </Link>
                </li>
                <li>
                  <Link to="/">{t("footer.company.products")}</Link>
                </li>
                <li>
                  <Link to="/">{t("footer.company.services")}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.group}>
              <h6 className={styles.title}>{t("footer.customers.title")}</h6>
              <ul className={styles.submenu}>
                <li>
                  <Link to="/">{t("footer.customers.delivery")}</Link>
                </li>
                <li>
                  <Link to="/">{t("footer.customers.help")}</Link>
                </li>
                <li>
                  <Link to={`/${i18n.language}/warranty`}>
                    {t("footer.customers.warranty")}
                  </Link>
                </li>
                <li>
                  <Link to="/">{t("footer.customers.howToOrder")}</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.contacts}>
            <h6 className={styles.title}>{t("footer.contacts.title")}</h6>

            <div className={styles.contactItem}>
              <p>{t("footer.contacts.workingHours")}</p>
            </div>
            <div className={styles.contactItem}>
              {/* Контактный телефон (берётся из локализации) */}
              <a
                href={`tel:${t("footer.contacts.phonePrimaryHref")}`}
                className={styles.phone}
              >
                {t("footer.contacts.phonePrimaryDisplay")}
              </a>
            </div>
            <div className={styles.contactItem}>
              {/* Адрес магазина (локализация) */}
              <p>{t("footer.contacts.address")}</p>
            </div>
            <ul className={styles.socials}>
              {/* TODO: Ссылка на Telegram (в URL прописан номер) */}
              <li>
                <a href={t("footer.contacts.telegramUrl")} target="_blank">
                  <img src={telegram} alt="Telegram" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/oyan.store.kz"
                  target="_blank"
                >
                  <img src={instagram} alt="Instagram" />
                </a>
              </li>

              {/* TODO: Ссылка на WhatsApp (в URL прописан номер) */}
              <li>
                <a href={t("footer.contacts.whatsappUrl")} target="_blank">
                  <img src={whatsapp} alt="WhatsApp" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <span className={styles.copyright}>{t("footer.copyright")}</span>
      </div>
    </footer>
  );
};

export default Footer;
