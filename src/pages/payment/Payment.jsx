import { useState, useMemo } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { HandCoins, CreditCard, ShieldCheck, Truck, MapPin, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery } from "../../redux/queries/productApi";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { usePayment } from "../../hooks/usePayment";

/**
 * Fixes:
 * 1) Removes unwanted horizontal scroll:
 *    - outer wrapper uses overflow-x-hidden
 *    - all cards use w-full and min-w-0 where needed
 *    - images/text use truncate and avoid fixed gaps that overflow
 *    - PayPal wrapper constrained to w-full
 *
 * 2) On mobile, show Order Summary on top:
 *    - use order classes: summary first on <lg
 */

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const { data: userAddress, isLoading } = useGetAddressQuery(userInfo?._id);
  const { data: deliveryStatus } = useGetDeliveryStatusQuery();

  const handlePaymentChange = (e) => setPaymentMethod(e.target.value);

  const {
    totalAmount,
    amountInUSD,
    loadingCreateOrder,
    loadingCheck,
    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  } = usePayment(cartItems, userAddress, paymentMethod, deliveryStatus);

  const shippingFee = Number(deliveryStatus?.[0]?.shippingFee ?? 0);

  const subTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + (item.hasDiscount ? item.discountedPrice : item.price) * item.qty,
      0,
    );
  }, [cartItems]);

  const totalCost = useMemo(() => subTotal + shippingFee, [subTotal, shippingFee]);

  const isBusy = loadingCreateOrder || loadingCheck;

  return (
    <Layout>
      {/* overflow-x-hidden prevents any accidental horizontal scroll */}
      <div className="overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-24 md:pt-28 pb-16">
          {/* Page header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
                Checkout
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Confirm your address, choose payment, and place your order.
              </p>
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
            {/* RIGHT column (Order Summary) — FIRST on mobile */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 min-w-0">
              <div className="w-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-neutral-900">Order summary</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {cartItems.length} item{cartItems.length === 1 ? "" : "s"} in your cart
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
                      {subTotal.toFixed(3)} KD
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-extrabold text-neutral-900">
                      {shippingFee.toFixed(3)} KD
                    </span>
                  </div>
                  <div className="my-3 h-px w-full bg-neutral-200" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-700 font-semibold">Total</span>
                    <span className="text-lg font-extrabold text-neutral-900">
                      {totalCost.toFixed(3)} KD
                    </span>
                  </div>
                </div>

                {/* Items list */}
                <div className="mt-5 space-y-3">
                  {cartItems.map((item, idx) => {
                    const unitPrice = item.hasDiscount ? item.discountedPrice : item.price;
                    const rowTotal = unitPrice * item.qty;

                    return (
                      <div
                        key={`${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}-${idx}`}
                        className="rounded-2xl border border-neutral-200 bg-white p-3">
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
                  <Link to="/terms" className="font-semibold text-neutral-900 hover:opacity-70">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-semibold text-neutral-900 hover:opacity-70">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>

            {/* LEFT column — SECOND on mobile */}
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

                  <Link
                    to="/profile"
                    className="shrink-0 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
                    Edit
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Spinner className="border-t-black" />
                      <span className="text-sm text-neutral-600">Loading address…</span>
                    </div>
                  ) : userAddress ? (
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
                    <div className="text-sm text-rose-600 font-semibold">
                      No address found. Please add your address in Profile.
                    </div>
                  )}
                </div>

                {/* Delivery info */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 min-w-0">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Shipping</span>
                    </div>
                    <div className="mt-2 text-sm font-extrabold text-neutral-900">
                      {shippingFee.toFixed(3)} KD
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 min-w-0">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Protection</span>
                    </div>
                    <div className="mt-2 text-sm font-extrabold text-neutral-900 truncate">
                      Secure payment
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 min-w-0">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Delivery time</span>
                    </div>
                    <div className="mt-2 text-sm font-extrabold text-neutral-900 uppercase truncate">
                      {deliveryStatus?.[0]?.timeToDeliver || "-"}
                    </div>
                  </div>
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
                  {/* Cash */}
                  <label
                    className={clsx(
                      "group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition min-w-0",
                      paymentMethod === "cash"
                        ? "border-neutral-950 bg-neutral-50"
                        : "border-neutral-200 bg-white hover:bg-neutral-50",
                    )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={handlePaymentChange}
                      className="h-4 w-4 shrink-0"
                    />
                    <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                      <HandCoins className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-neutral-900 truncate">
                        Cash on delivery
                      </div>
                      <div className="mt-1 text-xs text-neutral-500 truncate">
                        Pay when the order arrives.
                      </div>
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={clsx(
                      "group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition min-w-0",
                      paymentMethod === "paypal"
                        ? "border-neutral-950 bg-neutral-50"
                        : "border-neutral-200 bg-white hover:bg-neutral-50",
                    )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentChange}
                      className="h-4 w-4 shrink-0"
                    />
                    <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-neutral-900 truncate">
                        Credit card
                      </div>
                      <div className="mt-1 text-xs text-neutral-500 truncate">
                        Pay securely with card (PayPal).
                      </div>
                    </div>
                  </label>
                </div>

                {/* PayPal Buttons (constrained) */}
                {paymentMethod === "paypal" && (
                  <div className="mt-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 w-full overflow-hidden">
                    <div className="w-full max-w-full">
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        disabled={loadingCheck || loadingCreateOrder}
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
                {paymentMethod === "cash" && (
                  <button
                    disabled={isBusy}
                    onClick={handleCashPayment}
                    className={clsx(
                      "mt-5 w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition",
                      isBusy
                        ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
                        : "bg-neutral-950 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] hover:opacity-95",
                    )}>
                    {loadingCheck
                      ? "Checking stock..."
                      : loadingCreateOrder
                        ? "Placing order..."
                        : "Place order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;
