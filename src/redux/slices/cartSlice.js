import { createSlice } from "@reduxjs/toolkit";

/**
 * ✅ Backward compatible localStorage:
 * - Old version stored:  [cartItems...]
 * - New version stores:  { cartItems: [...], coupon: {...} | null }
 */
const savedData = localStorage.getItem("cart");

const parseSavedCart = () => {
  if (!savedData) return { cartItems: [], coupon: null };

  try {
    const parsed = JSON.parse(savedData);

    // old format: array
    if (Array.isArray(parsed)) {
      return { cartItems: parsed, coupon: null };
    }

    // new format: object
    if (parsed && typeof parsed === "object") {
      return {
        cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
        coupon: parsed.coupon ?? null,
      };
    }

    return { cartItems: [], coupon: null };
  } catch {
    return { cartItems: [], coupon: null };
  }
};

const initialState = parseSavedCart();

const persistCart = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      cartItems: state.cartItems,
      coupon: state.coupon,
    }),
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newProduct = {
        ...action.payload,
        variantId: action.payload.variantId || null,
        variantSize: action.payload.variantSize || null,
      };

      const existingProduct = state.cartItems.find(
        (product) =>
          product._id === newProduct._id &&
          product.variantId === newProduct.variantId &&
          product.variantSize === newProduct.variantSize,
      );

      if (existingProduct) {
        state.cartItems = state.cartItems.map((product) =>
          product._id === newProduct._id &&
          product.variantId === newProduct.variantId &&
          product.variantSize === newProduct.variantSize
            ? { ...product, qty: product.qty + newProduct.qty }
            : product,
        );
      } else {
        state.cartItems.push(newProduct);
      }

      // ✅ optional: if coupon is category-limited, you can validate eligibility here.
      persistCart(state);
    },

    updateCart: (state, action) => {
      const { _id, variantId = null, variantSize = null, qty } = action.payload;

      const existingProduct = state.cartItems.find(
        (product) =>
          product._id === _id &&
          product.variantId === variantId &&
          product.variantSize === variantSize,
      );

      if (existingProduct) {
        if (qty === 0) {
          state.cartItems = state.cartItems.filter(
            (product) =>
              !(
                product._id === _id &&
                product.variantId === variantId &&
                product.variantSize === variantSize
              ),
          );
        } else {
          state.cartItems = state.cartItems.map((product) =>
            product._id === _id &&
            product.variantId === variantId &&
            product.variantSize === variantSize
              ? { ...product, qty }
              : product,
          );
        }
      }

      persistCart(state);
    },

    removeFromCart: (state, action) => {
      const { _id, variantId = null, variantSize = null } = action.payload;

      state.cartItems = state.cartItems.filter(
        (product) =>
          !(
            product._id === _id &&
            product.variantId === variantId &&
            product.variantSize === variantSize
          ),
      );

      persistCart(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null; // ✅ clear coupon too
      persistCart(state);
    },

    // ✅ NEW: apply coupon globally so Payment can use it
    applyCoupon: (state, action) => {
      // expected payload: { code, discountBy, categories: [] }
      state.coupon = action.payload;
      persistCart(state);
    },

    // ✅ NEW: remove coupon
    removeCoupon: (state) => {
      state.coupon = null;
      persistCart(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateCart, applyCoupon, removeCoupon } =
  cartSlice.actions;

export default cartSlice.reducer;
