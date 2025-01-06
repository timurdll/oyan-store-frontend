import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "@styles/burger-menu.module.scss";
import { useGetUserBonusesQuery } from "@redux/services/userApi";
import { useSelector } from "react-redux";
import LanguageSelector from "./LanguageSelector";
import MenuIcon from "@mui/icons-material/Menu";

const BurgerMenu: React.FC = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const { data } = useGetUserBonusesQuery(undefined, { skip: !isLoggedIn });
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const menuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const overlayVariants = {
    open: { opacity: 1, display: "block" },
    closed: {
      opacity: 0,
      transitionEnd: { display: "none" }, // Скрываем элемент после завершения анимации
    },
  };

  return (
    <>
      {/* Кнопка бургер-меню */}
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      {/* Фоновая затемненная область */}
      <motion.div
        className={styles.overlay}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={overlayVariants}
        onClick={closeMenu}
      />

      {/* Меню */}
      <motion.nav
        className={styles.menu}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>
              {data
                ? `Бонусы: ${data.bonuses} (${data.holdingBonuses} удержано)`
                : "Бонусы"}
            </Link>
          </li>
          <li>
            <Link to="/about-us" onClick={closeMenu}>
              О нас
            </Link>
          </li>
        </ul>
        <div className={styles.language}>
          <LanguageSelector />
        </div>
      </motion.nav>
    </>
  );
};

export default BurgerMenu;
