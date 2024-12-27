import React from "react";
import plusIcon from "@assets/images/plus.svg";
import minusIcon from "@assets/images/minus.svg";
import styles from "@styles/counter.module.scss";

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className={styles.counter}>
      <button onClick={onDecrement}>
        <img src={minusIcon} alt="Decrease quantity" />
      </button>
      {value}
      <button onClick={onIncrement}>
        <img src={plusIcon} alt="Increase quantity" />
      </button>
    </div>
  );
};

export default Counter;
