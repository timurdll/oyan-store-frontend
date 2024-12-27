import { baseApi } from "./baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Поиск пользователя по ID
    getUserById: builder.query({
      query: (id) => `/auth/find/${id}`,
      providesTags: (id) => [{ type: "User", id }],
    }),
    // Получение информации о бонусах
    getUserBonuses: builder.query({
      query: () => `/auth/bonuses`,
      providesTags: ["User"],
    }),
    // Обновление профиля
    updateProfile: builder.mutation({
      query: ({ id, profileData }) => {
        const formData = new FormData();
        if (profileData.firstName)
          formData.append("firstName", profileData.firstName);
        if (profileData.lastName)
          formData.append("lastName", profileData.lastName);
        if (profileData.dateOfBirth)
          formData.append("dateOfBirth", profileData.dateOfBirth);
        if (profileData.profileImage)
          formData.append("profileImage", profileData.profileImage);
        if (profileData.phoneNumber) {
          formData.append("phoneNumber", profileData.phoneNumber);
        }

        return {
          url: `/auth/update-profile/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
    // Загрузка аватара
    uploadAvatar: builder.mutation({
      query: ({ id, avatar }) => {
        const formData = new FormData();
        formData.append("avatar", avatar);

        return {
          url: `/auth/upload-avatar/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserByIdQuery,
  useGetUserBonusesQuery, // Хук для получения бонусов
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} = usersApi;
