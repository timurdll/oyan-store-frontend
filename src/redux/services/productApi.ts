import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.typeId) searchParams.append("typeId", params.typeId);
        if (params.limit) searchParams.append("limit", params.limit);
        if (params.offset) searchParams.append("offset", params.offset);
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.language) searchParams.append("language", params.language);
        if (params.minPrice !== undefined)
          searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined)
          searchParams.append("maxPrice", params.maxPrice.toString());
        return `/products/filter?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result && Array.isArray(result.products)
          ? [
              ...result.products.map((product: { id: number }) => ({
                type: "Products" as const,
                id: product.id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (productId) => [
        { type: "Products", id: productId },
        { type: "Products", id: "LIST" },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),
    updateStock: builder.mutation({
      query: ({ id, stock }) => ({
        url: `/products/${id}/stock`,
        method: "PUT",
        body: { stock },
      }),
      invalidatesTags: ({ id }) => [{ type: "Products", id }],
    }),
    fetchProductById: builder.query({
      query: (params) => {
        const id = typeof params === "object" ? params.id : params;
        const language =
          typeof params === "object" ? params.language : undefined;
        return language
          ? `/products/${id}?language=${language}`
          : `/products/${id}`;
      },
      providesTags: (_, __, params) => {
        const id = typeof params === "object" ? params.id : params;
        return [{ type: "Products", id }];
      },
    }),
    fetchProductByName: builder.query({
      query: (name) => `/products/name/${name}`,
      providesTags: (name) => [{ type: "Products", id: `NAME_${name}` }],
    }),
    fetchProductBySlug: builder.query({
      query: (params) => {
        const slug = typeof params === "object" ? params.slug : params;
        const language =
          typeof params === "object" ? params.language : undefined;
        return language
          ? `/products/slug/${slug}?language=${language}`
          : `/products/slug/${slug}`;
      },
      providesTags: (_, __, params) => {
        const slug = typeof params === "object" ? params.slug : params;
        return [{ type: "Products", id: `SLUG_${slug}` }];
      },
    }),
    createPreOrder: builder.mutation({
      query: ({ productId, phoneNumber }) => ({
        url: `/products/${productId}/pre-order`,
        method: "POST",
        body: { phoneNumber },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    getPreOrders: builder.query({
      query: () => "/products/pre-orders", // Updated to match new endpoint
      providesTags: [{ type: "Products", id: "PRE_ORDERS" }],
    }),
    quickPurchase: builder.mutation({
      query: (data: {
        fullName: string;
        phoneNumber: string;
        productId: number;
      }) => ({
        url: `/orders/quick-purchase`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useFetchProductByIdQuery,
  useFetchProductByNameQuery,
  useFetchProductBySlugQuery,
  useUpdateProductMutation,
  useUpdateStockMutation,
  useCreatePreOrderMutation,
  useGetPreOrdersQuery, // Хук для получения предварительных заказов
  useQuickPurchaseMutation,
} = productApi;
