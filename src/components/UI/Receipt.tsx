import styles from "@styles/receipt.module.scss";
import { formatPrice } from "@components/Functions/formatPrice";
import { useNavigate } from "react-router-dom";

interface ReceiptProps {
  basketProducts: {
    id: number;
    quantity: number;
    product: { id: number; name: string; price: number };
  }[];
  totalSum: number;
  showCheckoutButton?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({
  basketProducts,
  totalSum,
  showCheckoutButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <span className={styles.total}>
        Сумма к оплате:{" "}
        <span className={styles.price}>{formatPrice(totalSum)} ₸</span>
      </span>
      {basketProducts && basketProducts.length > 0 ? (
        <ul className={styles.checkList}>
          {basketProducts.map((product) => (
            <li key={product.product.name} className={styles.checkItem}>
              <span>{product.product.name}</span>
              <span>
                {formatPrice(product.product.price)} ₸ x {product.quantity}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Корзина пуста</p>
      )}
      {basketProducts && basketProducts.length > 0 ? (
        showCheckoutButton && (
          <button
            onClick={() => navigate("/checkout")}
            className={styles.checkoutButton}
          >
            Оформить заказ
          </button>
        )
      ) : (
        <button onClick={() => navigate("/")} className={styles.checkoutButton}>
          Перейти к продуктам
        </button>
      )}
    </div>
  );
};

export default Receipt;
