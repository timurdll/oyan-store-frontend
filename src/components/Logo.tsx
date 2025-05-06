import { Link } from "react-router-dom";
import styles from "../styles/logo.module.scss";
import logoImage from "../assets/images/tumbler.svg";

export const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <img src={logoImage} alt="Oyan Store" className={styles.logoImage} />
      <h1 className={styles.logoText}>
        Oyan<span>Store</span>
      </h1>
    </Link>
  );
};
