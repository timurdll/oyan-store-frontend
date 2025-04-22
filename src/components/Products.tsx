import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import styles from "@styles/products.module.scss";
import { Product } from "types/types";
import { useFetchProductsQuery } from "@redux/services";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "./UI/SkeletonCard";

interface ProductListProps {
  selectedType: number | null; // Ensure the type is number | null
}

const ProductList: React.FC<ProductListProps> = ({ selectedType }) => {
  const { data: products, error, isLoading } = useFetchProductsQuery({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (selectedType !== null) {
      setFilteredProducts(
        products?.filter(
          (product: Product) => product.typeId === selectedType
        ) || []
      );
    } else {
      setFilteredProducts(products || []);
    }
  }, [selectedType, products]);

  if (isLoading) {
    return (
      <div className={styles.products}>
        <div className={styles.products_container}>
          {[...Array(6)].map((_, index) => (
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
      <motion.div className={styles.products_container} layout>
        <AnimatePresence mode="wait">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className={styles.cardContainer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.43, 0.13, 0.23, 0.96],
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: {
                  duration: 0.2,
                  ease: [0.43, 0.13, 0.23, 0.96],
                },
              }}
              layout
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
