import React from "react";
import { Card } from "./Card";
import styles from "@styles/products.module.scss";
import { Product } from "types/types";
import { useFetchProductsQuery } from "@redux/services";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "./UI/SkeletonCard";
import { useTranslation } from "react-i18next";

interface ProductListProps {
  selectedType: number | null;
}

const ProductList: React.FC<ProductListProps> = ({ selectedType }) => {
  const { i18n } = useTranslation();
  const {
    data: products,
    error,
    isLoading,
  } = useFetchProductsQuery({
    language: i18n.language.toUpperCase(),
    limit: 20,
    ...(selectedType !== null ? { typeId: selectedType } : {}),
  });

  if (isLoading) {
    return (
      <div className={styles.products}>
        <div className={styles.products_container}>
          {[...Array(6)].map((_, index: number) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      "status" in error
        ? `Error ${error.status}: ${JSON.stringify(error.data)}`
        : error.message || "Unknown error";
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className={styles.products}>
      <motion.div className={styles.products_container}>
        <AnimatePresence mode="wait">
          {products?.products?.map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              className={styles.cardContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 0.3, delay: index * 0.05 },
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            >
              <Card product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProductList;
