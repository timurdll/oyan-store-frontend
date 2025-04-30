import { baseApi } from "./baseApi";

export const translationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка поддерживаемых языков
    getSupportedLanguages: builder.query({
      query: () => ({
        url: "/translations/languages",
        method: "GET",
      }),
    }),

    // API для работы с переводами типов товаров
    getTypeTranslation: builder.query({
      query: ({ id, language }) => ({
        url: `/translations/type/${id}/${language}`,
        method: "GET",
      }),
      providesTags: (_, __, { id, language }) => [
        { type: "Types", id: `${id}-${language}` },
      ],
    }),

    updateTypeTranslation: builder.mutation({
      query: ({ id, language, name }) => ({
        url: `/translations/type/${id}/${language}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (_, __, { id, language }) => [
        { type: "Types", id: `${id}-${language}` },
        { type: "Types", id: "LIST" },
      ],
    }),

    // API для работы с переводами товаров
    getProductTranslation: builder.query({
      query: ({ id, language }) => ({
        url: `/translations/product/${id}/${language}`,
        method: "GET",
      }),
      providesTags: (_, __, { id, language }) => [
        { type: "Products", id: `${id}-${language}` },
      ],
    }),

    updateProductTranslation: builder.mutation({
      query: ({ id, language, name }) => ({
        url: `/translations/product/${id}/${language}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (_, __, { id, language }) => [
        { type: "Products", id: `${id}-${language}` },
        { type: "Products", id: "LIST" },
      ],
    }),

    // API для работы с переводами информации о товаре
    getProductInfoTranslation: builder.query({
      query: ({ id, language }) => ({
        url: `/translations/product-info/${id}/${language}`,
        method: "GET",
      }),
      providesTags: (_, __, { id, language }) => [
        { type: "Products", id: `info-${id}-${language}` },
      ],
    }),

    updateProductInfoTranslation: builder.mutation({
      query: ({ id, language, title, description }) => ({
        url: `/translations/product-info/${id}/${language}`,
        method: "PUT",
        body: { title, description },
      }),
      invalidatesTags: (_, __, { id, language }) => [
        { type: "Products", id: `info-${id}-${language}` },
        { type: "Products", id: "LIST" },
      ],
    }),

    // API для работы с переводами характеристик
    getCharacteristicTranslation: builder.query({
      query: ({ id, language }) => ({
        url: `/translations/characteristic/${id}/${language}`,
        method: "GET",
      }),
      providesTags: (_, __, { id, language }) => [
        { type: "Products", id: `char-${id}-${language}` },
      ],
    }),

    updateCharacteristicTranslation: builder.mutation({
      query: ({ id, language, name }) => ({
        url: `/translations/characteristic/${id}/${language}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (_, __, { id, language }) => [
        { type: "Products", id: `char-${id}-${language}` },
        { type: "Products", id: "LIST" },
      ],
    }),

    // API для работы с переводами значений характеристик продукта
    getProductCharacteristicTranslation: builder.query({
      query: ({ id, language }) => ({
        url: `/translations/product-characteristic/${id}/${language}`,
        method: "GET",
      }),
      providesTags: (_, __, { id, language }) => [
        { type: "Products", id: `prod-char-${id}-${language}` },
      ],
    }),

    updateProductCharacteristicTranslation: builder.mutation({
      query: ({ id, language, description }) => ({
        url: `/translations/product-characteristic/${id}/${language}`,
        method: "PUT",
        body: { description },
      }),
      invalidatesTags: (_, __, { id, language }) => [
        { type: "Products", id: `prod-char-${id}-${language}` },
        { type: "Products", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSupportedLanguagesQuery,
  useGetTypeTranslationQuery,
  useUpdateTypeTranslationMutation,
  useGetProductTranslationQuery,
  useUpdateProductTranslationMutation,
  useGetProductInfoTranslationQuery,
  useUpdateProductInfoTranslationMutation,
  useGetCharacteristicTranslationQuery,
  useUpdateCharacteristicTranslationMutation,
  useGetProductCharacteristicTranslationQuery,
  useUpdateProductCharacteristicTranslationMutation,
} = translationsApi;
