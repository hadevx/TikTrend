// ========================= hooks/usePayment.js =========================
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// ✅ adjust these imports to your project paths/names if different
import { useCreateOrderMutation, useCheckStockMutation } from "../redux/queries/orderApi";

// ✅ updateStock mutation is usually in productApi (based on your snippet)
import { useUpdateStockMutation } from "../redux/queries/productApi";

// ✅ IMPORTANT: make sure these exist in your cartSlice
// If your slice uses different names (e.g. resetCart / clearCartItems), rename here.
import { clearCart, removeCoupon } from "../redux/slices/cartSlice";

export function usePayment(
  cartItems = [],
  userAddress,
  paymentMethod,
  deliveryStatus,
  cartCoupon,
  overrides = {}, // ✅ { shippingPriceOverride, couponDiscountOverride, subtotalBeforeCouponOverride }
) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ---------------------------
  // API mutations
  // ---------------------------
  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();
  const [checkStock, { isLoading: loadingCheck }] = useCheckStockMutation();

  // ✅ update stock endpoint
  const [updateStock, { isLoading: loadingUpdateStock }] = useUpdateStockMutation();

  // ---------------------------
  // Local state for stock results
  // ---------------------------
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const hasOutOfStock = Array.isArray(outOfStockItems) && outOfStockItems.length > 0;

  // ---------------------------
  // Helpers
  // ---------------------------
  const getItemCategoryId = (item) => {
    return (
      item?.category?._id ||
      item?.categoryId ||
      (typeof item?.category === "string" ? item.category : null) ||
      item?.catId ||
      null
    );
  };

  const key = (pid, vid, size) =>
    `${String(pid)}-${vid ? String(vid) : "null"}-${size ? String(size) : "null"}`;

  const normalizeGov = (v) =>
    String(v || "")
      .trim()
      .toLowerCase();

  const getGovernorateFromAddress = (addr) => {
    if (!addr) return "";
    return addr.governorate || addr.gov || addr.zone || addr.area || addr.city || addr.state || "";
  };

  // ---------------------------
  // Totals (supports overrides)
  // ---------------------------
  const subtotalBeforeCoupon = useMemo(() => {
    if (Number.isFinite(overrides?.subtotalBeforeCouponOverride)) {
      return Number(overrides.subtotalBeforeCouponOverride);
    }

    return (cartItems || []).reduce((acc, item) => {
      const unit = Number(item.discountedPrice || 0);
      return acc + unit * Number(item.qty || 0);
    }, 0);
  }, [cartItems, overrides?.subtotalBeforeCouponOverride]);

  const couponDiscount = useMemo(() => {
    if (Number.isFinite(overrides?.couponDiscountOverride)) {
      return Number(overrides.couponDiscountOverride);
    }

    if (!cartCoupon) return 0;

    const rate = Number(cartCoupon.discountBy ?? 0);
    if (!Number.isFinite(rate) || rate <= 0) return 0;

    const allowedCategories = Array.isArray(cartCoupon.categories) ? cartCoupon.categories : [];
    const hasCategoryLimit = allowedCategories.length > 0;

    const eligibleSubtotal = (cartItems || []).reduce((acc, item) => {
      const itemTotal = Number(item.discountedPrice || 0) * Number(item.qty || 0);
      if (!hasCategoryLimit) return acc + itemTotal;

      const itemCategoryId = getItemCategoryId(item);
      if (itemCategoryId && allowedCategories.includes(String(itemCategoryId)))
        return acc + itemTotal;

      return acc;
    }, 0);

    const discount = eligibleSubtotal * rate;
    return discount > 0 ? discount : 0;
  }, [cartItems, cartCoupon, overrides?.couponDiscountOverride]);

  const itemsPrice = useMemo(() => {
    return Math.max(subtotalBeforeCoupon - couponDiscount, 0);
  }, [subtotalBeforeCoupon, couponDiscount]);

  /**
   * ✅ Shipping (NOW applies delivery threshold + zone fees like your Cart page)
   * Uses:
   * - shippingFee (default)
   * - zoneFees[] { zone, fee }
   * - freeDeliveryThreshold
   */
  const shippingPrice = useMemo(() => {
    if (Number.isFinite(overrides?.shippingPriceOverride)) {
      return Number(overrides.shippingPriceOverride);
    }

    const currentDelivery = deliveryStatus?.[0] || {};
    const defaultShippingFee = Number(currentDelivery?.shippingFee ?? 0);
    const freeDeliveryThreshold = Number(currentDelivery?.freeDeliveryThreshold ?? 0);
    const zoneFees = Array.isArray(currentDelivery?.zoneFees) ? currentDelivery.zoneFees : [];

    let fee = Number.isFinite(defaultShippingFee) ? defaultShippingFee : 0;

    // zone fee by governorate
    const userGov = normalizeGov(getGovernorateFromAddress(userAddress));
    if (userGov && zoneFees.length > 0) {
      const match = zoneFees.find((z) => normalizeGov(z?.zone) === userGov);
      if (match && Number.isFinite(Number(match.fee))) fee = Number(match.fee);
    }

    // free delivery threshold is checked against items AFTER coupon
    const afterCoupon = Math.max(itemsPrice, 0);
    if (freeDeliveryThreshold > 0 && afterCoupon >= freeDeliveryThreshold) fee = 0;

    return Number.isFinite(fee) ? fee : 0;
  }, [deliveryStatus, overrides?.shippingPriceOverride, userAddress, itemsPrice]);

  const totalAmount = useMemo(() => {
    return Math.max(itemsPrice + shippingPrice, 0);
  }, [itemsPrice, shippingPrice]);

  // ---------------------------
  // USD conversion (replace if you have real rate)
  // ---------------------------
  const kdToUsdRate = Number(deliveryStatus?.[0]?.kdToUsdRate || 3.25);
  const amountInUSD = useMemo(() => {
    const usd = totalAmount * kdToUsdRate;
    return Number.isFinite(usd) ? usd.toFixed(2) : "0.00";
  }, [totalAmount, kdToUsdRate]);

  // ---------------------------
  // Stock check
  // ---------------------------
  const runServerStockCheck = async () => {
    try {
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setOutOfStockItems([]);
        return [];
      }

      const payload = cartItems.map((item) => ({
        productId: item._id,
        variantId: item.variantId || null,
        size: item.variantSize || null,
        qty: Number(item.qty || 0),
      }));

      const res = await checkStock(payload).unwrap();
      const out = Array.isArray(res?.outOfStockItems) ? res.outOfStockItems : [];
      setOutOfStockItems(out);
      return out;
    } catch (e) {
      setOutOfStockItems([]);
      toast.info("Could not verify live stock right now. Please try again.", {
        position: "top-center",
      });
      return [];
    }
  };

  useEffect(() => {
    const signature = (cartItems || [])
      .map((i) => `${i._id}:${i.variantId ?? "null"}:${i.variantSize ?? "null"}:${i.qty}`)
      .join("|");

    if (!signature) {
      setOutOfStockItems([]);
      return;
    }

    runServerStockCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    (cartItems || [])
      .map((i) => `${i._id}:${i.variantId ?? "null"}:${i.variantSize ?? "null"}:${i.qty}`)
      .join("|"),
  ]);

  const outOfStockMap = useMemo(() => {
    const m = new Map();
    (outOfStockItems || []).forEach((x) => {
      m.set(key(x.productId, x.variantId, x.size), x);
    });
    return m;
  }, [outOfStockItems]);

  // ---------------------------
  // Create order payload
  // ---------------------------
  const buildCreateOrderPayload = () => {
    return {
      orderItems: cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        qty: Number(i.qty || 0),
        price: Number(i.discountedPrice || 0), // ✅ saved unit (after sale, before coupon distribution)
        image: i.image,
        variantId: i.variantId || null,
        variantSize: i.variantSize || null,
        variantColor: i.variantColor || null,
        variantImage: i.variantImage || null,
        category: getItemCategoryId(i),
      })),
      shippingAddress: userAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice.toFixed(3)),
      shippingPrice: Number(shippingPrice.toFixed(3)),
      discountAmount: Number(couponDiscount.toFixed(3)),
      totalPrice: Number(totalAmount.toFixed(3)),
      coupon: cartCoupon?.code
        ? {
            code: cartCoupon.code,
            discountBy: Number(cartCoupon.discountBy ?? 0),
            categories: Array.isArray(cartCoupon.categories) ? cartCoupon.categories : [],
          }
        : null,
    };
  };

  // ✅ clear cart helper (after success)
  const clearCartAfterSuccess = () => {
    try {
      dispatch(clearCart());
      dispatch(removeCoupon());
    } catch {
      // if action names differ, fix imports above
    }
  };

  /**
   * ✅ Update stock after order is created
   * Your backend expects: req.body.orderItems, and item.product / item.variantId / item.variantSize / item.qty
   */
  const updateStockForOrder = async () => {
    const orderItems = (cartItems || []).map((i) => ({
      product: i._id, // ✅ backend uses item.product
      qty: Number(i.qty || 0),
      variantId: i.variantId || null,
      variantSize: i.variantSize || null, // ✅ backend uses item.variantSize
    }));

    if (orderItems.length === 0) return;

    // ✅ wrap in { orderItems } to match controller: const { orderItems } = req.body;
    await updateStock({ orderItems }).unwrap();
  };

  // ---------------------------
  // CASH payment handler
  // ---------------------------
  const handleCashPayment = async () => {
    try {
      if (!userAddress) {
        toast.error("Please add your address first.", { position: "top-center" });
        return;
      }

      const out = await runServerStockCheck();
      if (Array.isArray(out) && out.length > 0) {
        toast.error("Some items are out of stock. Please update your cart.", {
          position: "top-center",
        });
        return;
      }

      const payload = buildCreateOrderPayload();
      const created = await createOrder(payload).unwrap();

      // ✅ update stock AFTER order success
      try {
        await updateStockForOrder();
      } catch (e) {
        toast.info("Order placed, but stock update failed. Please refresh.", {
          position: "top-center",
        });
      }

      // ✅ CLEAR CART HERE
      clearCartAfterSuccess();

      toast.success("Order placed successfully!", { position: "top-center" });

      const newId = created?._id || created?.order?._id;
      if (newId) navigate(`/order/${newId}`);
      else navigate("/orders");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order", { position: "top-center" });
    }
  };

  // ---------------------------
  // PayPal
  // ---------------------------
  const createPayPalOrder = (user, usdAmount) => async (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: String(usdAmount) },
        },
      ],
    });
  };

  const handlePayPalApprove = async (data, actions) => {
    try {
      if (!userAddress) {
        toast.error("Please add your address first.", { position: "top-center" });
        return;
      }

      const details = await actions.order.capture();

      const out = await runServerStockCheck();
      if (Array.isArray(out) && out.length > 0) {
        toast.error("Some items are out of stock. Please update your cart.", {
          position: "top-center",
        });
        return;
      }

      const payload = {
        ...buildCreateOrderPayload(),
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
          id: details?.id,
          status: details?.status,
          update_time: details?.update_time,
          email_address: details?.payer?.email_address,
        },
      };

      const created = await createOrder(payload).unwrap();

      // ✅ update stock AFTER order success
      try {
        await updateStockForOrder();
      } catch (e) {
        toast.info("Payment successful, but stock update failed. Please refresh.", {
          position: "top-center",
        });
      }

      // ✅ CLEAR CART HERE
      clearCartAfterSuccess();

      toast.success("Payment successful!", { position: "top-center" });

      const newId = created?._id || created?.order?._id;
      if (newId) navigate(`/order/${newId}`);
      else navigate("/orders");
    } catch (err) {
      toast.error(err?.data?.message || "PayPal approval failed", { position: "top-center" });
    }
  };

  return {
    subtotalBeforeCoupon,
    itemsPrice,
    shippingPrice,
    couponDiscount,
    totalAmount,

    amountInUSD,
    loadingCreateOrder,
    loadingCheck,
    loadingUpdateStock,

    outOfStockItems,
    outOfStockMap,
    hasOutOfStock,

    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  };
}
