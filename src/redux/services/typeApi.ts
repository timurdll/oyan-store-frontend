import { baseApi } from "./baseApi";

export const typeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTypes: builder.query({
      query: () => "/types",
    }),
    fetchTypeById: builder.query({
      query: (id) => `/types/${id}`, // Получение типа по ID
    }),
    fetchCharacteristicById: builder.query({
      query: (id) => `/types/${id}/characteristics`,
    }),
    addType: builder.mutation({
      query: (newType) => ({
        url: "/types",
        method: "POST",
        body: newType,
      }),
    }),
  }),
});

export const {
  useFetchTypesQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
  useAddTypeMutation,
} = typeApi;
