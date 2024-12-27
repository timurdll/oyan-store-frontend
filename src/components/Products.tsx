import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import styles from "@styles/products.module.scss";
import { Product } from "types/types";
import { useFetchProductsQuery } from "@redux/services";
import { motion, AnimatePresence } from "framer-motion";

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

  if (isLoading) return <div>Загрузка...</div>;

  if (error) {
    const errorMessage =
      "status" in error
        ? `Error ${error.status}: ${JSON.stringify(error.data)}`
        : error.message || "Unknown error";
    return <div>Error: {errorMessage}</div>;
  }

  // Define the animation variants for the cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.98, // Card starts small and fades out
    },
    visible: {
      opacity: 1,
      scale: 1, // Card becomes fully visible and scales to normal size
      transition: {
        duration: 0.5, // Duration of the transition
        ease: "easeInOut", // Smooth easing for the transition
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98, // Card fades out and shrinks when it is removed
      transition: {
        duration: 0.3, // Shorter duration when exiting
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={styles.products}>
      <div className={styles.products_container}>
        <AnimatePresence mode="wait">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id + (selectedType || 0)} // Use `key` with `selectedType` to force re-render on category change
              className={styles.cardContainer}
              variants={cardVariants} // Attach the variants to each card
              initial="hidden" // Initial state when card enters
              animate="visible" // Animation state for visible cards
              exit="exit" // Exit animation state
              transition={{
                duration: 0.5,
                delay: index * 0.3, // Delay to create staggered animation effect
              }}
            >
              <Card product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductList;
