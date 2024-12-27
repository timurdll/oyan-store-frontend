import { formatPrice } from "@components/Functions/formatPrice";
import styles from "@styles/product-page.module.scss";
import Button from "./Button";

const ProductInfo: React.FC<{
  product: any;
  isLoadingBasket: boolean;
  isInBasket: boolean;
  handleButtonClick: () => void;
}> = ({ product, isLoadingBasket, isInBasket, handleButtonClick }) => (
  <div className={styles.info}>
    <span className={styles.name}>{product.name}</span>
    <span className={styles.price}>₸ {formatPrice(product.price)}</span>
    <div className={styles.buttons}>
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
    </div>
  </div>
);

export default ProductInfo;
