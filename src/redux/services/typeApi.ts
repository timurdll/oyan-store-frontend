import { baseApi } from "./baseApi";

export const typeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTypes: builder.query({
      query: () => "/types",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: number }) => ({
                type: "Types" as const,
                id,
              })),
              { type: "Types", id: "LIST" },
            ]
          : [{ type: "Types", id: "LIST" }],
    }),
    fetchTypeById: builder.query({
      query: (id) => `/types/${id}`,
      providesTags: (id) => [{ type: "Types", id }],
    }),
    fetchCharacteristicById: builder.query({
      query: (id) => `/types/${id}/characteristics`,
      providesTags: (id) => [{ type: "Types", id: `CHARACTERISTICS_${id}` }],
    }),
    addType: builder.mutation({
      query: (newType) => ({
        url: "/types",
        method: "POST",
        body: newType,
      }),
      invalidatesTags: [{ type: "Types", id: "LIST" }],
    }),
  }),
});

export const {
  useFetchTypesQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
  useAddTypeMutation,
} = typeApi;
