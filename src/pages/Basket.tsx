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

const BasketPage = () => {
  // Получаем статус входа пользователя
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Если пользователь не вошел в систему, можно перенаправить на страницу входа
  if (!isLoggedIn) {
    return (
      <div className={styles.message}>
        Пожалуйста, войдите в систему, чтобы увидеть вашу корзину.
      </div>
    );
  }

  // Теперь вызываем запрос корзины только если пользователь вошел в систему
  const {
    data: basketProducts,
    isLoading,
    isError,
  } = useGetBasketQuery(
    undefined,
    { skip: !isLoggedIn } // Этот параметр пропускает запрос, если пользователь не авторизован
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
    newQuantity: number
  ) => {
    if (newQuantity < 1) return; // Предотвратить установку количества меньше 1
    try {
      await updateBasketQuantity({ productId, quantity: newQuantity }).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const totalSum: number =
    basketProducts?.reduce((sum: number, item) => {
      return sum + item.product.price * item.quantity;
    }, 0) ?? 0; // Обработка undefined

  if (isLoading) {
    return <div className={styles.loader}>Загрузка...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Ошибка при загрузке корзины</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Корзина</h1>
      <div className={styles.basket}>
        <div className={styles.products}>
          {basketProducts && basketProducts.length > 0 ? (
            <>
              <ul className={styles.list}>
                {basketProducts.map((product, index) => (
                  <li key={`${product.id}-${index}`} className={styles.item}>
                    <div className={styles.left}>
                      <img
                        src={`http://localhost:3000${product.product.cover_image}`}
                        alt={product.product.name}
                        className={styles.productImage}
                      />
                      <div className={styles.info}>
                        <span className={styles.name}>
                          {product.product.name}
                        </span>
                        <span className={styles.price}>
                          ₸ {formatPrice(product.product.price)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.right}>
                      <img
                        className={styles.bucket}
                        src={bucket}
                        alt="Удалить"
                        onClick={() =>
                          handleRemoveFromBasket(product.product_id)
                        }
                      />
                      <Counter
                        value={product.quantity}
                        onIncrement={() =>
                          handleQuantityChange(
                            product.product_id,
                            product.quantity + 1
                          )
                        }
                        onDecrement={() =>
                          handleQuantityChange(
                            product.product_id,
                            product.quantity - 1
                          )
                        }
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.message}>Здесь пока пусто...</p>
          )}
        </div>
        <Receipt
          basketProducts={basketProducts ?? []} // Pass an empty array if undefined
          totalSum={totalSum}
          showCheckoutButton={true}
        />
      </div>
    </div>
  );
};

export default BasketPage;
