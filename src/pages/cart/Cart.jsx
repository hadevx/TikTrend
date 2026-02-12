import { useEffect, useMemo, useState } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Truck, ShieldCheck, ArrowRight, Ticket } from "lucide-react";
import {
  removeFromCart,
  updateCart,
  applyCoupon,
  removeCoupon,
} from "../../redux/slices/cartSlice";
import Message from "../../components/Message";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import {
  useFetchProductsByIdsMutation,
  useValidateCouponMutation,
} from "../../redux/queries/productApi";
import { useCheckStockMutation } from "../../redux/queries/orderApi";
import Lottie from "lottie-react";
import empty from "./empty.json";
import { useGetDeliveryStatusQuery } from "../../redux/queries/deliveryApi";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartCoupon = useSelector((state) => state.cart.coupon);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: deliveryStatus } = useGetDeliveryStatusQuery();
  const { data: userAddress } = useGetAddressQuery(userInfo?._id);

  const [fetchProductsByIds, { data: fetchedProducts, isLoading: loadingProducts }] =
    useFetchProductsByIdsMutation();

  const [validateCoupon] = useValidateCouponMutation();
  const [checkStock, { isLoading: loadingStockCheck }] = useCheckStockMutation();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [outOfStockMap, setOutOfStockMap] = useState(new Map());
  const [stockMsg, setStockMsg] = useState(null);

  useEffect(() => {
    if (cartCoupon?.code) setCouponCode(cartCoupon.code);
  }, [cartCoupon]);

  useEffect(() => {
    const ids = Array.from(new Set(cartItems.map((i) => i._id).filter(Boolean)));
    if (ids.length === 0) return;
    fetchProductsByIds(ids).catch(() => {});
  }, [cartItems, fetchProductsByIds]);

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

  const getLatestStock = (product, cartItem) => {
    if (!product) return Number(cartItem?.stock || 0);

    const v = findVariant(product, cartItem?.variantId);
    const s = findSize(v, cartItem?.variantSize);
    if (s && typeof s.stock === "number") return Number(s.stock);
    if (v && typeof v.stock === "number") return Number(v.stock);
    return Number(product.countInStock || 0);
  };

  const getLatestCategory = (product, cartItem) => {
    return product?.category || cartItem?.category || cartItem?.categoryId || null;
  };

  const key = (pid, vid, size) =>
    `${String(pid)}-${vid ? String(vid) : "null"}-${size ? String(size) : "null"}`;

  const freshCartItems = useMemo(() => {
    const list = Array.isArray(fetchedProducts) ? fetchedProducts : [];
    const prodMap = new Map(list.map((p) => [String(p._id), p]));

    return cartItems
      .map((ci) => {
        const p = prodMap.get(String(ci._id));
        if (!p) return null;

        const unitPrice = getLatestUnitPrice(p, ci);
        const imageUrl = getBestImage(p, ci);
        const stock = getLatestStock(p, ci);

        return {
          ...ci,
          name: p.name ?? ci.name,
          hasDiscount: !!p.hasDiscount,
          discountBy: Number(p.discountBy || 0),
          price: Number(p.price || 0),
          discountedPrice: unitPrice,
          image: p.image,
          category: getLatestCategory(p, ci),
          variantImage: imageUrl ? [{ url: imageUrl }] : ci.variantImage,
          stock,
        };
      })
      .filter(Boolean);
  }, [cartItems, fetchedProducts]);

  useEffect(() => {
    if (!Array.isArray(fetchedProducts)) return;
    if (cartItems.length === 0) return;

    const existingIds = new Set(fetchedProducts.map((p) => String(p._id)));

    cartItems.forEach((ci) => {
      if (!existingIds.has(String(ci._id))) {
        dispatch(removeFromCart(ci));
        return;
      }

      const p = fetchedProducts.find((x) => String(x._id) === String(ci._id));
      if (!p) return;

      if (ci.variantId && Array.isArray(p.variants) && p.variants.length > 0) {
        const v = p.variants.find((vv) => String(vv._id) === String(ci.variantId));
        if (!v) {
          dispatch(removeFromCart(ci));
          return;
        }

        if (ci.variantSize && Array.isArray(v.sizes) && v.sizes.length > 0) {
          const s = v.sizes.find((ss) => String(ss.size) === String(ci.variantSize));
          if (!s) dispatch(removeFromCart(ci));
        }
      }
    });
  }, [fetchedProducts, cartItems, dispatch]);

  const handleRemove = (item) => dispatch(removeFromCart(item));

  const handleChange = (e, item) => {
    const newQty = Number(e.target.value);
    dispatch(updateCart({ ...item, qty: newQty }));
  };

  // ---------------------------
  // Delivery
  // ---------------------------
  const currentDelivery = deliveryStatus?.[0] || {};
  const defaultShippingFee = Number(currentDelivery?.shippingFee ?? 0);
  const minOrder = Number(currentDelivery?.minDeliveryCost ?? 0);
  const freeDeliveryThreshold = Number(currentDelivery?.freeDeliveryThreshold ?? 0);
  const zoneFees = Array.isArray(currentDelivery?.zoneFees) ? currentDelivery.zoneFees : [];

  const subTotal = useMemo(() => {
    return freshCartItems.reduce((acc, item) => {
      const unitPrice = Number(item.discountedPrice || 0);
      return acc + unitPrice * Number(item.qty || 0);
    }, 0);
  }, [freshCartItems]);

  const getItemCategoryId = (item) => {
    return (
      item?.category?._id ||
      item?.categoryId ||
      (typeof item?.category === "string" ? item.category : null) ||
      item?.catId ||
      null
    );
  };

  const couponDiscount = useMemo(() => {
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

    const itemsAfterCoupon = Math.max(subTotal - couponDiscount, 0);
    if (freeDeliveryThreshold > 0 && itemsAfterCoupon >= freeDeliveryThreshold) fee = 0;

    return Number.isFinite(fee) ? fee : 0;
  }, [defaultShippingFee, zoneFees, userAddress, freeDeliveryThreshold, subTotal, couponDiscount]);

  const totalCost = useMemo(() => {
    const total = subTotal + computedShippingFee - couponDiscount;
    return total < 0 ? 0 : total;
  }, [subTotal, computedShippingFee, couponDiscount]);

  // ---------------------------
  // Stock check
  // ---------------------------
  const localOutOfStockItems = useMemo(() => {
    return freshCartItems.filter((i) => Number(i.stock ?? 0) <= 0);
  }, [freshCartItems]);

  const hasLocalOutOfStock = localOutOfStockItems.length > 0;
  const hasServerOutOfStock = outOfStockMap.size > 0;
  const hasAnyOutOfStock = hasLocalOutOfStock || hasServerOutOfStock;

  const runStockCheck = async () => {
    try {
      if (freshCartItems.length === 0) {
        setOutOfStockMap(new Map());
        setStockMsg(null);
        return;
      }

      const payload = freshCartItems.map((item) => ({
        productId: item._id,
        variantId: item.variantId || null,
        size: item.variantSize || null,
        qty: Number(item.qty || 0),
      }));

      const res = await checkStock(payload).unwrap();
      const out = Array.isArray(res?.outOfStockItems) ? res.outOfStockItems : [];

      const m = new Map();
      out.forEach((x) => {
        m.set(key(x.productId, x.variantId, x.size), {
          availableStock:
            typeof x.availableStock === "number" ? Number(x.availableStock) : undefined,
          reason: x.reason,
        });
      });

      setOutOfStockMap(m);

      if (m.size > 0) {
        setStockMsg({
          type: "error",
          text: "Some items are out of stock. Please remove them or reduce quantity.",
        });
      } else {
        setStockMsg(null);
      }
    } catch (e) {
      setStockMsg({
        type: "info",
        text: "Could not verify live stock right now. Please try again.",
      });
      setOutOfStockMap(new Map());
    }
  };

  useEffect(() => {
    if (loadingProducts) return;
    runStockCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadingProducts,
    freshCartItems
      .map((i) => `${i._id}:${i.variantId ?? "null"}:${i.variantSize ?? "null"}:${i.qty}`)
      .join("|"),
  ]);

  const disabledCheckout =
    freshCartItems.length === 0 ||
    (minOrder > 0 && totalCost < minOrder) ||
    hasAnyOutOfStock ||
    loadingStockCheck;

  const handleGoToPayment = () => {
    if (!userInfo) return navigate("/login");
    if (disabledCheckout) return;
    navigate("/payment");
  };

  // ---------------------------
  // Coupon
  // ---------------------------
  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponMsg({ type: "error", text: "Please enter a coupon code." });
      return;
    }
    if (freshCartItems.length === 0) {
      setCouponMsg({ type: "error", text: "Your cart is empty." });
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMsg(null);

    try {
      const payload = {
        code,
        cartTotal: Number(subTotal.toFixed(3)),
        items: freshCartItems.map((i) => ({
          productId: i._id,
          qty: i.qty,
          price: Number(i.discountedPrice || 0),
          categoryId: getItemCategoryId(i),
          variantId: i.variantId ?? null,
          variantSize: i.variantSize ?? null,
        })),
      };

      const data = await validateCoupon(payload).unwrap();

      if (!data || data.valid !== true) {
        dispatch(removeCoupon());
        setCouponMsg({ type: "error", text: data?.message || "Invalid coupon code." });
        return;
      }

      const normalized = {
        valid: true,
        code: data.code || code,
        discountBy: Number(data.discountBy ?? 0),
        categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
        message: data.message,
      };

      if (!normalized.discountBy || normalized.discountBy <= 0) {
        dispatch(removeCoupon());
        setCouponMsg({ type: "error", text: "Coupon has no discount value." });
        return;
      }

      if (normalized.categories.length > 0) {
        const eligibleExists = freshCartItems.some((item) => {
          const itemCategoryId = getItemCategoryId(item);
          return itemCategoryId && normalized.categories.includes(String(itemCategoryId));
        });

        if (!eligibleExists) {
          dispatch(removeCoupon());
          setCouponMsg({
            type: "error",
            text: data?.message || "This coupon does not apply to items in your cart.",
          });
          return;
        }
      }

      dispatch(applyCoupon(normalized));
      const ratePct = Math.round(normalized.discountBy * 100);
      setCouponMsg({
        type: "success",
        text: normalized.message || `Coupon applied (${ratePct}% off).`,
      });
    } catch (e) {
      dispatch(removeCoupon());
      setCouponMsg({ type: "error", text: "Failed to apply coupon. Please try again." });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode("");
    setCouponMsg({ type: "info", text: "Coupon removed." });
  };

  useEffect(() => {
    if (!cartCoupon) return;

    const allowedCategories = Array.isArray(cartCoupon.categories) ? cartCoupon.categories : [];
    if (allowedCategories.length === 0) return;

    const stillEligible = freshCartItems.some((item) => {
      const itemCategoryId = getItemCategoryId(item);
      return itemCategoryId && allowedCategories.includes(String(itemCategoryId));
    });

    if (!stillEligible) {
      dispatch(removeCoupon());
      setCouponMsg({ type: "info", text: "Coupon removed (no eligible items in cart)." });
    }
  }, [freshCartItems, cartCoupon, dispatch]);

  const Alert = ({ msg }) => {
    if (!msg) return null;
    const styles =
      msg.type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : msg.type === "error"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-neutral-200 bg-neutral-50 text-neutral-700";

    return (
      <div className={clsx("mt-3 rounded-2xl border p-3 text-sm font-semibold", styles)}>
        {msg.text}
      </div>
    );
  };

  const showEmpty = !loadingProducts && freshCartItems.length === 0;

  // ✅ Single consistent image size everywhere
  const IMG_WRAP_DESKTOP = "h-20 w-20";
  const IMG_WRAP_MOBILE = "h-24 w-24";
  const IMG_BASE =
    "rounded-2xl border bg-neutral-50 overflow-hidden flex items-center justify-center";
  const IMG_IMG = "h-full w-full object-cover object-center block";

  const imgSrc = (item) =>
    item?.variantImage?.[0]?.url || item?.image?.[0]?.url || item?.image?.[0] || "";

  // ---------------------------
  // ✅ Skeletons
  // ---------------------------
  const SkeletonLine = ({ className = "" }) => (
    <div className={clsx("animate-pulse rounded-xl bg-neutral-200/70", className)} />
  );

  const CartRowSkeleton = () => (
    <div className="rounded-3xl border border-neutral-200 bg-white p-3 md:p-4">
      {/* Desktop skeleton */}
      <div className="hidden md:grid grid-cols-[1.2fr_0.7fr_0.45fr_0.55fr_0.5fr_44px] gap-3 items-center">
        <div className="flex items-center gap-3 min-w-0">
          <div className={clsx(IMG_BASE, IMG_WRAP_DESKTOP, "bg-neutral-100")}>
            <SkeletonLine className="h-full w-full rounded-none" />
          </div>
          <div className="min-w-0">
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="mt-2 h-3 w-24" />
          </div>
        </div>
        <SkeletonLine className="h-4 w-28" />
        <SkeletonLine className="h-4 w-20" />
        <SkeletonLine className="h-10 w-[110px] rounded-2xl" />
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-10 w-10 rounded-2xl" />
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden flex gap-3">
        <div className={clsx(IMG_BASE, IMG_WRAP_MOBILE, "bg-neutral-100")}>
          <SkeletonLine className="h-full w-full rounded-none" />
        </div>
        <div className="flex-1 min-w-0">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="mt-2 h-3 w-28" />
          <div className="mt-3 flex items-center justify-between">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-20" />
          </div>
          <SkeletonLine className="mt-3 h-11 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );

  const SummarySkeleton = () => (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="mt-2 h-3 w-56" />
        </div>
        <SkeletonLine className="h-11 w-11 rounded-2xl" />
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
        <SkeletonLine className="h-4 w-24" />
        <div className="mt-3 flex items-center gap-2">
          <SkeletonLine className="h-11 flex-1 rounded-2xl" />
          <SkeletonLine className="h-11 w-20 rounded-2xl" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-4 w-24" />
        </div>

        <div className="my-3 h-px w-full bg-neutral-200" />

        <div className="flex items-center justify-between">
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-6 w-28" />
        </div>

        <SkeletonLine className="mt-5 h-12 w-full rounded-2xl" />
      </div>
    </div>
  );

  const showLoadingSkeleton = loadingProducts && cartItems.length > 0;

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-24 md:pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-row justify-between gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
              Your Cart
            </h1>
          </div>

          <div className="shrink-0">
            <Link
              to="/all-products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50">
              Continue shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          {/* LEFT */}
          <div className="space-y-4">
            {showLoadingSkeleton ? (
              <>
                <div className="hidden md:grid grid-cols-[1.2fr_0.7fr_0.45fr_0.55fr_0.5fr_44px] gap-3 px-4 text-xs font-extrabold text-neutral-500">
                  <div>Product</div>
                  <div>Color/Size</div>
                  <div>Price</div>
                  <div>Qty</div>
                  <div>Total</div>
                  <div />
                </div>

                <div className="space-y-3">
                  {Array.from({ length: Math.min(cartItems.length || 3, 5) }).map((_, i) => (
                    <CartRowSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : showEmpty ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                <Message dismiss={false}>Your cart is empty</Message>
                <div className="mx-auto mt-4 w-full max-w-[360px]">
                  <Lottie animationData={empty} loop={true} />
                </div>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-[1.2fr_0.7fr_0.45fr_0.55fr_0.5fr_44px] gap-3 px-4 text-xs font-extrabold text-neutral-500">
                  <div>Product</div>
                  <div>Color/Size</div>
                  <div>Price</div>
                  <div>Qty</div>
                  <div>Total</div>
                  <div />
                </div>

                <div className="space-y-3">
                  {freshCartItems.map((item, idx) => {
                    const stock = Number(item.stock ?? 0);
                    const unitPrice = Number(item.discountedPrice || 0);
                    const rowTotal = unitPrice * Number(item.qty || 0);

                    const itemKey = key(item._id, item.variantId, item.variantSize);
                    const serverFlag = outOfStockMap.get(itemKey);
                    const isOut =
                      stock <= 0 ||
                      (serverFlag &&
                        (typeof serverFlag.availableStock === "number"
                          ? serverFlag.availableStock <= 0 || item.qty > serverFlag.availableStock
                          : true));

                    return (
                      <div
                        key={`${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}-${idx}`}
                        className={clsx(
                          "rounded-3xl border bg-white p-3 md:p-4",
                          isOut ? "border-rose-200" : "border-neutral-200",
                        )}>
                        {/* Desktop */}
                        <div className="hidden md:grid grid-cols-[1.2fr_0.7fr_0.45fr_0.55fr_0.5fr_44px] gap-3 items-center">
                          <Link to={`/product/${item._id}`} className="flex items-center gap-3">
                            <div className={clsx(IMG_BASE, IMG_WRAP_DESKTOP)}>
                              <img
                                src={imgSrc(item)}
                                alt={item.name}
                                className={IMG_IMG}
                                loading="lazy"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="truncate w-32 text-sm font-semibold text-neutral-900">
                                {item.name}
                              </div>

                              {isOut && (
                                <div className="mt-1 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-extrabold text-rose-600">
                                  OUT OF STOCK
                                </div>
                              )}

                              {item.hasDiscount && (
                                <div className="mt-1 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                  Sale
                                </div>
                              )}
                            </div>
                          </Link>

                          <div className="text-sm text-neutral-700">
                            {item.variantColor ?? "-"} / {item.variantSize ?? "-"}
                          </div>

                          <div className="text-sm font-semibold text-neutral-900">
                            {unitPrice.toFixed(3)} KD
                          </div>

                          <div>
                            <select
                              value={item.qty}
                              onChange={(e) => handleChange(e, item)}
                              disabled={stock === 0}
                              className="w-[110px] rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-400">
                              {[...Array(Math.max(stock, 1)).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-sm font-extrabold text-neutral-900">
                            {rowTotal.toFixed(3)} KD
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="grid h-10 w-10 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Remove">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden flex gap-3">
                          <div className={clsx(IMG_BASE, IMG_WRAP_MOBILE)}>
                            <img
                              src={imgSrc(item)}
                              alt={item.name}
                              className={IMG_IMG}
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link to={`/product/${item._id}`} className="min-w-0">
                                <div className="truncate text-sm font-semibold text-neutral-900">
                                  {item.name}
                                </div>
                                <div className="mt-1 text-xs text-neutral-500">
                                  {item.variantColor ?? "-"} / {item.variantSize ?? "-"}
                                </div>

                                {isOut && (
                                  <div className="mt-2 inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-extrabold text-rose-600">
                                    OUT OF STOCK
                                  </div>
                                )}
                              </Link>

                              <button
                                onClick={() => handleRemove(item)}
                                className="grid h-9 w-9 place-items-center rounded-2xl border border-neutral-200 bg-white text-neutral-900 hover:bg-rose-50 hover:text-rose-600"
                                aria-label="Remove">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-sm font-semibold text-neutral-900">
                                {unitPrice.toFixed(3)} KD
                                {item.hasDiscount && (
                                  <span className="ml-2 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                    Sale
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-extrabold text-neutral-900">
                                {rowTotal.toFixed(3)} KD
                              </div>
                            </div>

                            <div className="mt-3">
                              <select
                                value={item.qty}
                                onChange={(e) => handleChange(e, item)}
                                disabled={stock === 0}
                                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-400">
                                {[...Array(Math.max(stock, 1)).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24">
            {showLoadingSkeleton ? (
              <SummarySkeleton />
            ) : (
              <div className="rounded-3xl border border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-neutral-900">Order summary</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Shipping & totals calculated at checkout.
                    </p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <Alert msg={stockMsg} />

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
                    <Ticket className="h-4 w-4" />
                    Coupon
                  </div>

                  {cartCoupon ? (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 truncate">
                          Applied: {cartCoupon.code || couponCode}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Discount: {(Number(cartCoupon.discountBy ?? 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="h-11 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className={clsx(
                          "h-11 rounded-2xl px-4 text-sm font-extrabold transition",
                          isApplyingCoupon || !couponCode.trim()
                            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                            : "bg-neutral-950 text-white hover:opacity-95",
                        )}>
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  )}

                  <Alert msg={couponMsg} />
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold text-neutral-900">{subTotal.toFixed(3)} KD</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-neutral-600">
                      Delivery <Truck className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {computedShippingFee === 0 ? "Free" : `${computedShippingFee.toFixed(3)} KD`}
                    </span>
                  </div>

                  {couponDiscount > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Coupon discount</span>
                      <span className="font-semibold text-emerald-700">
                        -{Number(couponDiscount).toFixed(3)} KD
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Expected delivery</span>
                    <span className="font-semibold text-neutral-900 uppercase">
                      {deliveryStatus?.[0]?.timeToDeliver ?? "-"}
                    </span>
                  </div>

                  <div className="my-3 h-px w-full bg-neutral-200" />

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-700 font-semibold">Total</span>
                    <span className="text-lg font-extrabold text-neutral-900">
                      {totalCost.toFixed(3)} KD
                    </span>
                  </div>

                  {freshCartItems.length > 0 && minOrder > 0 && totalCost < minOrder && (
                    <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                      <div className="text-sm font-extrabold">Minimum order required</div>
                      <div className="mt-1 text-sm">
                        Minimum order:{" "}
                        <span className="font-extrabold">{minOrder.toFixed(3)} KD</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGoToPayment}
                    disabled={disabledCheckout}
                    className={clsx(
                      "mt-5 w-full px-4 py-3 text-sm font-extrabold transition ",
                      disabledCheckout
                        ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-950 text-white hover:opacity-95",
                    )}>
                    {loadingStockCheck ? "Checking stock..." : "Go to payment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
