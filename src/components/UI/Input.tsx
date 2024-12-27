import React from "react";
import styles from "@styles/input.module.scss";

// Интерфейс для пропсов компонента Input
interface InputProps {
  type: string;
  label: string; // Добавлен новый пропс для label
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <label className={styles.field}>
      {label}:
      <input
        type={type}
        name={label} // Используем label для name, если нужно, можно адаптировать
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
};

export default Input;
