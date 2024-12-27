// components/ProductCharacteristics.tsx
import React from "react";
import { motion } from "framer-motion";
import { ProductCharacteristic } from "types/types";
import styles from "@styles/product-page.module.scss";

interface ProductCharacteristicsProps {
  productCharacteristics: ProductCharacteristic[];
  showAllCharacteristics: boolean;
  setShowAllCharacteristics: (value: boolean) => void;
}

const ProductCharacteristics: React.FC<ProductCharacteristicsProps> = ({
  productCharacteristics,
  showAllCharacteristics,
  setShowAllCharacteristics,
}) => {
  const characteristicsToShow = showAllCharacteristics
    ? productCharacteristics
    : productCharacteristics.slice(0, 4);

  return (
    <>
      <motion.div
        key="characteristics"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.characteristics}
      >
        {characteristicsToShow.map((char) => (
          <div className={styles.characteristic} key={char.id}>
            <span className={styles.name}>{char.characteristic.name}:</span>
            <span className={styles.description}>{char.description}</span>
          </div>
        ))}
      </motion.div>
      {productCharacteristics.length > 4 && (
        <button
          onClick={() => setShowAllCharacteristics(!showAllCharacteristics)}
          className={styles.showAllButton}
        >
          <span>
            {showAllCharacteristics
              ? "Скрыть характеристики"
              : "Показать все характеристики"}
          </span>
        </button>
      )}
    </>
  );
};

export default ProductCharacteristics;
