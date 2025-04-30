import { BasketProduct } from "types/types"; // Определите тип данных для продуктов в корзине
import { baseApi } from "./baseApi"; // Подключение к вашему основному API

export const basketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Добавление продукта в корзину
    addToBasket: builder.mutation({
      query: ({
        productId,
        quantity,
      }: {
        productId: number;
        quantity: number;
      }) => ({
        url: `/basket/add/${productId}`, // Эндпоинт для добавления продукта
        method: "POST",
        body: { quantity }, // Тело запроса
      }),
      invalidatesTags: [{ type: "Basket", id: "LIST" }], // Инвалидация для обновления корзины
    }),

    // Удаление продукта из корзины
    removeFromBasket: builder.mutation({
      query: (productId: number) => ({
        url: `/basket/remove/${productId}`, // Эндпоинт для удаления продукта
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Basket", id: "LIST" }], // Инвалидация для обновления корзины
    }),

    // Получение всех продуктов в корзине пользователя
    getBasket: builder.query<BasketProduct[], { language?: string }>({
      query: ({ language }) => ({
        url: language ? `/basket?language=${language}` : "/basket", // Эндпоинт для получения продуктов корзины
        method: "GET",
      }),
      providesTags: [{ type: "Basket", id: "LIST" }], // Тег для кеширования
    }),

    // Обновление количества продукта в корзине
    updateBasketProductQuantity: builder.mutation({
      query: ({
        productId,
        quantity,
      }: {
        productId: number;
        quantity: number;
      }) => ({
        url: `/basket/update/${productId}`, // Эндпоинт для обновления количества
        method: "PUT",
        body: { quantity }, // Тело запроса
      }),
      invalidatesTags: [{ type: "Basket", id: "LIST" }], // Инвалидация для обновления корзины
    }),

    // Очистка всей корзины
    clearBasket: builder.mutation({
      query: () => ({
        url: `/basket/clear`, // Эндпоинт для очистки корзины
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Basket", id: "LIST" }], // Инвалидация для обновления корзины
    }),
  }),
});

export const {
  useAddToBasketMutation,
  useRemoveFromBasketMutation,
  useGetBasketQuery,
  useUpdateBasketProductQuantityMutation,
  useClearBasketMutation, // Новый хук для очистки корзины
} = basketApi;
