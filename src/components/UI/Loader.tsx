import CircularProgress from "@mui/material/CircularProgress";
import styles from "@styles/loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.switch}>
        <div className={styles.circle}></div>
      </div>
      <CircularProgress size={40} className={styles.spinner} />
      <p className={styles.text}>
        Загружаем <span className={styles.bold}>контент</span>
        <br />
        Пожалуйста, подождите...
      </p>
    </div>
  );
};

export default Loader;
