import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import styles from "@styles/order-success-page.module.scss";
import Button from "@components/UI/Button";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
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
    navigate("/"); // Редирект на главную страницу
  };
  const handleGoToOrders = () => {
    navigate("/"); // Редирект на главную страницу
  };

  return (
    <div className={styles.successPage}>
      {/* Конфетти */}
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
      />
      <div className={styles.content}>
        <h1>🎉 Поздравляем!</h1>
        <p>Ваш заказ был успешно создан!</p>
        <p>Спасибо за покупку в нашем магазине.</p>
        <div className={styles.buttons}>
          <Button
            label="На страницу заказов"
            onClick={handleGoHome}
            variant="primary"
          />
          <Button
            label="На домашнюю страницу"
            onClick={handleGoToOrders}
            variant="outlined"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
