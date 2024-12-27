// components/ProductImageSection.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageModal from "@components/UI/ImageModal";
import { Product } from "types/types";
import styles from "@styles/product-page.module.scss";

interface ProductImageSectionProps {
  product: Product;
  currentImageIndex: number;
  isModalOpen: boolean;
  openModal: (index: number) => void;
  closeModal: () => void;
  prevImage: () => void;
  nextImage: () => void;
}

const ProductImageSection: React.FC<ProductImageSectionProps> = ({
  product,
  currentImageIndex,
  isModalOpen,
  openModal,
  closeModal,
  prevImage,
  nextImage,
}) => {
  const handleSelectImage = (index: number) => {
    openModal(index); // Update the modal to show the selected image
  };

  return (
    <div className={styles.product}>
      <motion.img
        className={styles.image}
        src={`http://localhost:3000${product.cover_image}`}
        alt={product.name}
        onClick={() => openModal(0)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className={styles.additionalImages}>
        {product.images.map((image, index) => (
          <motion.img
            key={index}
            src={`http://localhost:3000${image}`}
            alt={`Product image ${index + 1}`}
            className={styles.additionalImage}
            onClick={() => openModal(index)}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <ImageModal
            images={product.images}
            currentImageIndex={currentImageIndex}
            onClose={closeModal}
            onPrev={prevImage}
            onNext={nextImage}
            onSelect={handleSelectImage} // Pass the handler here
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductImageSection;
