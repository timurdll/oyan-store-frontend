import { baseApi } from "./baseApi";

export const typeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTypes: builder.query({
      query: (params) => {
        const language = params?.language;
        return language ? `types?language=${language}` : "types";
      },
      providesTags: ["Types"],
    }),
    fetchTypeById: builder.query({
      query: ({ id, language }) => {
        if (!id || id === 0) {
          return { url: "types/null", method: "GET" };
        }
        return language ? `/types/${id}?language=${language}` : `/types/${id}`;
      },
      providesTags: (_, __, arg) => [{ type: "Types", id: arg.id }],
    }),
    fetchCharacteristicById: builder.query({
      query: (id) => `/types/${id}/characteristics`,
      providesTags: (_, __, id) => [
        { type: "Types", id: `CHARACTERISTICS_${id}` },
      ],
    }),
    addType: builder.mutation({
      query: (type) => ({
        url: "types",
        method: "POST",
        body: type,
      }),
      invalidatesTags: ["Types"],
    }),
    updateType: builder.mutation({
      query: ({ id, ...type }) => ({
        url: `types/${id}`,
        method: "PUT",
        body: type,
      }),
      invalidatesTags: ["Types"],
    }),
    deleteType: builder.mutation({
      query: (id) => ({
        url: `types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Types"],
    }),
  }),
});

export const {
  useFetchTypesQuery,
  useFetchTypeByIdQuery,
  useFetchCharacteristicByIdQuery,
  useAddTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} = typeApi;
