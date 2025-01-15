import { baseApi } from "./baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      invalidatesTags: [{ type: "Orders", id: "LIST" }], // Инвалидируем список заказов
    }),

    getUserOrders: builder.query({
      query: () => `/orders`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((order: { id: number }) => ({
                type: "Orders" as const,
                id: order.id,
              })),
              { type: "Orders", id: "LIST" }, // Общий тег для списка заказов
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    getAllOrders: builder.query({
      query: () => `/orders/all`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((order: { id: number }) => ({
                type: "Orders" as const,
                id: order.id,
              })),
              { type: "Orders", id: "LIST" }, // Общий тег
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }: { orderId: number; status: string }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ({ orderId }) => [
        { type: "Orders", id: orderId }, // Инвалидируем конкретный заказ
        { type: "Orders", id: "LIST" }, // Также обновляем общий список
      ],
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
