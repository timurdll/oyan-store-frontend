// utils/formatPrice.ts
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
  }).format(price);
};
