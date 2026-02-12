import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // redux/queries/productApi.js
    // redux/queries/productApi.js
    getProducts: builder.query({
      query: ({
        pageNumber = 1,
        keyword = "",
        limit = 30,
        color,
        inStock,
        minPrice,
        maxPrice,
        sort,
        order,
      } = {}) => ({
        url: "/api/products",
        params: {
          pageNumber,
          keyword,
          limit,
          color, // "red,black"
          inStock, // must become "true" for backend check
          minPrice,
          maxPrice,
          sort,
          order,
        },
      }),
      providesTags: ["Product"],
    }),

    getAllProducts: builder.query({
      query: () => ({
        url: "/api/products/all",
      }),
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}`,
      }),
    }),

    getProductsByCategory: builder.query({
      query: ({
        id,
        page = 1,
        limit,
        search = "",
        sort = "createdAt",
        order = "desc",
        minPrice,
        maxPrice,
        inStock,
      }) => ({
        url: `/api/products/category/${id}`,
        params: {
          page,
          limit,
          search,
          sort,
          order,
          minPrice,
          maxPrice,
          inStock,
        },
      }),
    }),

    updateStock: builder.mutation({
      query: (orderItems) => ({
        url: "/api/products/update-stock",
        method: "POST",
        body: orderItems,
      }),
    }),

    getLatestProducts: builder.query({
      query: () => ({
        url: "/api/products/latest",
      }),
    }),
    getCategoriesTree: builder.query({
      query: () => ({
        url: "/api/category/tree",
      }),
    }),
    fetchProductsByIds: builder.mutation({
      query: (productIds) => ({
        url: "/api/products/fetch-by-ids",
        method: "POST",
        body: { productIds },
      }),
    }),
    getMainCategoriesWithCounts: builder.query({
      query: () => ({
        url: "/api/category/main-cat-count",
      }),
    }),
    // ✅ Validate coupon (POST) -> { valid, code, discountBy, categories, message }
    validateCoupon: builder.mutation({
      query: ({ code, cartTotal, items }) => ({
        url: "/api/coupons/validate",
        method: "POST",
        body: { code, cartTotal, items },
      }),
    }),
    getRelatedProducts: builder.query({
      query: ({ productId, limit = 8 }) => ({
        url: `/api/products/${productId}/related?limit=${limit}`,
      }),
    }),
    getSaleProducts: builder.query({
      query: ({ pageNumber = 1, keyword = "" } = {}) => ({
        url: `/api/products/sale?pageNumber=${pageNumber}&keyword=${keyword}`,
      }),
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetProductsQuery,
  useGetRelatedProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useUpdateStockMutation,
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
  useGetAllProductsQuery,
  useFetchProductsByIdsMutation,
  useGetMainCategoriesWithCountsQuery,
  useGetSaleProductsQuery,
} = productApi;
