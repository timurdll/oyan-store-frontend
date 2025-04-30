import { useState } from "react"; // Для управления состоянием алерта
import { useSelector } from "react-redux"; // Для доступа к состоянию Redux
import {
  useGetBasketQuery,
  useRemoveFromBasketMutation,
  useUpdateBasketProductQuantityMutation,
} from "@redux/services";
import styles from "@styles/basket-page.module.scss";
import bucket from "@assets/images/bucket.svg";
import Counter from "@components/UI/Counter";
import { formatPrice } from "@components/Functions/formatPrice";
import Receipt from "@components/UI/Receipt";
import { RootState } from "@redux/store"; // Убедитесь, что правильно импортируете RootState
import AlertComponent from "@components/AlertComponent";
import { useTranslation } from "react-i18next";

const BasketPage = () => {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { t, i18n } = useTranslation();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  if (!isLoggedIn) {
    return <div className={styles.message}>{t("basket.pleaseLogin")}</div>;
  }

  const {
    data: basketProducts,
    isLoading,
    isError,
  } = useGetBasketQuery(
    { language: i18n.language.toUpperCase() },
    { skip: !isLoggedIn }
  );
  const [removeFromBasket] = useRemoveFromBasketMutation();
  const [updateBasketQuantity] = useUpdateBasketProductQuantityMutation();

  const handleRemoveFromBasket = async (productId: number) => {
    try {
      await removeFromBasket(productId).unwrap();
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      setAlert({
        message: t("basket.stockLimit", { stock }),
        type: "error",
      });
      return;
    }
    try {
      await updateBasketQuantity({ productId, quantity: newQuantity }).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const totalSum: number =
    basketProducts?.reduce((sum: number, item) => {
      return sum + item.product.price * item.quantity;
    }, 0) ?? 0;

  if (isLoading) {
    return <div className={styles.loader}>{t("basket.loading")}</div>;
  }

  if (isError) {
    return <div className={styles.error}>{t("basket.error")}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{t("basket.title")}</h1>
      <AlertComponent alert={alert} onClose={() => setAlert(null)} />
      <div className={styles.basket}>
        <div className={styles.products}>
          {basketProducts && basketProducts.length > 0 ? (
            <>
              <ul className={styles.list}>
                {basketProducts.map((product, index) => (
                  <li key={`${product.id}-${index}`} className={styles.item}>
                    <div className={styles.left}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          product.product.cover_image
                        }`}
                        alt={product.product.name}
                        className={styles.productImage}
                      />
                      <div className={styles.info}>
                        <span className={styles.name}>
                          {product.product.translations?.[0]?.name ||
                            product.product.name}
                        </span>
                        <span className={styles.price}>
                          {formatPrice(product.product.price)} ₸
                        </span>
                      </div>
                    </div>
                    <div className={styles.right}>
                      <img
                        className={styles.bucket}
                        src={bucket}
                        alt={t("basket.delete")}
                        onClick={() =>
                          handleRemoveFromBasket(product.product_id)
                        }
                      />
                      <Counter
                        value={product.quantity}
                        stock={product.product.stock}
                        onIncrement={() =>
                          handleQuantityChange(
                            product.product_id,
                            product.quantity + 1,
                            product.product.stock
                          )
                        }
                        onDecrement={() =>
                          handleQuantityChange(
                            product.product_id,
                            product.quantity - 1,
                            product.product.stock
                          )
                        }
                        onLimitReached={(message) =>
                          setAlert({ message, type: "error" })
                        } // Устанавливаем алерт
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.message}>{t("basket.empty")}</p>
          )}
        </div>
        <Receipt
          basketProducts={basketProducts ?? []}
          totalSum={totalSum}
          showCheckoutButton={true}
        />
      </div>
    </div>
  );
};

export default BasketPage;
