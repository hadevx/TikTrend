import { apiSlice } from "./apiSlice";

export const maintenanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreStatus: builder.query({
      query: () => ({
        url: "/api/store",
      }),
    }),
  }),
});

export const { useGetStoreStatusQuery } = maintenanceApi;
