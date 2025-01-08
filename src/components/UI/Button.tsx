import React from "react";
import styles from "@styles/button.module.scss";

interface ButtonProps {
  label: React.ReactNode; // Принимает строку или JSX
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant: "filled" | "outlined" | "link";
  type?: "button" | "submit" | "reset"; // Указание типа кнопки
  disabled?: boolean; // Новый необязательный параметр
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant,
  type = "button",
  disabled = false, // Значение по умолчанию
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled} // Связываем с атрибутом кнопки
    >
      {label}
    </button>
  );
};

export default Button;
