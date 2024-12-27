import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@redux/services/ordersApi";
import styles from "@styles/orders-page.module.scss";
import { formatPrice } from "@components/Functions/formatPrice";
import { Order } from "types/types";

const OrderStatusTranslation: Record<string, string> = {
  PENDING: "Ожидает обработки",
  CONFIRMED: "Ожидает оплаты",
  PAID: "Оплачен",
  COMPLETED: "Завершен",
  CANCELED: "Отменен",
};

const Orders = () => {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery({});
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  if (isLoading) {
    return <div className={styles.loader}>Загрузка...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Ошибка при загрузке заказов</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className={styles.empty}>У вас пока нет заказов</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Все заказы</h1>
      <ul className={styles.orderList}>
        {orders.map((order: Order) => (
          <li key={order.id} className={styles.orderItem}>
            <div className={styles.orderInfo}>
              <span className={styles.orderId}>
                Номер заказа: <span className={styles.value}>{order.id}</span>
              </span>
              <span className={styles.orderDate}>
                Дата заказа:{" "}
                <span className={styles.value}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </span>
              <span className={styles.orderStatus}>
                Статус:{" "}
                <span className={styles.value}>
                  {OrderStatusTranslation[order.status] || "Неизвестный статус"}
                </span>
              </span>
              {/* Status Update */}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="PENDING">Ожидает обработки</option>
                <option value="CONFIRMED">Ожидает оплаты</option>
                <option value="PAID">Оплачен</option>
                <option value="COMPLETED">Завершен</option>
                <option value="CANCELED">Отменен</option>
              </select>
            </div>
            <ul className={styles.productList}>
              {order.products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <img
                    src={`http://localhost:3000${product.product.cover_image}`}
                    alt={product.product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <span className={styles.productName}>
                      {product.product.name}
                    </span>
                    <span className={styles.productPrice}>
                      ₸ {formatPrice(product.product.price)} x{" "}
                      {product.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.totalPrice}>
              Сумма:{" "}
              <span className={styles.value}>
                ₸ {formatPrice(order.totalPrice)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
