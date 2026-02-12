import { apiSlice } from "./apiSlice";

export const deliveryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET delivery settings
    getDeliveryStatus: builder.query({
      query: () => ({
        url: "/api/delivery",
        method: "GET",
      }),
      providesTags: ["Delivery"],
    }),
  }),
});

// ✅ correct export name (you had maintenanceApi by mistake)
export const { useGetDeliveryStatusQuery } = deliveryApi;
