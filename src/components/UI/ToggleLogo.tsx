import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { toggleTheme } from "@redux/slices/themeSlice";
import styles from "@styles/toggle-logo.module.scss";
import logoBlack from "@assets/images/logo-letter.svg";
import logoWhite from "@assets/images/logo-letter-white.svg";
import { m } from "framer-motion";
import { Link } from "react-router-dom";

const ToggleLogo: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const logoSrc = isDarkMode ? logoWhite : logoBlack;

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };
  const createShakeEffect = () => ({
    visible: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.9,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 4.0,
        delay: 4,
      },
    },
  });
  const shakeEffect = createShakeEffect();

  return (
    <div className={styles.logo}>
      <m.div variants={shakeEffect} animate="visible">
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={!isDarkMode}
            onChange={handleToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </m.div>
      <Link to={"/"}>
        <div className={styles.text}>
          <img src={logoSrc} alt="YAN" />
        </div>
      </Link>
    </div>
  );
};

export default ToggleLogo;
