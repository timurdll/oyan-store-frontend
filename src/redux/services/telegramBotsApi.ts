import { baseApi } from "./baseApi";

export interface TelegramBot {
  id: number;
  name: string;
  token: string;
  chatId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTelegramBotPayload {
  name: string;
  token: string;
  chatId: string;
  isActive?: boolean;
}

export interface UpdateTelegramBotPayload {
  id: number;
  data: Partial<CreateTelegramBotPayload>;
}

export const telegramBotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTelegramBots: builder.query<TelegramBot[], void>({
      query: () => "/telegram-bots",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "TelegramBots" as const, id })),
              { type: "TelegramBots" as const, id: "LIST" },
            ]
          : [{ type: "TelegramBots" as const, id: "LIST" }],
    }),
    createTelegramBot: builder.mutation<TelegramBot, CreateTelegramBotPayload>({
      query: (body) => ({
        url: "/telegram-bots",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "TelegramBots", id: "LIST" }],
    }),
    updateTelegramBot: builder.mutation<TelegramBot, UpdateTelegramBotPayload>({
      query: ({ id, data }) => ({
        url: `/telegram-bots/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TelegramBots", id },
        { type: "TelegramBots", id: "LIST" },
      ],
    }),
    deleteTelegramBot: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/telegram-bots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "TelegramBots", id },
        { type: "TelegramBots", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchTelegramBotsQuery,
  useCreateTelegramBotMutation,
  useUpdateTelegramBotMutation,
  useDeleteTelegramBotMutation,
} = telegramBotsApi;

