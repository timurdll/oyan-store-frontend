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

const Header = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const { data } = useGetUserBonusesQuery(undefined, { skip: !isLoggedIn });
  const isMobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true); // Всегда показываем хедер на десктопе
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Скролл вниз
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsVisible(true); // Скролл вверх или на самом верху
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Блокируем скролл, если хедер скрыт
    document.body.style.overflow = isVisible ? "visible" : "hidden";

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "visible"; // Сбрасываем стиль при размонтировании
    };
  }, [lastScrollY, isMobile, isVisible]);

  return (
    <motion.header
      className={styles.header}
      style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)" }} // Без анимации
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

        {/* Поисковая строка */}
        <motion.div
          className={styles.search}
          initial={{ height: 0, opacity: 0 }}
          animate={
            isVisible || !isMobile // Логика для десктопа
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
