import React from "react";
import { motion } from "framer-motion";
import styles from "@styles/image-modal.module.scss";
import closeIcon from "@assets/images/close.svg";
import arrow from "@assets/images/sliderArrow.svg";

interface ImageModalProps {
  images: string[];
  currentImageIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  coverImage: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentImageIndex,
  onClose,
  onPrev,
  onNext,
  onSelect,
  coverImage,
}) => {
  const allImages = [coverImage, ...images].filter(Boolean);
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.imageWrapper}>
          <motion.img
            src={`${import.meta.env.VITE_API_URL}${
              allImages[currentImageIndex]
            }`}
            alt={`Image ${currentImageIndex + 1}`}
            className={styles.image}
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className={styles.controls}>
            <img className={styles.prevButton} onClick={onPrev} src={arrow} />
            <img className={styles.nextButton} onClick={onNext} src={arrow} />
          </div>
        </div>

        <div className={styles.thumbnailContainer}>
          {allImages.map((image, index) => (
            <img
              key={index}
              src={`${import.meta.env.VITE_API_URL}${image}`}
              alt={`Thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${
                index === currentImageIndex ? styles.activeThumbnail : ""
              }`}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
      </motion.div>
    </div>
  );
};

export default ImageModal;
