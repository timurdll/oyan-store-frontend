import React from "react";
import { useGetUserOrdersQuery } from "@redux/services/ordersApi";
import styles from "@styles/orders-page.module.scss";
import { formatPrice } from "@components/Functions/formatPrice";
import { Order } from "types/types";
import { useEffect } from "react";
import socket from "../socket";
import { useTranslation } from "react-i18next";

const Orders: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetUserOrdersQuery(
    { language: i18n.language.toUpperCase() },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    // Set up WebSocket listeners
    socket.on(
      "orderStatusUpdate",
      (data: { orderId: number; status: string }) => {
        console.log(
          `Статус заказа обновлен: Заказ ${data.orderId} -> ${data.status}`
        );
        refetch(); // Refetch data when an order status updates
      }
    );

    return () => {
      socket.off("orderStatusUpdate");
    };
  }, []); // No dependency array ensures this runs only once on mount

  if (isLoading) {
    return <div className={styles.loader}>{t("orders.loading")}</div>;
  }

  if (isError) {
    return <div className={styles.error}>{t("orders.error")}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className={styles.empty}>{t("orders.empty")}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{t("orders.title")}</h1>
      <ul className={styles.orderList}>
        {orders.map((order: Order) => (
          <li key={order.id} className={styles.orderItem}>
            <div className={styles.orderInfo}>
              <span className={styles.orderId}>
                {t("orders.orderNumber", { number: order.id })}
              </span>
              <span className={styles.orderDate}>
                {t("orders.date")}:{" "}
                <span className={styles.value}>
                  {new Date(order.createdAt).toLocaleDateString(i18n.language)}
                </span>
              </span>
              <span className={styles.orderStatus}>
                {t("orders.status.title")}:{" "}
                <span className={styles.value}>
                  {t(`orders.status.${order.status}`)}
                </span>
              </span>
            </div>
            <ul className={styles.productList}>
              {order.products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}${
                      product.product.cover_image
                    }`}
                    alt={
                      product.product.translations?.[0]?.name ||
                      product.product.name
                    }
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <span className={styles.productName}>
                      {product.product.translations?.[0]?.name ||
                        product.product.name}
                    </span>
                    <span className={styles.productPrice}>
                      {formatPrice(product.product.price)} ₸ x{" "}
                      <span className={styles.quantity}>
                        {product.quantity}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.totalPrice}>
              {t("orders.totalAmount")}:{" "}
              <span className={styles.value}>
                {formatPrice(order.totalPrice)} ₸
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
