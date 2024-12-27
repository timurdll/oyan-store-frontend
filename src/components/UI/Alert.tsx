// components/Alert.tsx
import React from "react";
import styles from "@styles/alert.module.scss";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
};

export default Alert;
