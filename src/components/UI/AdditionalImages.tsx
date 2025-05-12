import React, { useRef, useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useIsMobile from "@components/Hooks/UseIsMobile";
import styles from "@styles/additional-images.module.scss";
import ImageModal from "./ImageModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface AdditionalImagesProps {
  images: string[];
  currentImageIndex: number;
  openModal: (index: number) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  prevImage: () => void;
  nextImage: () => void;
  setCurrentImageIndex: (index: number) => void;
  coverImage: string;
}

const AdditionalImages: React.FC<AdditionalImagesProps> = ({
  images,
  currentImageIndex,
  openModal,
  closeModal,
  isModalOpen,
  prevImage,
  nextImage,
  setCurrentImageIndex,
  coverImage,
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current || !containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const containerWidth = containerRef.current.clientWidth;

    setIsScrollable(scrollWidth > containerWidth);
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scrollByWidth = useCallback((direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }, []);

  const handleSelect = (i: number) => {
    setCurrentImageIndex(i);
    openModal(i);
  };

  // Don't render if no images
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.additionalImages} ref={scrollContainerRef}>
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={`${import.meta.env.VITE_API_URL}${src}`}
            alt={`Product image ${i + 1}`}
            className={`${styles.additionalImage} ${
              i === currentImageIndex ? styles.active : ""
            }`}
            onClick={() => handleSelect(i)}
            whileHover={{ scale: !isMobile ? 1.05 : 1 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {!isMobile && isScrollable && showLeftButton && (
          <motion.button
            className={`${styles.scrollButton} ${styles.left}`}
            onClick={() => scrollByWidth("left")}
            aria-label="Previous images"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IoIosArrowBack size={24} />
          </motion.button>
        )}

        {!isMobile && isScrollable && showRightButton && (
          <motion.button
            className={`${styles.scrollButton} ${styles.right}`}
            onClick={() => scrollByWidth("right")}
            aria-label="Next images"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IoIosArrowForward size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {isModalOpen && (
        <ImageModal
          images={images}
          currentImageIndex={currentImageIndex}
          onClose={closeModal}
          onPrev={prevImage}
          onNext={nextImage}
          onSelect={handleSelect}
          coverImage={coverImage}
        />
      )}
    </div>
  );
};

export default AdditionalImages;
