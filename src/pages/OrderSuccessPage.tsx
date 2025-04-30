import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import styles from "@styles/order-success-page.module.scss";
import Button from "@components/UI/Button";
import { useTranslation } from "react-i18next";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Обновляем размеры окна для правильного отображения конфетти
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGoHome = () => {
    navigate(`/${i18n.language}`);
  };

  const handleGoToOrders = () => {
    navigate(`/${i18n.language}/orders`);
  };

  return (
    <div className={styles.successPage}>
      {/* Конфетти */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
      />
      <div className={styles.content}>
        <h1>🎉 {t("orderSuccess.congratulations")}</h1>
        <p>{t("orderSuccess.orderCreated")}</p>
        <p>{t("orderSuccess.thankYou")}</p>
        <div className={styles.buttons}>
          <Button
            label={t("orderSuccess.goToOrders")}
            onClick={handleGoToOrders}
            variant="primary"
          />
          <Button
            label={t("orderSuccess.goToHome")}
            onClick={handleGoHome}
            variant="outlined"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
