import React from "react";
import plusIcon from "@assets/images/plus.svg";
import minusIcon from "@assets/images/minus.svg";
import styles from "@styles/counter.module.scss";

interface CounterProps {
  value: number;
  stock: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onLimitReached?: (message: string) => void;
}

const Counter: React.FC<CounterProps> = ({
  value,
  stock,
  onIncrement,
  onDecrement,
  onLimitReached,
}) => {
  return (
    <div className={styles.counter}>
      <button onClick={onDecrement}>
        <img src={minusIcon} alt="Decrease quantity" />
      </button>
      {value}
      <button
        onClick={() => {
          if (value + 1 > stock) {
            if (onLimitReached) {
              onLimitReached(`Максимальное количество: ${stock}`);
            }
            return;
          }
          onIncrement();
        }}
      >
        <img src={plusIcon} alt="Increase quantity" />
      </button>
    </div>
  );
};

export default Counter;
