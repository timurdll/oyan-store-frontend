import React from "react";
import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";

const Logo: React.FC = () => {
  return (
    <div className={styles.logoContainer}>
      <Link to="/" className={styles.logoLink}>
        <img src="/logo.png" alt="Oyan Store" className={styles.logo} />
      </Link>
    </div>
  );
};

export default Logo;
