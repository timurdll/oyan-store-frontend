import React from "react";
import styles from "@styles/cart-modal.module.scss";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onGoToBasket: () => void;
}

const CartModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  productName,
  onGoToBasket,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Товар добавлен в корзину!</h2>
        <p>{productName} успешно добавлен в вашу корзину.</p>
        <div className={styles.actions}>
          <Button
            label="Перейти в корзину"
            onClick={onGoToBasket}
            variant="filled"
          />
          <Button
            label="Продолжить покупки"
            onClick={onClose}
            variant="outlined"
          />
        </div>
      </div>
    </div>
  );
};

export default CartModal;
