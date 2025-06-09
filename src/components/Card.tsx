import React, { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "@styles/card.module.scss";
import useIsProductInBasket from "./Hooks/UseIsInBasket";
import {
  useDeleteProductMutation,
  useCreatePreOrderMutation,
  useGetPreOrdersQuery,
  useQuickPurchaseMutation,
} from "@redux/services";
import useAddToBasket from "./Hooks/UseAddToBasket";
import Alert from "./UI/Alert";
import { formatPrice } from "./Functions/formatPrice";
import { createSlug } from "./Functions/createSlug";
import CartModal from "./UI/CartModal";
import { openAuthModal } from "@redux/slices/authModalSlice";
import Modal from "./UI/Modal";
import { formatPhoneNumber } from "@components/Functions/phoneUtils";
import { useTranslation } from "react-i18next";

type Product = {
  id: number;
  name: string;
  originalName?: string;
  cover_image: string;
  images: string[];
  price: number;
  rating?: number;
  stock: number;
};

interface CardProps {
  product: Product;
}

export const CardComponent: React.FC<CardProps> = ({ product }) => {
  const { i18n } = useTranslation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createPreOrder] = useCreatePreOrderMutation();
  const {
    data: preOrders,
    isLoading: isLoadingPreOrders,
    refetch,
  } = useGetPreOrdersQuery({});

  const [quickPurchase, { isLoading: isQuickPurchaseLoading }] =
    useQuickPurchaseMutation();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.currentUser);
  const isAdmin = user?.role === "admin";
  const { handleAddToBasket } = useAddToBasket();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Preorder modal state
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Quick purchase modal state
  const [isQuickPurchaseModalOpen, setIsQuickPurchaseModalOpen] =
    useState(false);
  const [quickPurchaseName, setQuickPurchaseName] = useState("");
  const [quickPurchasePhone, setQuickPurchasePhone] = useState("");

  const formattedPrice = formatPrice(product.price);
  const { isInBasket } = useIsProductInBasket(product.id);

  const hasPreOrder = useMemo(() => {
    if (!preOrders || !Array.isArray(preOrders)) return false;
    return preOrders.some((order) => order.productId === product.id);
  }, [preOrders, product.id]);

  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id).unwrap();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // console.log(
  //   product.cover_image.startsWith("http")
  //     ? product.cover_image
  //     : `${import.meta.env.VITE_API_URL}${product.cover_image}`
  // );

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (!user) {
      // Если пользователь не авторизован, открываем модалку для быстрой покупки
      setIsQuickPurchaseModalOpen(true);
      return;
    }

    if (isInBasket) {
      handleRedirect(event);
    } else {
      setIsLoading(true);
      try {
        await handleAddToBasket(product.id);
        setIsModalOpen(true);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Не удалось добавить товар в корзину. Попробуйте еще раз.";
        setAlert({ message: errorMessage, type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeAlert = () => setAlert(null);

  const handleRedirect = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const slug = createSlug(product.name, product.originalName);
    navigate(`/${i18n.language}/product/${slug}`);
  };

  const handleGoToBasket = () => {
    setIsModalOpen(false);
    navigate("/basket");
  };

  // Обработчик изменения номера телефона для предзаказа с форматированием
  const handlePreOrderPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPhoneNumber(formatPhoneNumber(value));
    },
    []
  );

  const handlePreOrderSubmit = async () => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedPhoneNumber.length < 10) {
      setAlert({
        message: "Пожалуйста, введите корректный номер телефона",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createPreOrder({
        productId: product.id,
        phoneNumber: cleanedPhoneNumber,
      }).unwrap();

      setIsPreOrderModalOpen(false);
      setAlert({ message: "Предзаказ успешно оформлен!", type: "success" });
      setPhoneNumber("");
    } catch (error) {
      setAlert({
        message: "Не удалось оформить предзаказ. Попробуйте позже.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      refetch();
    }
  };

  const openPreOrderModal = () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    if (hasPreOrder) {
      setAlert({
        message: "Вы уже оформили предзаказ на этот товар",
        type: "error",
      });
      return;
    }
    setIsPreOrderModalOpen(true);
  };

  // Обработчик изменения номера телефона для покупки в один клик с форматированием
  const handleQuickPurchasePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setQuickPurchasePhone(formatPhoneNumber(value));
    },
    []
  );

  const handleQuickPurchaseSubmit = async () => {
    const cleanedPhoneNumber = quickPurchasePhone.replace(/\D/g, "");
    if (quickPurchaseName.trim() === "" || cleanedPhoneNumber.length < 10) {
      setAlert({
        message: "Пожалуйста, заполните все поля корректно",
        type: "error",
      });
      return;
    }

    try {
      await quickPurchase({
        fullName: quickPurchaseName,
        phoneNumber: cleanedPhoneNumber,
        productId: product.id,
      }).unwrap();
      setIsQuickPurchaseModalOpen(false);
      setAlert({
        message:
          "Запрос на быструю покупку отправлен и будет обработан в ближайшее время",
        type: "success",
      });
      setQuickPurchaseName("");
      setQuickPurchasePhone("");
    } catch (error) {
      setAlert({
        message: "Ошибка отправки заявки. Попробуйте позже.",
        type: "error",
      });
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const renderActionButton = () => {
    if (isAdmin) {
      return (
        <>
          <Button
            label="Редактировать"
            onClick={() =>
              navigate(`/${i18n.language}/admin/edit/${product.id}`)
            }
            variant="primary"
          />
          <Button
            label="Удалить"
            onClick={handleDeleteProduct}
            variant="outlined"
          />
        </>
      );
    }

    if (product.stock === 0) {
      if (hasPreOrder) {
        return (
          <Button
            label="Предзаказ оформлен"
            variant="primary"
            disabled={true}
          />
        );
      }
      return (
        <Button
          label="Предзаказ"
          onClick={openPreOrderModal}
          variant="primary"
          disabled={isLoading || isLoadingPreOrders}
        />
      );
    }

    return (
      <Button
        label={
          isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isInBasket ? (
            "В корзине"
          ) : (
            "Купить"
          )
        }
        onClick={(event) => handleButtonClick(event)}
        variant="primary"
        disabled={isLoading}
      />
    );
  };

  return (
    <>
      <div className={styles.card}>
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={closeAlert}
          />
        )}
        <div className={styles.content}>
          {isImageLoading ? (
            <div className={styles.skeleton}>
              <div className={styles.skeletonImage} />
            </div>
          ) : (
            <img
              src={`${product.cover_image}`}
              alt={product.name}
              className={styles.cover_image}
              onClick={handleRedirect}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            />
          )}
          <div className={styles.info}>
            <h2 className={styles.title} onClick={handleRedirect}>
              {product.name}
            </h2>
            <p className={styles.price} onClick={handleRedirect}>
              {formattedPrice} ₸
            </p>
            {product.rating && (
              <p className={styles.rating}>Оценки: {product.rating} ⭐</p>
            )}
          </div>
          <div className={styles.buttons}>{renderActionButton()}</div>
        </div>
      </div>

      <Modal
        isOpen={isPreOrderModalOpen}
        onClose={() => setIsPreOrderModalOpen(false)}
        title="Оформление предзаказа"
      >
        <div className={styles.preOrderModalContent}>
          <p>
            Введите номер телефона для предзаказа <br /> мы уведомим вас, когда
            товар будет в наличии
          </p>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePreOrderPhoneChange}
            placeholder="+7 (___) ___-__-__"
            className={styles.phoneInput}
          />
          <div className={styles.modalButtons}>
            <Button
              label="Отмена"
              onClick={() => setIsPreOrderModalOpen(false)}
              variant="outlined"
            />
            <Button
              label={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Подтвердить"
                )
              }
              onClick={handlePreOrderSubmit}
              variant="primary"
              disabled={isLoading}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isQuickPurchaseModalOpen}
        onClose={() => setIsQuickPurchaseModalOpen(false)}
        title="Покупка в один клик"
      >
        <div className={styles.quickPurchaseContent}>
          <input
            type="text"
            value={quickPurchaseName}
            onChange={(e) => setQuickPurchaseName(e.target.value)}
            placeholder="Ваше имя"
            className={styles.input}
          />
          <input
            type="tel"
            value={quickPurchasePhone}
            onChange={handleQuickPurchasePhoneChange}
            placeholder="+7 (___) ___-__-__"
            className={styles.input}
          />
          <div className={styles.modalButtons}>
            <Button
              label={
                isQuickPurchaseLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Купить"
                )
              }
              onClick={handleQuickPurchaseSubmit}
              variant="primary"
              disabled={isQuickPurchaseLoading}
            />
          </div>
        </div>
      </Modal>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        onGoToBasket={handleGoToBasket}
      />
    </>
  );
};

export const Card = React.memo(CardComponent);
