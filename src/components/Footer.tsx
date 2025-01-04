import styles from "@styles/footer.module.scss";
import instagram from "@assets/images/instagram.svg";
import whatsapp from "@assets/images/whatsapp.svg";
import telegram from "@assets/images/telegram.svg";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <div className={styles.menu}>
            <div className={styles.group}>
              <h6 className={styles.title}>Компания:</h6>
              <ul className={styles.submenu}>
                <li>
                  <Link to="/about-us">О нас</Link>
                </li>
                <li>
                  <Link to="/">Товары</Link>
                </li>
                <li>
                  <Link to="/">Услуги</Link>
                </li>
              </ul>
            </div>
            <div className={styles.group}>
              <h6 className={styles.title}>Клиентам:</h6>
              <ul className={styles.submenu}>
                <li>
                  <Link to="/">Доставка</Link>
                </li>
                <li>
                  <Link to="/">Помощь</Link>
                </li>
                <li>
                  <Link to="/">Условия гарантии</Link>
                </li>
                <li>
                  <Link to="/">Как оформить заказ</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.contacts}>
            <h6 className={styles.title}>Оставайтесь на связи:</h6>

            <div className={styles.contactItem}>
              <p>График работы</p>
            </div>
            <div className={styles.contactItem}>
              <a href="tel:+77002538363" className={styles.phone}>
                +7‒700‒253‒83‒63
              </a>
            </div>
            <div className={styles.contactItem}>
              <p>Астана, ул. Б. Майлина 37, 4 этаж, 412 каб.</p>
            </div>
            <ul className={styles.socials}>
              <li>
                <a href="https://t.me/+77026942005" target="_blank">
                  <img src={telegram} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/oyan.store.kz"
                  target="_blank"
                >
                  <img src={instagram} />
                </a>
              </li>

              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=77026942005&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D1%81+%D1%81%D0%B0%D0%B9%D1%82%D0%B0+Oyan+Store.%0A%0A&type=phone_number&app_absent=0"
                  target="_blank"
                >
                  <img src={whatsapp} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <span className={styles.copyright}>
          Интернет-магазин Oyan Store. Oyan® Все права защищены{" "}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
