// services/authApi.ts
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),
    registerUser: builder.mutation({
      query: (registerData) => ({
        url: "/auth/register",
        method: "POST",
        body: registerData,
      }),
    }),
    checkEmail: builder.mutation({
      query: (emailData) => ({
        url: "/auth/check-email",
        method: "POST",
        body: emailData,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useCheckEmailMutation,
} = authApi;
