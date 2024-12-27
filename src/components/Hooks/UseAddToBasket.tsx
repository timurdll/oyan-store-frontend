import { useAddToBasketMutation } from "@redux/services";

interface UseAddToBasketReturn {
  isLoading: boolean;
  handleAddToBasket: (productId: number, quantity?: number) => Promise<void>;
}

const useAddToBasket = (): UseAddToBasketReturn => {
  const [addToBasket, { isLoading }] = useAddToBasketMutation();

  const handleAddToBasket = async (productId: number, quantity = 1) => {
    if (typeof quantity !== "number" || quantity < 1) {
      throw new Error("Количество должно быть положительным числом.");
    }

    await addToBasket({ productId, quantity }).unwrap();
  };

  return {
    isLoading,
    handleAddToBasket,
  };
};

export default useAddToBasket;
