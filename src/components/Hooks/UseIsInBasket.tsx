import { useGetBasketQuery } from "@redux/services";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

/**
 * Хук для проверки, находится ли продукт в корзине.
 * @param productId - ID продукта, который нужно проверить.
 * @returns Объект с информацией, есть ли продукт в корзине.
 */
const useIsProductInBasket = (productId: number) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  // Выполняем запрос для получения корзины
  const {
    data: basket,
    isLoading,
    isError,
  } = useGetBasketQuery(undefined, { skip: !isLoggedIn });

  // Определяем, есть ли продукт в корзине
  const isInBasket =
    basket?.some((item) => item.product?.id === productId) || false;

  return { isInBasket, isLoading, isError };
};

export default useIsProductInBasket;
