import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Products" as const,
                id,
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
      invalidatesTags: ({ id }) => [{ type: "Products", id }],
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
      query: (id) => `/products/${id}`,
      providesTags: (id) => [{ type: "Products", id }],
    }),
    fetchProductByName: builder.query({
      query: (name) => `/products/name/${name}`,
      providesTags: (name) => [{ type: "Products", id: `NAME_${name}` }],
    }),
    fetchProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
      providesTags: (slug) => [{ type: "Products", id: `SLUG_${slug}` }],
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
} = productApi;
