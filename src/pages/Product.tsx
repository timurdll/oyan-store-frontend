import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchProductBySlugQuery } from "@redux/services";
import { ProductCharacteristic } from "types/types";
import styles from "@styles/product-page.module.scss";
import Button from "@components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import useAddToBasket from "@components/Hooks/UseAddToBasket";
import useIsProductInBasket from "@components/Hooks/UseIsInBasket";
import Alert from "@components/UI/Alert";
import { formatPrice } from "@components/Functions/formatPrice";
import arrow from "@assets/images/arrow.svg";
import { openAuthModal } from "@redux/slices/authModalSlice";
import AdditionalImages from "@components/UI/AdditionalImages";
import { Skeleton } from "@mui/material";
import { Helmet } from "react-helmet";
import kaspiIcon from "@assets/images/kaspi.svg";
import halyqIcon from "@assets/images/halyk.svg";
import satuIcon from "@assets/images/satu.svg";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: product, error, isLoading } = useFetchProductBySlugQuery(slug);
  const user = useSelector((state: any) => state.user.currentUser);

  const [activeSection, setActiveSection] = useState("characteristics");
  const [showAllCharacteristics, setShowAllCharacteristics] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isInBasket } = useIsProductInBasket(
    user && product ? product.id : null
  );
  const { isLoading: isLoadingBasket, handleAddToBasket } = useAddToBasket();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.product}>
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{ minHeight: "233px", borderRadius: "30px" }}
          />
          <div className={styles.info}>
            <Skeleton variant="text" width="80%" height={48} />
            <Skeleton variant="text" width="60%" height={36} />
            <div className={styles.buttons}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={28}
                sx={{ borderRadius: "30px" }}
              />
            </div>
            <div className={styles.images}>
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={124}
                  height={124}
                  sx={{ borderRadius: "30px" }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.sectionButtons}>
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} variant="text" width={120} height={30} />
          ))}
        </div>
        <div className={styles.sectionContent}>
          <Skeleton variant="text" width="100%" height={200} />
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

  if (!product) return <div>Товар не найден</div>;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const prevImage = () => {
    setCurrentImageIndex(
      currentImageIndex === 0
        ? product.images.length - 1
        : currentImageIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === product.images.length - 1
        ? 0
        : currentImageIndex + 1
    );
  };

  const characteristicsToShow = showAllCharacteristics
    ? product.productCharacteristics
    : product.productCharacteristics.slice(0, 4);

  const handleButtonClick = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    if (isInBasket) {
      navigate("/basket");
    } else {
      try {
        await handleAddToBasket(product.id, 1);
        setAlert({
          message: "Товар успешно добавлен в корзину!",
          type: "success",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Не удалось добавить товар в корзину. Попробуйте еще раз.";
        setAlert({ message: errorMessage, type: "error" });
      }
    }
  };

  const closeAlert = () => setAlert(null);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{product.name} | Купить в Oyan Store</title>
        <meta
          name="description"
          content={
            product.productInfo?.description?.slice(0, 150) ||
            `${product.name} — доступная техника от Oyan Store. Купить на kaspi.kz, Halyk Market и Satu.kz.`
          }
        />
        <link
          rel="canonical"
          href={`https://oyan-store.kz/product/${product.slug}`}
        />
        <meta
          property="og:title"
          content={`${product.name} | Купить в Oyan Store`}
        />
        <meta
          property="og:description"
          content={
            product.productInfo?.description?.slice(0, 150) ||
            `${product.name} — техника от Oyan Store с гарантией и сервисом.`
          }
        />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_API_URL}${product.cover_image}`}
        />
        <meta
          property="og:url"
          content={`https://oyan-store.kz/product/${product.slug}`}
        />
        <meta property="og:type" content="product" />
      </Helmet>

      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={closeAlert} />
      )}

      <div className={styles.product}>
        <motion.img
          className={styles.image}
          src={`${import.meta.env.VITE_API_URL}${product.cover_image}`}
          alt={product.name}
          onClick={() => openModal(0)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className={styles.info}>
          <span className={styles.name}>{product.name}</span>
          <span className={styles.price}>{formatPrice(product.price)} ₸</span>
          <div className={styles.buttons}>
            {product.stock === 0 ? (
              <Button label="Товар закончился" variant="outlined" disabled />
            ) : (
              <Button
                label={
                  isLoadingBasket
                    ? "Добавляется..."
                    : isInBasket
                    ? "Перейти в корзину"
                    : "Добавить в корзину"
                }
                onClick={handleButtonClick}
                variant={isInBasket ? "outlined" : "filled"}
              />
            )}
          </div>

          {(product.halyqLink || product.kaspiLink || product.satuLink) && (
            <motion.div
              className={styles.marketplaceSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.marketplaceTitle}>
                Купить на маркетплейсах:
              </div>
              <div className={styles.marketplaceIcons}>
                {product.kaspiLink && (
                  <a
                    href={product.kaspiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={kaspiIcon} alt="Kaspi" />
                  </a>
                )}
                {product.halyqLink && (
                  <a
                    href={product.halyqLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={halyqIcon} alt="Halyk Market" />
                  </a>
                )}
                {product.satuLink && (
                  <a
                    href={product.satuLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={satuIcon} alt="Satu.kz" />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          <AdditionalImages
            images={product.images}
            currentImageIndex={currentImageIndex}
            openModal={openModal}
            closeModal={closeModal}
            isModalOpen={isModalOpen}
            prevImage={prevImage}
            nextImage={nextImage}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        </div>
      </div>

      <div className={styles.sectionButtons}>
        <button
          className={`${styles.sectionButton} ${
            activeSection === "characteristics" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("characteristics")}
        >
          Характеристики
        </button>
        <button
          className={`${styles.sectionButton} ${
            activeSection === "description" ? styles.active : ""
          }`}
          onClick={() => setActiveSection("description")}
        >
          Описание
        </button>
      </div>

      <AnimatePresence mode="wait">
        <div className={styles.sectionContent}>
          {activeSection === "characteristics" && (
            <>
              <motion.div
                key="characteristics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={styles.characteristics}
              >
                {characteristicsToShow.map((char: ProductCharacteristic) => (
                  <div className={styles.characteristic} key={char.id}>
                    <span className={styles.name}>
                      {char.characteristic.name}:
                    </span>
                    <span className={styles.description}>
                      {char.description}
                    </span>
                  </div>
                ))}
              </motion.div>
              {product.productCharacteristics.length > 4 && (
                <button
                  onClick={() =>
                    setShowAllCharacteristics(!showAllCharacteristics)
                  }
                  className={styles.showAllButton}
                >
                  <div className={styles.arrow}>
                    <motion.img
                      src={arrow}
                      alt="arrow"
                      animate={{ rotate: showAllCharacteristics ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span>
                    {showAllCharacteristics
                      ? "Скрыть характеристики"
                      : "Показать все характеристики"}
                  </span>
                </button>
              )}
            </>
          )}

          {activeSection === "description" && (
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
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;
