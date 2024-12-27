// services/productApi.ts
import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => "/products",
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    fetchProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    fetchProductByName: builder.query({
      query: (name) => `/products/name/${name}`,
    }),
    fetchProductBySlug: builder.query({
      query: (slug) => `/products/slug/${slug}`,
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
} = productApi;
