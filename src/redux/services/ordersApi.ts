import { baseApi } from "./baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Создание заказа
    createOrder: builder.mutation({
      query: (orderData: {
        product: {
          productId: number;
          productName: string;
          quantity: number;
        }[];
        phoneNumber: string;
        fullName: string;
        email: string;
        address: {
          city: string;
          street: string;
          houseNumber: string;
          entrance?: string;
          apartment: string;
        };
        paymentData: { paymentMethod: string[] };
        totalAmount: number;
      }) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Получение заказов пользователя
    getUserOrders: builder.query({
      query: () => `/orders`,
      providesTags: (result) =>
        result
          ? result.map((order: { id: number }) => ({
              type: "Orders",
              id: order.id,
            }))
          : ["Orders"],
    }),

    // Получение всех заказов (для админов)
    getAllOrders: builder.query({
      query: () => `/orders/all`, // Endpoint for fetching all orders
      providesTags: (result) =>
        result
          ? result.map((order: { id: number }) => ({
              type: "Orders",
              id: order.id,
            }))
          : ["Orders"],
    }),

    // Обновление статуса заказа (административный функционал)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }: { orderId: number; status: string }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
