import React from "react";
import styles from "@styles/steps.module.scss";
import Button from "@components/UI/Button";
import { CircularProgress } from "@mui/material";

interface StepPaymentProps {
  paymentMethod: string[];
  setPaymentMethod: React.Dispatch<React.SetStateAction<string[]>>; // Update here
  handleOrderSubmit: () => void;
  completed: boolean;
  isLoading: boolean; // Новое свойство
}

const StepPayment: React.FC<StepPaymentProps> = ({
  paymentMethod,
  setPaymentMethod,
  handleOrderSubmit,
  completed,
  isLoading,
}) => {
  const paymentOptions = [
    { id: "credit_card", label: "Kaspi удаленный счет на оплату" },
  ];

  const handleCheckboxChange = (method: string) => {
    setPaymentMethod((prevMethods) =>
      prevMethods.includes(method)
        ? prevMethods.filter((item) => item !== method)
        : [...prevMethods, method]
    );
  };

  return (
    <div className={styles.step}>
      <div className={styles.info}>
        <span className={styles.number}>3</span>
        <span className={styles.text}>Способ оплаты:</span>
      </div>
      <div className={styles.inputs_3}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="paymentMethod">Выберите способ оплаты:</label>
            <div className={styles.checkboxGroup}>
              {paymentOptions.map((option) => (
                <div className={styles.checkbox} key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={paymentMethod.includes(option.id)}
                    onChange={() => handleCheckboxChange(option.id)}
                  />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!completed && (
        <div className={styles.button}>
          <Button
            onClick={handleOrderSubmit}
            label={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Оформить заказ"
              )
            }
            variant="primaryLarge"
            disabled={isLoading} // Отключаем кнопку во время загрузки
          />
        </div>
      )}
    </div>
  );
};

export default StepPayment;
