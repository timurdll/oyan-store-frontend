import React from "react";
import styles from "@styles/button.module.scss";
import cn from "classnames";

interface ButtonProps {
  label: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant: "primary" | "primaryLarge" | "outlined" | "link";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(styles.button, styles[variant])}
    >
      {label}
    </button>
  );
};

export default Button;
