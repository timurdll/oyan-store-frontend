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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [images]);

  // Check scroll position to show/hide navigation buttons
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const isAtStart = scrollLeft <= 10;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

      setShowLeftButton(!isAtStart);
      setShowRightButton(!isAtEnd);
    }
  }, []);

  // Add scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () =>
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
    }
  }, [checkScrollButtons]);

  // Scroll to selected item
  useEffect(() => {
    if (scrollContainerRef.current && images.length > 0) {
      const container = scrollContainerRef.current;
      const imageElements = container.querySelectorAll(
        `.${styles.additionalImage}`
      );

      if (imageElements[currentImageIndex]) {
        const imageElement = imageElements[currentImageIndex];
        const containerLeft = container.getBoundingClientRect().left;
        const imageLeft = imageElement.getBoundingClientRect().left;
        const imageWidth = imageElement.clientWidth;
        const containerWidth = container.clientWidth;

        // Center the image in the container
        container.scrollTo({
          left:
            container.scrollLeft +
            (imageLeft - containerLeft) -
            containerWidth / 2 +
            imageWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentImageIndex, images.length]);

  // Scroll by specific width
  const scrollByWidth = useCallback(
    (direction: "left" | "right") => {
      if (!scrollContainerRef.current) return;

      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 400);
    },
    [checkScrollButtons]
  );

  const handleSelect = (i: number) => {
    setCurrentImageIndex(i);
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
            onClick={() => openModal(i)}
            whileHover={{ scale: !isMobile ? 1.05 : 1 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* Show navigation arrows only when needed */}
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
        />
      )}
    </div>
  );
};

export default AdditionalImages;
