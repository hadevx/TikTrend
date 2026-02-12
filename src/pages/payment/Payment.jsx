// ========================= Payment.jsx =========================
import { useEffect, useMemo, useState } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { HandCoins, CreditCard, ShieldCheck, MapPin, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAddressQuery, useUpdateAddressMutation } from "../../redux/queries/userApi";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { usePayment } from "../../hooks/usePayment";
import { provinces } from "../../assets/data/addresses.js";

// ✅ delivery settings from /api/delivery
import { useGetDeliveryStatusQuery } from "../../redux/queries/deliveryApi";
import { useGetStoreStatusQuery } from "../../redux/queries/maintenanceApi";

// ✅ fetch latest products by ids
import { useFetchProductsByIdsMutation } from "../../redux/queries/productApi";

// ✅ address modal (CREATE ONLY)
import AddressModal from "../../components/AddressModal";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // ✅ modal only for CREATE
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // ✅ inline update mode (when address exists)
  const [editAddress, setEditAddress] = useState(false);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCoupon = useSelector((state) => state.cart.coupon);

  const {
    data: userAddress,
    isLoading,
    refetch,
  } = useGetAddressQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });

  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();

  const { data: deliveryStatus } = useGetDeliveryStatusQuery(undefined);

  const { data: storeStatus, isLoading: loadingStore } = useGetStoreStatusQuery();
  const store = storeStatus?.[0];
  const codEnabled = !!store?.cashOnDeliveryEnabled;

  const [fetchProductsByIds, { data: fetchedProducts, isLoading: loadingProducts }] =
    useFetchProductsByIdsMutation();

  // ---------------------------
  // ✅ Address form state (update inline)
  // ---------------------------
  const [addressForm, setAddressForm] = useState({
    governorate: "",
    city: "",
    block: "",
    street: "",
    house: "",
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!editAddress) return;

    const gov = userAddress?.governorate || "";
    const province = provinces.find((p) => p.name === gov);
    setCities(province ? province.cities : []);

    setAddressForm({
      governorate: gov,
      city: userAddress?.city || "",
      block: userAddress?.block || "",
      street: userAddress?.street || "",
      house: userAddress?.house || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddress]);

  const onProvinceChange = (e) => {
    const governorate = e.target.value;
    const province = provinces.find((p) => p.name === governorate);
    setCities(province ? province.cities : []);
    setAddressForm((prev) => ({ ...prev, governorate, city: "" }));
  };

  const saveAddress = async () => {
    try {
      if (
        !addressForm.governorate ||
        !addressForm.city ||
        !addressForm.block ||
        !addressForm.street
      ) {
        toast.error("Please fill all address fields");
        return;
      }

      await updateAddress({
        governorate: addressForm.governorate,
        city: addressForm.city,
        block: addressForm.block,
        street: addressForm.street,
        house: addressForm.house,
      }).unwrap();

      toast.success("Updated address", { position: "top-center" });
      await refetch?.();
      setEditAddress(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update address", { position: "top-center" });
    }
  };

  // ---------------------------
  // ✅ Fetch latest products for cart items
  // ---------------------------
  useEffect(() => {
    const ids = Array.from(new Set(cartItems.map((i) => i._id).filter(Boolean)));
    if (ids.length === 0) return;
    fetchProductsByIds(ids).catch(() => {});
  }, [cartItems, fetchProductsByIds]);

  // If COD is disabled, ensure user isn't stuck on CASH
  useEffect(() => {
    if (!codEnabled && paymentMethod === "CASH") setPaymentMethod("PAYPAL");
  }, [codEnabled, paymentMethod]);

  // Helpers
  const findVariant = (product, variantId) => {
    if (!product?.variants?.length || !variantId) return null;
    return product.variants.find((v) => String(v._id) === String(variantId)) || null;
  };

  const findSize = (variant, variantSize) => {
    if (!variant?.sizes?.length || !variantSize) return null;
    return variant.sizes.find((s) => String(s.size) === String(variantSize)) || null;
  };

  const getBestImage = (product, cartItem) => {
    const fallback = cartItem?.variantImage?.[0]?.url || cartItem?.image?.[0]?.url || "";
    const v = findVariant(product, cartItem?.variantId);
    const variantImg = v?.images?.[0]?.url || v?.images?.[0];
    const productImg = product?.image?.[0]?.url || product?.image?.[0];
    return variantImg || productImg || fallback;
  };

  const getLatestUnitPrice = (product, cartItem) => {
    if (!product) return Number(cartItem?.price || 0);

    const discountRate = Number(product.discountBy || 0);
    const productBase = Number(product.price || 0);
    const productDiscounted = product.hasDiscount
      ? productBase - productBase * discountRate
      : productBase;

    const v = findVariant(product, cartItem?.variantId);
    const s = findSize(v, cartItem?.variantSize);

    if (s && Number(s.price || 0) > 0) {
      const sizePrice = Number(s.price || 0);
      return product.hasDiscount ? sizePrice - sizePrice * discountRate : sizePrice;
    }
    return productDiscounted;
  };

  const getLatestCategory = (product, cartItem) => {
    return product?.category || cartItem?.category || cartItem?.categoryId || null;
  };

  const getItemCategoryId = (item) => {
    return (
      item?.category?._id ||
      item?.categoryId ||
      (typeof item?.category === "string" ? item.category : null) ||
      item?.catId ||
      null
    );
  };

  // ✅ Build fresh cart items
  const freshCartItems = useMemo(() => {
    const list = Array.isArray(fetchedProducts) ? fetchedProducts : [];
    const prodMap = new Map(list.map((p) => [String(p._id), p]));

    return cartItems
      .map((ci) => {
        const p = prodMap.get(String(ci._id));
        if (!p) return null;

        const unitPrice = getLatestUnitPrice(p, ci);
        const imageUrl = getBestImage(p, ci);

        return {
          ...ci,
          name: p.name ?? ci.name,
          hasDiscount: !!p.hasDiscount,
          discountBy: Number(p.discountBy || 0),
          price: Number(p.price || 0),
          discountedPrice: unitPrice, // sale-applied unit price (before coupon)
          image: p.image,
          category: getLatestCategory(p, ci),
          variantImage: imageUrl ? [{ url: imageUrl }] : ci.variantImage,
        };
      })
      .filter(Boolean);
  }, [cartItems, fetchedProducts]);

  // ---------------------------
  // ✅ Coupon discount (same idea as Cart)
  // ---------------------------
  const subtotalBeforeCouponLocal = useMemo(() => {
    return freshCartItems.reduce((acc, item) => {
      const unit = Number(item.discountedPrice || 0);
      return acc + unit * Number(item.qty || 0);
    }, 0);
  }, [freshCartItems]);

  const couponDiscountLocal = useMemo(() => {
    if (!cartCoupon) return 0;

    const rate = Number(cartCoupon.discountBy ?? 0);
    if (!Number.isFinite(rate) || rate <= 0) return 0;

    const allowedCategories = Array.isArray(cartCoupon.categories) ? cartCoupon.categories : [];
    const hasCategoryLimit = allowedCategories.length > 0;

    const eligibleSubtotal = freshCartItems.reduce((acc, item) => {
      const itemTotal = Number(item.discountedPrice || 0) * Number(item.qty || 0);
      if (!hasCategoryLimit) return acc + itemTotal;

      const itemCategoryId = getItemCategoryId(item);
      if (itemCategoryId && allowedCategories.includes(String(itemCategoryId)))
        return acc + itemTotal;

      return acc;
    }, 0);

    const discount = eligibleSubtotal * rate;
    return discount > 0 ? discount : 0;
  }, [cartCoupon, freshCartItems]);

  // ---------------------------
  // ✅ Shipping fee with threshold + zone fee (FIX)
  // ---------------------------
  const currentDelivery = deliveryStatus?.[0] || {};
  const defaultShippingFee = Number(currentDelivery?.shippingFee ?? 0);
  const freeDeliveryThreshold = Number(currentDelivery?.freeDeliveryThreshold ?? 0);
  const zoneFees = Array.isArray(currentDelivery?.zoneFees) ? currentDelivery.zoneFees : [];

  const normalizeGov = (v) =>
    String(v || "")
      .trim()
      .toLowerCase();
  const getGovernorateFromAddress = (addr) => {
    if (!addr) return "";
    return addr.governorate || addr.gov || addr.zone || addr.area || addr.city || addr.state || "";
  };

  const computedShippingFee = useMemo(() => {
    let fee = defaultShippingFee;

    const userGov = normalizeGov(getGovernorateFromAddress(userAddress));
    if (userGov && zoneFees.length > 0) {
      const match = zoneFees.find((z) => normalizeGov(z?.zone) === userGov);
      if (match && Number.isFinite(Number(match.fee))) fee = Number(match.fee);
    }

    // ✅ IMPORTANT: threshold checked after coupon
    const itemsAfterCoupon = Math.max(subtotalBeforeCouponLocal - couponDiscountLocal, 0);
    if (freeDeliveryThreshold > 0 && itemsAfterCoupon >= freeDeliveryThreshold) fee = 0;

    return Number.isFinite(fee) ? fee : 0;
  }, [
    defaultShippingFee,
    freeDeliveryThreshold,
    zoneFees,
    userAddress,
    subtotalBeforeCouponLocal,
    couponDiscountLocal,
  ]);

  const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

  // ✅ Pass overrides so totals/paypal/order match the UI
  const {
    subtotalBeforeCoupon,
    itemsPrice,
    shippingPrice,
    couponDiscount,
    totalAmount,

    amountInUSD,
    loadingCreateOrder,
    loadingCheck,

    outOfStockItems,
    hasOutOfStock,

    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  } = usePayment(freshCartItems, userAddress, paymentMethod, deliveryStatus, cartCoupon, {
    shippingPriceOverride: computedShippingFee,
    couponDiscountOverride: couponDiscountLocal,
    subtotalBeforeCouponOverride: subtotalBeforeCouponLocal,
  });

  const isBusy = loadingCreateOrder || loadingCheck;

  // ✅ disable if out of stock OR editing address OR missing address
  const disableActions =
    isBusy || loadingProducts || loadingStore || editAddress || !userAddress || hasOutOfStock;

  // ✅ Edit button behavior:
  // - if no address -> open create modal
  // - if address exists -> toggle inline edit
  const handleEditAddressClick = () => {
    if (!userAddress) {
      setIsAddressModalOpen(true);
      return;
    }
    setEditAddress(true);
  };

  const closeCreateModal = async () => {
    setIsAddressModalOpen(false);
    await refetch?.();
  };

  return (
    <Layout>
      <div className="overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-24 md:pt-28 pb-16">
          {/* Page header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
                Checkout
              </h1>

              {loadingProducts && cartItems.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-neutral-500">
                  Updating latest prices…
                </p>
              )}
              {loadingStore && (
                <p className="mt-2 text-xs font-semibold text-neutral-500">
                  Loading payment options…
                </p>
              )}

              {/* ✅ Out of stock banner */}
              {hasOutOfStock && (
                <div className="mt-3 sm:hidden rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <div className="text-sm font-extrabold text-rose-700">
                    Some items are out of stock
                  </div>
                  <div className="mt-1 text-xs text-rose-700">
                    Please go back to cart and remove out-of-stock items.
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
                Back to cart <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Content grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* RIGHT column (Order Summary) */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 min-w-0">
              <div className="w-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-neutral-900">Order summary</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {freshCartItems.length} item{freshCartItems.length === 1 ? "" : "s"} in your
                      cart
                    </p>
                  </div>
                  <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-extrabold text-neutral-900">
                      {Number(subtotalBeforeCoupon || 0).toFixed(3)} KD
                    </span>
                  </div>

                  {Number(couponDiscount || 0) > 0 && (
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="text-neutral-600">
                        Coupon{cartCoupon?.code ? ` (${cartCoupon.code})` : ""}
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        -{Number(couponDiscount || 0).toFixed(3)} KD
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-extrabold text-neutral-900">
                      {Number(shippingPrice || 0).toFixed(3)} KD
                    </span>
                  </div>

                  <div className="my-3 h-px w-full bg-neutral-200" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-700 font-semibold">Total</span>
                    <span className="text-lg font-extrabold text-neutral-900">
                      {Number(totalAmount || 0).toFixed(3)} KD
                    </span>
                  </div>

                  {Number(couponDiscount || 0) > 0 && (
                    <div className="mt-2 text-xs text-neutral-500">
                      Items after discount:{" "}
                      <span className="font-semibold text-neutral-900">
                        {Number(itemsPrice || 0).toFixed(3)} KD
                      </span>
                    </div>
                  )}
                </div>

                {/* Items list */}
                <div className="mt-5 space-y-3">
                  {freshCartItems.map((item, idx) => {
                    const unitPrice = Number(item.discountedPrice || 0);
                    const rowTotal = unitPrice * Number(item.qty || 0);

                    // ✅ mark item if it is in outOfStockItems
                    const isOut = (outOfStockItems || []).some(
                      (x) =>
                        String(x.productId) === String(item._id) &&
                        String(x.variantId || "null") === String(item.variantId || "null") &&
                        String(x.size || "null") === String(item.variantSize || "null"),
                    );

                    return (
                      <div
                        key={`${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}-${idx}`}
                        className={clsx(
                          "rounded-2xl border bg-white p-3",
                          isOut ? "border-rose-200" : "border-neutral-200",
                        )}>
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                            alt="product"
                            className="shrink-0 h-12 w-12 rounded-xl object-cover border bg-neutral-50"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-extrabold text-neutral-900">
                              {item.name}
                            </div>

                            {(item.variantColor || item.variantSize) && (
                              <div className="mt-1 truncate text-xs text-neutral-500">
                                {item.variantColor ?? "-"} / {item.variantSize ?? "-"}
                              </div>
                            )}

                            {isOut && (
                              <div className="mt-2 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-extrabold text-rose-700">
                                OUT OF STOCK
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-xs text-neutral-500">
                              {item.qty} × {unitPrice.toFixed(3)} KD
                            </div>
                            <div className="text-sm font-extrabold text-neutral-900">
                              {rowTotal.toFixed(3)} KD
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
                  By placing your order, you agree to our{" "}
                  <Link to="/about" className="font-semibold text-neutral-900 hover:opacity-70">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/about" className="font-semibold text-neutral-900 hover:opacity-70">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>

            {/* LEFT column */}
            <div className="order-2 lg:order-1 min-w-0 space-y-6">
              {/* Shipping Address */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 grid h-10 w-10 place-items-center rounded-2xl bg-neutral-950 text-white">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-lg font-extrabold text-neutral-900">Shipping address</h2>
                      <p className="mt-1 text-sm text-neutral-500 truncate">
                        Make sure your details are correct.
                      </p>
                    </div>
                  </div>

                  {!editAddress ? (
                    <button
                      type="button"
                      onClick={handleEditAddressClick}
                      className="shrink-0 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
                      Edit
                    </button>
                  ) : null}
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Spinner className="border-t-black" />
                      <span className="text-sm text-neutral-600">Loading address…</span>
                    </div>
                  ) : !userAddress ? (
                    <div className="text-sm text-rose-600 font-semibold">
                      No address found. Please add your address.
                    </div>
                  ) : !editAddress ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["Governorate", userAddress?.governorate],
                        ["City", userAddress?.city],
                        ["Block", userAddress?.block],
                        ["Street", userAddress?.street],
                        ["House", userAddress?.house],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="rounded-2xl bg-white p-3 ring-1 ring-black/5 min-w-0">
                          <div className="text-xs font-semibold text-neutral-500">{k}</div>
                          <div className="mt-1 text-sm font-extrabold text-neutral-900 truncate">
                            {v || "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 min-w-0">
                      <label className="block min-w-0">
                        <span className="text-xs text-neutral-500">Governorate</span>
                        <select
                          value={addressForm.governorate}
                          onChange={onProvinceChange}
                          disabled={loadingAddress}
                          className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                                     focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60">
                          <option value="">Choose governorate</option>
                          {provinces.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block min-w-0">
                        <span className="text-xs text-neutral-500">City</span>
                        <select
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((a) => ({ ...a, city: e.target.value }))}
                          disabled={loadingAddress || !addressForm.governorate}
                          className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                                     focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60">
                          <option value="">Choose city</option>
                          {cities.map((c, i) => (
                            <option key={`${c}-${i}`} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <label className="block min-w-0">
                          <span className="text-xs text-neutral-500">Block</span>
                          <input
                            value={addressForm.block}
                            onChange={(e) =>
                              setAddressForm((a) => ({ ...a, block: e.target.value }))
                            }
                            placeholder="Block"
                            disabled={loadingAddress}
                            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                                       focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
                          />
                        </label>

                        <label className="block min-w-0">
                          <span className="text-xs text-neutral-500">House</span>
                          <input
                            value={addressForm.house}
                            onChange={(e) =>
                              setAddressForm((a) => ({ ...a, house: e.target.value }))
                            }
                            placeholder="House"
                            disabled={loadingAddress}
                            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                                       focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
                          />
                        </label>
                      </div>

                      <label className="block min-w-0">
                        <span className="text-xs text-neutral-500">Street</span>
                        <input
                          value={addressForm.street}
                          onChange={(e) =>
                            setAddressForm((a) => ({ ...a, street: e.target.value }))
                          }
                          placeholder="Street"
                          disabled={loadingAddress}
                          className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                                     focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={saveAddress}
                          disabled={loadingAddress}
                          className={clsx(
                            "w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                            loadingAddress
                              ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
                              : "bg-neutral-950 text-white hover:opacity-95",
                          )}>
                          {loadingAddress ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditAddress(false)}
                          disabled={loadingAddress}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="w-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-neutral-900">Payment method</h2>
                    <p className="mt-1 text-sm text-neutral-500 truncate">
                      Choose how you want to pay.
                    </p>
                  </div>

                  <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
                    <Lock className="h-4 w-4" />
                    Encrypted
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {codEnabled && (
                    <label
                      className={clsx(
                        "group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition min-w-0",
                        paymentMethod === "CASH"
                          ? "border-neutral-950 bg-neutral-50"
                          : "border-neutral-200 bg-white hover:bg-neutral-50",
                      )}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH"
                        checked={paymentMethod === "CASH"}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 shrink-0"
                      />
                      <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                        <HandCoins className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-neutral-900 truncate">
                          Cash On Delivery
                        </div>
                        <div className="mt-1 text-xs text-neutral-500 truncate">
                          Pay when the order arrives.
                        </div>
                      </div>
                    </label>
                  )}

                  <label
                    className={clsx(
                      "group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition min-w-0",
                      paymentMethod === "PAYPAL"
                        ? "border-neutral-950 bg-neutral-50"
                        : "border-neutral-200 bg-white hover:bg-neutral-50",
                    )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYPAL"
                      checked={paymentMethod === "PAYPAL"}
                      onChange={handlePaymentChange}
                      className="h-4 w-4 shrink-0"
                    />
                    <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-neutral-900 truncate">
                        Credit Card
                      </div>
                      <div className="mt-1 text-xs text-neutral-500 truncate">
                        Pay securely with card (PayPal).
                      </div>
                    </div>
                  </label>
                </div>

                {/* PayPal Buttons */}
                {paymentMethod === "PAYPAL" && (
                  <div className="mt-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 w-full overflow-hidden">
                    <div className="w-full max-w-full">
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        disabled={disableActions}
                        fundingSource={FUNDING.CARD}
                        createOrder={createPayPalOrder(userInfo, amountInUSD)}
                        onApprove={handlePayPalApprove}
                        onError={(err) => {
                          toast.error("PayPal payment failed");
                          console.error(err);
                        }}
                      />
                    </div>
                    <div className="mt-3 text-xs text-neutral-500 break-words">
                      Amount:{" "}
                      <span className="font-semibold text-neutral-900">{amountInUSD} USD</span>
                    </div>
                  </div>
                )}

                {/* Cash button */}
                {paymentMethod === "CASH" && codEnabled && (
                  <button
                    disabled={disableActions}
                    onClick={handleCashPayment}
                    className={clsx(
                      "mt-5 w-full px-4 py-3 text-sm font-extrabold transition",
                      disableActions
                        ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
                        : "bg-neutral-950 text-white hover:opacity-95",
                    )}>
                    {loadingProducts
                      ? "Updating prices..."
                      : loadingCheck
                        ? "Checking stock..."
                        : loadingCreateOrder
                          ? "Placing order..."
                          : hasOutOfStock
                            ? "Out of stock"
                            : "Place order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ CREATE ONLY modal */}
        <AddressModal isOpen={isAddressModalOpen} onClose={closeCreateModal} />
      </div>
    </Layout>
  );
}

export default Payment;
