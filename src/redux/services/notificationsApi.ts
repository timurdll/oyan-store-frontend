import { baseApi } from "./baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка уведомлений
    fetchNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),
    // Создание нового уведомления
    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: "/notifications",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["Notifications"],
    }),
    // Обновление уведомления
    updateNotification: builder.mutation({
      query: ({ id, ...notificationData }) => ({
        url: `/notifications/${id}`,
        method: "PUT",
        body: notificationData,
      }),
      invalidatesTags: ["Notifications"],
    }),
    // Удаление уведомления
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useFetchNotificationsQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
