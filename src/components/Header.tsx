import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetUserBonusesQuery } from "@redux/services/userApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LanguageSelector from "./UI/LanguageSelector";
import UserMenu from "./UserMenu";
import SearchBar from "./UI/SearchBar";
import useIsMobile from "./Hooks/UseIsMobile";
import styles from "@styles/header.module.scss";
import logo from "@assets/images/oyanlogo.svg";
import BurgerMenu from "./UI/BurgerMenu";
// import { FaPhone } from "react-icons/fa"; // Импорт иконки телефона
import phoneIcon from "@assets/images/call.svg"; // Импорт иконки телефона

const Header = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const { data } = useGetUserBonusesQuery(undefined, { skip: !isLoggedIn });
  const isMobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Хедер всегда видим
    setIsVisible(true);
  }, []);

  return (
    <motion.header
      className={styles.header}
      style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className={styles.content}>
        {isMobile ? (
          <div className={styles.top}>
            <div className={styles.logo}>
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>
            <BurgerMenu />
          </div>
        ) : (
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        )}

        <motion.div
          className={styles.search}
          initial={{ height: 0, opacity: 0 }}
          animate={
            isVisible || !isMobile
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
        >
          <SearchBar />
        </motion.div>

        <div className={styles.navigation}>
          <LanguageSelector />
          <div className={styles.divider} />
          <span>
            {data
              ? `Бонусы: ${data.bonuses} (${data.holdingBonuses} удержано)`
              : "Бонусы"}
          </span>
          <div className={styles.divider} />
          <UserMenu />
          <div className={styles.divider} />
          {/* Кнопка "Позвонить" с иконкой */}
          <a href="tel:+77089045254" className={styles.callButton}>
            {/* <FaPhone style={{ marginRight: "4px" }} /> */}
            <img src={phoneIcon} />
            {/* Позвонить */}
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
