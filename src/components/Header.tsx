import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUserBonusesQuery } from "@redux/services/userApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LanguageSelector from "./UI/LanguageSelector";
import UserMenu from "./UserMenu";
import SearchBar from "./UI/SearchBar";
import useIsMobile from "./Hooks/UseIsMobile";
import styles from "@styles/header.module.scss";
import logo from "@assets/images/oyanlogo.svg";
// import BurgerMenu from "./UI/BurgerMenu";
import phoneIcon from "@assets/images/call.svg";
import { IoSearch, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);
  const { data } = useGetUserBonusesQuery(undefined, { skip: !isLoggedIn });
  const isMobile = useIsMobile();

  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setIsMobileMenuOpen(false);
  };

  const closeOverlay = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Варианты анимации для контейнеров
  const menuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      marginTop: "15px",
      paddingBottom: "15px",
    },
    closed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      paddingBottom: 0,
    },
  };

  const searchVariants = {
    open: {
      height: "auto",
      opacity: 1,
      marginTop: "10px",
    },
    closed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
    },
  };

  return (
    <>
      <motion.header
        className={styles.header}
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className={styles.content}>
          {isMobile ? (
            <>
              <div className={styles.top}>
                <button
                  className={styles.searchButton}
                  onClick={toggleSearch}
                  aria-label={isSearchOpen ? "Закрыть поиск" : "Открыть поиск"}
                >
                  {isSearchOpen ? (
                    <IoClose size={22} />
                  ) : (
                    <IoSearch size={22} />
                  )}
                </button>

                <div className={styles.logo}>
                  <Link to="/">
                    <img src={logo} alt="logo" />
                  </Link>
                </div>

                <button
                  className={`${styles.menuToggle} ${
                    isMobileMenuOpen ? styles.active : ""
                  }`}
                  onClick={toggleMobileMenu}
                  aria-label={
                    isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"
                  }
                >
                  <IoIosArrowDown
                    size={22}
                    style={{
                      transform: isMobileMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
              </div>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className={styles.searchContainer}
                    variants={searchVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <SearchBar />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    className={styles.mobileMenu}
                    variants={menuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className={styles.mobileMenuContent}>
                      {/* <LanguageSelector /> */}
                      {isLoggedIn && (
                        <div className={styles.bonusInfo}>
                          {data
                            ? `Бонусы: ${data.bonuses} (${data.holdingBonuses} удержано)`
                            : "Бонусы"}
                        </div>
                      )}
                      {/* <UserMenu /> */}
                      {/* <span className=""></span> */}
                      <a href="tel:+77089045254" className={styles.callButton}>
                        <img src={phoneIcon} alt="Позвонить" />
                        <span>Позвонить</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <div className={styles.logo}>
                <Link to="/">
                  <img src={logo} alt="logo" />
                </Link>
              </div>

              <motion.div
                className={styles.search}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
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
                <a href="tel:+77089045254" className={styles.callButton}>
                  <img src={phoneIcon} alt="Позвонить" />
                </a>
              </div>
            </>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {(isMobileMenuOpen || isSearchOpen) && isMobile && (
          <motion.div
            className={styles.glassOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeOverlay}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
