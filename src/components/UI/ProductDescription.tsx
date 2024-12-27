// components/ProductDescription.tsx
import React from "react";
import { motion } from "framer-motion";
import styles from "@styles/product-page.module.scss";
import { Product } from "types/types";

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  if (!product.productInfo || !product.productInfo.description) {
    return <p>Описание недоступно</p>;
  }

  return (
    <motion.div
      className={styles.description}
      key="description"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
    >
      <p>{product.productInfo.description}</p>
    </motion.div>
  );
};

export default ProductDescription;
