import React from "react";
import styles from "@styles/button.module.scss";

interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant: "filled" | "outlined" | "link";
  type?: "button" | "submit" | "reset"; // Новый пропс для указания типа кнопки
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant,
  type = "button", // Значение по умолчанию
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export default Button;
