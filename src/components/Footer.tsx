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
                  <Link to="/warranty">{t("footer.customers.warranty")}</Link>
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
              <a href="tel:+77089045254" className={styles.phone}>
                +7 708 904 5254
              </a>
            </div>
            <div className={styles.contactItem}>
              <p>{t("footer.contacts.address")}</p>
            </div>
            <ul className={styles.socials}>
              <li>
                <a href="https://t.me/+77026942005" target="_blank">
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

              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=77026942005&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D1%81+%D1%81%D0%B0%D0%B9%D1%82%D0%B0+Oyan+Store.%0A%0A&type=phone_number&app_absent=0"
                  target="_blank"
                >
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
