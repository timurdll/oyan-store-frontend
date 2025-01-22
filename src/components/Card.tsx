import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "@styles/card.module.scss";
import useIsProductInBasket from "./Hooks/UseIsInBasket";
import { useDeleteProductMutation } from "@redux/services";
import useAddToBasket from "./Hooks/UseAddToBasket";
import Alert from "./UI/Alert";
import { formatPrice } from "./Functions/formatPrice";
import { createSlug } from "./Functions/createSlug";
import CartModal from "./UI/CartModal";
import { openAuthModal } from "@redux/slices/authModalSlice"; // Add this import

type Product = {
  id: number;
  name: string;
  cover_image: string;
  images: string[];
  price: number;
  rating?: number;
  stock: number;
};

interface CardProps {
  product: Product;
}

export const Card: React.FC<CardProps> = ({ product }) => {
  const [deleteProduct] = useDeleteProductMutation();
  const dispatch = useDispatch(); // Add dispatch
  const user = useSelector((state: any) => state.user.currentUser);
  const isAdmin = user?.role === "admin";
  const { handleAddToBasket } = useAddToBasket();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const formattedPrice = formatPrice(product.price);

  // Only check isInBasket if the user is logged in
  const { isInBasket } = useIsProductInBasket(product.id);

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id).unwrap();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    // If user is not logged in, show auth modal
    if (!user) {
      dispatch(openAuthModal());
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
    let slug = createSlug(product.name);
    navigate(`/product/${slug}`);
  };

  const handleGoToBasket = () => {
    setIsModalOpen(false);
    navigate("/basket");
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
          <img
            src={`${import.meta.env.VITE_API_URL}${product.cover_image}`}
            alt={product.name}
            className={styles.cover_image}
            onClick={handleRedirect}
          />
          <div className={styles.info}>
            <h2 className={styles.title} onClick={handleRedirect}>
              {product.name}
            </h2>
            <p className={styles.price} onClick={handleRedirect}>
              ₸ {formattedPrice}
            </p>
            {product.rating && (
              <p className={styles.rating}>Оценки: {product.rating} ⭐</p>
            )}
          </div>
          <div className={styles.buttons}>
            {isAdmin ? (
              <>
                <Button
                  label="Редактировать"
                  onClick={() => navigate(`/admin/edit/${product.id}`)}
                  variant="filled"
                />
                <Button
                  label="Удалить"
                  onClick={handleDeleteProduct}
                  variant="outlined"
                />
              </>
            ) : product.stock === 0 ? (
              <Button label="Товар закончился" variant="outlined" disabled />
            ) : (
              <Button
                label={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : isInBasket ? (
                    "Перейти в корзину"
                  ) : (
                    "Купить"
                  )
                }
                onClick={(event) => handleButtonClick(event)}
                variant="filled"
                disabled={isLoading}
              />
            )}
          </div>
        </div>
      </div>
      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        onGoToBasket={handleGoToBasket}
      />
    </>
  );
};
