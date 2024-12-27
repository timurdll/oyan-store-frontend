import React, { useRef } from "react";
import { motion } from "framer-motion";
import styles from "@styles/additional-images.module.scss";
import ImageModal from "@components/UI/ImageModal";

interface AdditionalImagesProps {
  images: string[];
  currentImageIndex: number;
  openModal: (index: number) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  prevImage: () => void;
  nextImage: () => void;
  setCurrentImageIndex: (index: number) => void; // Новый пропс
}

const AdditionalImages: React.FC<AdditionalImagesProps> = ({
  images,
  currentImageIndex,
  openModal,
  closeModal,
  isModalOpen,
  prevImage,
  nextImage,
  setCurrentImageIndex, // Передаем функцию для изменения индекса
}) => {
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  // Функция для прокрутки влево
  const scrollLeft = () => {
    if (imagesContainerRef.current) {
      imagesContainerRef.current.scrollBy({
        left: -200, // Прокрутка на 200px влево
        behavior: "smooth",
      });
    }
  };

  // Функция для прокрутки вправо
  const scrollRight = () => {
    if (imagesContainerRef.current) {
      imagesContainerRef.current.scrollBy({
        left: 200, // Прокрутка на 200px вправо
        behavior: "smooth",
      });
    }
  };

  // Функция для выбора изображения через миниатюру
  const handleSelect = (index: number) => {
    setCurrentImageIndex(index); // Обновляем текущее изображение
  };

  return (
    <div className={styles.container}>
      <div className={styles.additionalImages} ref={imagesContainerRef}>
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={`http://localhost:3000${image}`}
            alt={`Product image ${index + 1}`}
            className={styles.additionalImage}
            onClick={() => openModal(index)} // Открытие модального окна по клику
            whileHover={{ scale: 1.05 }}
          />
        ))}
      </div>

      {/* Кнопки прокрутки */}
      <button
        className={`${styles.scrollButton} ${styles.left}`}
        onClick={scrollLeft}
      >
        &#8592;
      </button>
      <button
        className={`${styles.scrollButton} ${styles.right}`}
        onClick={scrollRight}
      >
        &#8594;
      </button>

      {/* Модальное окно */}
      {isModalOpen && (
        <ImageModal
          images={images}
          currentImageIndex={currentImageIndex}
          onClose={closeModal}
          onPrev={prevImage}
          onNext={nextImage}
          onSelect={handleSelect} // Передаем функцию выбора изображения
        />
      )}
    </div>
  );
};

export default AdditionalImages;
