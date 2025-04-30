import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUserBonusesQuery } from "@redux/services/userApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import SearchBar from "./UI/SearchBar";
import useIsMobile from "./Hooks/UseIsMobile";
import styles from "@styles/header.module.scss";
import logo from "@assets/images/oyanlogo.svg";
import phoneIcon from "@assets/images/call.svg";
import { IoSearch, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import bonuses from "@assets/images/bonuses.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const isLoggedIn = useSelector((state: any) => state.user.currentUser);
  const { data } = useGetUserBonusesQuery(undefined, { skip: !isLoggedIn });
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

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

  // Animation variants
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

  const headerVariants = {
    closed: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    open: {
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
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
        variants={headerVariants}
        initial="closed"
        animate={isMobileMenuOpen ? "open" : "closed"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className={styles.content}>
          {isMobile ? (
            <>
              <div className={styles.top}>
                <button
                  className={styles.searchButton}
                  onClick={toggleSearch}
                  aria-label={
                    isSearchOpen
                      ? t("header.search.close")
                      : t("header.search.open")
                  }
                >
                  {isSearchOpen ? (
                    <IoClose size={22} />
                  ) : (
                    <IoSearch size={22} />
                  )}
                </button>

                <div className={styles.logo}>
                  <Link to={`/${i18n.language}`}>
                    <img src={logo} alt="logo" />
                  </Link>
                </div>

                <button
                  className={`${styles.menuToggle} ${
                    isMobileMenuOpen ? styles.active : ""
                  }`}
                  onClick={toggleMobileMenu}
                  aria-label={
                    isMobileMenuOpen
                      ? t("header.menu.close")
                      : t("header.menu.open")
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
                    <SearchBar isSearchOpen={isSearchOpen} />
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
                      {isLoggedIn && (
                        <div className={styles.bonusInfo}>
                          <img
                            src={bonuses}
                            alt={t("header.bonusesLabel")}
                            className={styles.bonusIcon}
                          />
                          <span className={styles.bonusText}>
                            {data
                              ? `${data.bonuses} ${t("header.bonuses")}`
                              : t("header.bonusesLabel")}
                          </span>
                        </div>
                      )}
                      <div className={styles.menuButtons}>
                        <button className={styles.aboutButton}>
                          {t("header.about")}
                        </button>
                        <LanguageSwitcher className={styles.languageSwitcher} />
                      </div>
                      <a href="tel:+77089045254" className={styles.callButton}>
                        <img src={phoneIcon} alt={t("header.call")} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <div className={styles.logo}>
                <Link to={`/${i18n.language}`}>
                  <img src={logo} alt="logo" />
                </Link>
              </div>

              <div className={styles.search}>
                <SearchBar isSearchOpen={true} />
              </div>

              <div className={styles.navigation}>
                <LanguageSwitcher className={styles.languageSwitcher} />

                <a href="tel:+77088040354" className={styles.callButton}>
                  <img
                    src={phoneIcon}
                    alt={t("header.call")}
                    className={styles.phoneIcon}
                  />
                </a>

                {isLoggedIn && (
                  <div className={styles.bonusInfo}>
                    <img
                      src={bonuses}
                      alt={t("header.bonusesLabel")}
                      className={styles.bonusIcon}
                    />
                    <span className={styles.bonusText}>
                      {data ? data.bonuses : "0"}
                    </span>
                  </div>
                )}

                <UserMenu className={styles.userMenuDesktop} />
              </div>
            </>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {(isMobileMenuOpen || isSearchOpen) && (
          <motion.div
            className={styles.glassOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
