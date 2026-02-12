import { api } from "./api";

export const discountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDiscountStatus: builder.query({
      query: () => ({
        url: `/api/discount`,
      }),
    }),
  }),
});

export const { useGetDiscountStatusQuery } = discountApi;
