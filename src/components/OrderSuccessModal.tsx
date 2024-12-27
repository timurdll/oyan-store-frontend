import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import styles from "@styles/order-success.module.scss";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <ReactConfetti width={windowSize.width} height={windowSize.height} />
        <h2>🎉 Поздравляем с успешным заказом! 🎉</h2>
        <p>Ваш заказ был успешно оформлен. Спасибо за покупку!</p>
        <button className={styles.closeButton} onClick={onClose}>
          Закрыть
        </button>
      </motion.div>
    </div>
  );
};

export default OrderSuccessModal;
