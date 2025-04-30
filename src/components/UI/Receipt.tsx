import styles from "@styles/receipt.module.scss";
import { formatPrice } from "@components/Functions/formatPrice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ReceiptProps {
  basketProducts: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      translations?: { id: number; language: string; name: string }[];
    };
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
  const { t, i18n } = useTranslation();

  const handleNavigate = (path: string) => {
    navigate(`/${i18n.language}${path}`);
  };

  return (
    <div className={styles.container}>
      <span className={styles.total}>
        {t("receipt.totalAmount")}:{" "}
        <span className={styles.price}>{formatPrice(totalSum)} ₸</span>
      </span>
      {basketProducts && basketProducts.length > 0 ? (
        <ul className={styles.checkList}>
          {basketProducts.map((product) => (
            <li key={product.product.name} className={styles.checkItem}>
              <span>
                {product.product.translations?.find(
                  (t) => t.language === i18n.language.toUpperCase()
                )?.name || product.product.name}
              </span>
              <span>
                {formatPrice(product.product.price)} ₸ x {product.quantity}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("receipt.emptyCart")}</p>
      )}
      {basketProducts && basketProducts.length > 0 ? (
        showCheckoutButton && (
          <button
            onClick={() => handleNavigate("/checkout")}
            className={styles.checkoutButton}
          >
            {t("receipt.checkout")}
          </button>
        )
      ) : (
        <button
          onClick={() => handleNavigate("")}
          className={styles.checkoutButton}
        >
          {t("receipt.goToProducts")}
        </button>
      )}
    </div>
  );
};

export default Receipt;
