import React, { useCallback, useState } from "react";
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
import Modal from "@components/UI/Modal";
import { useQuickPurchaseMutation } from "@redux/services";
import { formatPhoneNumber } from "@components/Functions/phoneUtils";
import useIsMobile from "@components/Hooks/UseIsMobile";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import SEO from "@components/SEO";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {
    data: product,
    error,
    isLoading,
  } = useFetchProductBySlugQuery({
    slug,
    language: i18n.language.toUpperCase(),
  });
  const user = useSelector((state: any) => state.user.currentUser);
  const [quickPurchase, { isLoading: isQuickPurchaseLoading }] =
    useQuickPurchaseMutation();
  const isMobile = useIsMobile();

  const [activeSection, setActiveSection] = useState("characteristics");
  const [sectionDirection, setSectionDirection] = useState<"left" | "right">(
    "right"
  );
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

  const [isQuickPurchaseModalOpen, setIsQuickPurchaseModalOpen] =
    useState(false);
  const [quickPurchaseName, setQuickPurchaseName] = useState("");
  const [quickPurchasePhone, setQuickPurchasePhone] = useState("");

  const handleQuickPurchasePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuickPurchasePhone(formatPhoneNumber(e.target.value));
    },
    []
  );

  const handleQuickPurchaseSubmit = async () => {
    const cleaned = quickPurchasePhone.replace(/\D/g, "");
    if (!quickPurchaseName.trim() || cleaned.length < 10) {
      setAlert({
        message: "Пожалуйста, заполните все поля корректно",
        type: "error",
      });
      return;
    }
    try {
      await quickPurchase({
        productId: product!.id,
        phoneNumber: cleaned,
        fullName: quickPurchaseName,
      }).unwrap();
      setIsQuickPurchaseModalOpen(false);
      setAlert({
        message: "Ваш заказ принят, мы свяжемся с вами!",
        type: "success",
      });
      setQuickPurchaseName("");
      setQuickPurchasePhone("");
    } catch {
      setAlert({ message: "Ошибка. Попробуйте позже.", type: "error" });
    }
  };

  const handleSectionChange = (section: string) => {
    if (section === "characteristics" && activeSection === "description") {
      setSectionDirection("right");
    } else if (
      section === "description" &&
      activeSection === "characteristics"
    ) {
      setSectionDirection("left");
    }
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.product}>
          <div className={styles.imageContainer}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={isMobile ? 350 : 488}
              sx={{
                borderRadius: "12px",
                minHeight: isMobile ? "350px" : "488px",
                backgroundColor: "#f4f4f4",
              }}
            />
            {isMobile && (
              <>
                <div className={styles.mobileNavArrows}>
                  <div className={`${styles.navArrow} ${styles.left}`}>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ backgroundColor: "#f4f4f4" }}
                    />
                  </div>
                  <div className={`${styles.navArrow} ${styles.right}`}>
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ backgroundColor: "#f4f4f4" }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.info}>
            <Skeleton
              variant="text"
              width="100%"
              height={isMobile ? 32 : 48}
              sx={{ backgroundColor: "#f4f4f4" }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={isMobile ? 24 : 36}
              sx={{ backgroundColor: "#f4f4f4" }}
            />
            <div className={styles.buttons}>
              <Skeleton
                variant="rectangular"
                width={isMobile ? "48%" : "100%"}
                height={48}
                sx={{ borderRadius: "30px", backgroundColor: "#f4f4f4" }}
              />
              <Skeleton
                variant="rectangular"
                width={isMobile ? "48%" : "100%"}
                height={48}
                sx={{ borderRadius: "30px", backgroundColor: "#f4f4f4" }}
              />
            </div>

            <div className={styles.marketplaceSection}>
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                sx={{ backgroundColor: "#f4f4f4" }}
              />
              <div className={styles.marketplaceIcons}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="circular"
                    width={48}
                    height={48}
                    sx={{ backgroundColor: "#f4f4f4" }}
                  />
                ))}
              </div>
            </div>

            {!isMobile && (
              <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={90}
                    height={90}
                    sx={{ borderRadius: "12px", backgroundColor: "#f4f4f4" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.sectionButtons}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ borderRadius: "8px", backgroundColor: "#f4f4f4" }}
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ borderRadius: "8px", backgroundColor: "#f4f4f4" }}
          />
        </div>
        <div className={styles.sectionContent}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ borderRadius: "30px", backgroundColor: "#f4f4f4" }}
          />
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
      currentImageIndex === 0 ? product.images.length : currentImageIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === product.images.length ? 0 : currentImageIndex + 1
    );
  };

  const renderCharacteristics = () => {
    if (!product?.productCharacteristics) return null;

    const characteristics = showAllCharacteristics
      ? product.productCharacteristics
      : product.productCharacteristics.slice(0, 4);

    return (
      <>
        {characteristics.map((char: ProductCharacteristic) => (
          <motion.div
            className={styles.characteristic}
            key={char.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className={styles.name}>
              {char.characteristic.translation?.name ||
                char.characteristic.name}
              :
            </span>
            <span className={styles.description}>
              {` ${char.translation?.description || char.description}`}
            </span>
          </motion.div>
        ))}
        {product.productCharacteristics.length > 4 && (
          <motion.button
            onClick={() => setShowAllCharacteristics(!showAllCharacteristics)}
            className={styles.showAllButton}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
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
                ? t("product.showLess")
                : t("product.showMore")}
            </span>
          </motion.button>
        )}
      </>
    );
  };

  const handleButtonClick = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    if (isInBasket) {
      navigate(`/${i18n.language}/basket`);
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

  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.productInfo?.description,
        image: product.images?.[0]?.url,
        brand: {
          "@type": "Brand",
          name: "Oyan Store",
        },
        offers: {
          "@type": "Offer",
          url: `https://oyan-store.kz/${i18n.language}/product/${slug}`,
          priceCurrency: "KZT",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Oyan Store",
          },
        },
        aggregateRating: product.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews?.length || 0,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {product && (
        <SEO
          title={product.name}
          description={product.productInfo?.description || product.name}
          keywords={`${product.name}, ${product.productInfo?.title}, купить ${product.name}, цена ${product.name}`}
          image={product.images?.[0]?.url}
          type="product"
          canonicalUrl={`https://oyan-store.kz/${i18n.language}/product/${slug}`}
          structuredData={structuredData}
          locale={i18n.language}
          alternateLocales={[
            { locale: "ru", url: `https://oyan-store.kz/ru/product/${slug}` },
            { locale: "kk", url: `https://oyan-store.kz/kk/product/${slug}` },
          ]}
        />
      )}
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
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={closeAlert}
          />
        )}

        <div className={styles.product}>
          <div className={styles.imageContainer}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                className={styles.image}
                src={`${import.meta.env.VITE_API_URL}${
                  currentImageIndex === 0
                    ? product.cover_image
                    : product.images[currentImageIndex - 1]
                }`}
                alt={product.name}
                onClick={() => openModal(currentImageIndex)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {isMobile && product.images.length > 0 && (
              <>
                <div className={styles.mobileNavArrows}>
                  <div
                    className={`${styles.navArrow} ${styles.left}`}
                    onClick={prevImage}
                  >
                    <IoChevronBack size={24} />
                  </div>
                  <div
                    className={`${styles.navArrow} ${styles.right}`}
                    onClick={nextImage}
                  >
                    <IoChevronForward size={24} />
                  </div>
                </div>

                {/* <div className={styles.imageIndicator}>
                  {Array.from({ length: product.images.length + 1 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={`${styles.dot} ${
                          currentImageIndex === index ? styles.active : ""
                        }`}
                      />
                    )
                  )}
                </div> */}
              </>
            )}
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.price}>{formatPrice(product.price)} ₸</span>
            <div className={styles.buttons}>
              {product.stock === 0 ? (
                <Button
                  label={t("product.outOfStock")}
                  variant="outlined"
                  disabled
                />
              ) : (
                <>
                  <Button
                    label={
                      isLoadingBasket
                        ? t("product.adding")
                        : isInBasket
                        ? t("product.goToCart")
                        : t("product.addToCart")
                    }
                    onClick={handleButtonClick}
                    variant={isInBasket ? "outlined" : "primaryLarge"}
                  />
                  <Button
                    label={t("product.quickPurchase")}
                    variant="primaryLarge"
                    onClick={() => setIsQuickPurchaseModalOpen(true)}
                  />
                </>
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
                  {t("product.marketplaces.title")}
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

            {!isMobile && (
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
            )}
          </div>
        </div>

        <div className={styles.sectionButtons}>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "characteristics" ? styles.active : ""
            } ${sectionDirection === "right" ? styles.slideRight : ""}`}
            onClick={() => handleSectionChange("characteristics")}
          >
            {t("product.characteristics")}
          </button>
          <button
            className={`${styles.sectionButton} ${
              activeSection === "description" ? styles.active : ""
            } ${sectionDirection === "left" ? styles.slideLeft : ""}`}
            onClick={() => handleSectionChange("description")}
          >
            {t("product.description")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <div className={styles.sectionContent}>
            {activeSection === "characteristics" && (
              <motion.div
                key="characteristics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={styles.characteristics}
              >
                {renderCharacteristics()}
              </motion.div>
            )}

            {activeSection === "description" && (
              <motion.div
                className={styles.description}
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {product.productInfo.description}
                </motion.p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
        <Modal
          isOpen={isQuickPurchaseModalOpen}
          onClose={() => setIsQuickPurchaseModalOpen(false)}
          title={t("product.quickPurchaseModal.title")}
        >
          <div className={styles.quickPurchaseForm}>
            <input
              type="text"
              placeholder={t("product.quickPurchaseModal.namePlaceholder")}
              value={quickPurchaseName}
              onChange={(e) => setQuickPurchaseName(e.target.value)}
            />
            <input
              type="tel"
              placeholder={t("product.quickPurchaseModal.phonePlaceholder")}
              value={quickPurchasePhone}
              onChange={handleQuickPurchasePhoneChange}
            />
            <Button
              label={
                isQuickPurchaseLoading
                  ? t("product.quickPurchaseModal.submitting")
                  : t("product.quickPurchaseModal.submit")
              }
              onClick={handleQuickPurchaseSubmit}
              variant="primaryLarge"
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProductPage;
