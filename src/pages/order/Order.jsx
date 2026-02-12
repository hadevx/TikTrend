import Layout from "../../Layout";
import { useGetOrderQuery } from "../../redux/queries/orderApi";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CreditCard,
  Mail,
  CheckCircle2,
  XCircle,
  Download,
  Receipt,
  Timer,
} from "lucide-react";
import { usePDF } from "react-to-pdf";
import Invoice from "../../components/Invoise";
import { Copy } from "@medusajs/ui";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useMemo } from "react";

// ---------------------------
// Helpers
// ---------------------------
const formatKD = (n) => `${Number(n || 0).toFixed(3)} KD`;

const formatDate = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  return `${date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const SkeletonLine = ({ className }) => (
  <div className={clsx("animate-pulse rounded-lg bg-neutral-200/70", className)} />
);

const Pill = ({ icon: Icon, text, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-neutral-900 text-white",
    info: "bg-amber-500 text-white",
    success: "bg-emerald-600 text-white",
    danger: "bg-rose-600 text-white",
    warn: "bg-amber-500 text-white",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold",
        tones[tone] || tones.neutral,
      )}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {text}
    </span>
  );
};

const Card = ({ children, className }) => (
  <div
    className={clsx(
      "rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
      className,
    )}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3 p-5">
    <div className="min-w-0">
      <h2 className="text-base md:text-lg font-extrabold text-neutral-900 truncate">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
    </div>
    {right ? <div className="shrink-0">{right}</div> : null}
  </div>
);

const Divider = () => <div className="h-px w-full bg-neutral-200" />;

// ---------------------------
// Progress (Placed -> Processing -> Delivered)
// ---------------------------
const OrderProgress = ({ order }) => {
  const isCanceled = !!order?.isCanceled;
  const isDelivered = !!order?.isDelivered;

  const step = isCanceled ? 0 : isDelivered ? 2 : 1;
  const pct = step === 0 ? 0 : step === 1 ? 50 : 100;

  const steps = [
    { label: "Placed", icon: Package },
    { label: "Processing", icon: CreditCard },
    { label: "Delivered", icon: CheckCircle2 },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-500">Order progress</p>
          <h3 className="mt-1 text-lg md:text-xl font-extrabold text-neutral-900">
            Track your order at a glance
          </h3>
        </div>

        <div className="mt-5">
          <div className="relative">
            <div className="h-2 rounded-full bg-neutral-100 border border-neutral-200" />

            {!isCanceled && (
              <motion.div
                className="absolute left-0 top-0 h-2 rounded-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            )}

            <motion.div
              className="absolute -top-4"
              initial={{ left: "0%" }}
              animate={{ left: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{ transform: "translateX(-50%)" }}>
              <motion.div
                className={clsx(
                  "w-10 h-10 rounded-2xl border shadow-sm flex items-center justify-center",
                  isCanceled ? "bg-rose-50 border-rose-100" : "bg-white border-neutral-200",
                )}
                animate={isCanceled ? { rotate: 0 } : { y: [0, -2, 0] }}
                transition={
                  isCanceled
                    ? { duration: 0.2 }
                    : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                }>
                <Truck
                  className={clsx("w-5 h-5", isCanceled ? "text-rose-500" : "text-blue-600")}
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = !isCanceled && step >= i;
              const align = i === 0 ? "justify-start" : i === 2 ? "justify-end" : "justify-center";

              return (
                <div key={s.label} className={clsx("flex items-center gap-2", align)}>
                  <span
                    className={clsx(
                      "grid h-8 w-8 place-items-center rounded-2xl border",
                      active
                        ? "bg-neutral-950 text-white border-neutral-950"
                        : "bg-white text-neutral-500 border-neutral-200",
                    )}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={clsx(
                      "font-semibold",
                      active ? "text-neutral-900" : "text-neutral-500",
                    )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {isCanceled ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              This order has been canceled.
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

// ---------------------------
// Summary Card (reusable)
// ---------------------------
const SummaryCard = ({
  order,
  showDiscount,
  subtotalBeforeCoupon,
  subtotalAfterCoupon,
  totalAfterCoupon,
}) => {
  return (
    <Card>
      <CardHeader
        title="Summary"
        subtitle="Totals saved on your order."
        right={
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-white">
            <Receipt className="h-5 w-5" />
          </div>
        }
      />
      <Divider />

      <div className="p-5">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-extrabold text-neutral-900">
              {formatKD(subtotalBeforeCoupon)}
            </span>
          </div>

          {showDiscount && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-neutral-600">
                Coupon {order?.coupon?.code ? `(${order.coupon.code})` : ""}
              </span>
              <span className="font-extrabold text-rose-700">
                -{formatKD(order?.discountAmount)}
              </span>
            </div>
          )}

          {showDiscount && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-neutral-600">Subtotal after coupon</span>
              <span className="font-extrabold text-neutral-900">
                {formatKD(subtotalAfterCoupon)}
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <span className="text-neutral-600">Shipping</span>
            <span className="font-extrabold text-neutral-900">
              {formatKD(order?.shippingPrice || 0)}
            </span>
          </div>

          <div className="my-3 h-px w-full bg-neutral-200" />

          <div className="flex items-center justify-between">
            <span className="text-neutral-700 font-semibold">Total</span>
            <span className="text-lg font-extrabold text-neutral-900">
              {formatKD(totalAfterCoupon)}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-600">
          Need help with this order?{" "}
          <Link to="/contact" className="font-bold underline">
            Contact us
          </Link>{" "}
          and include your Order ID.
        </div>
      </div>
    </Card>
  );
};

// ---------------------------
// Main Page
// ---------------------------
const Order = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { orderId } = useParams();
  const { data: order, isLoading } = useGetOrderQuery(orderId);

  const hasCoupon = !!order?.coupon?.code;
  const hasDiscountAmount = Number(order?.discountAmount || 0) > 0;
  const showDiscount = hasCoupon && hasDiscountAmount;

  const totalQty = order?.orderItems?.reduce((sum, it) => sum + (Number(it?.qty) || 0), 0) || 0;

  const discountPerUnit =
    showDiscount && totalQty > 0 ? Number(order.discountAmount) / totalQty : 0;

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${order?.createdAt?.substring(0, 10) || "order"}.pdf`,
  });

  const subtotalBeforeCoupon = useMemo(() => {
    const v =
      order?.orderItems?.reduce(
        (total, item) => total + Number(item?.qty || 0) * Number(item?.price || 0),
        0,
      ) || 0;
    return Number(v.toFixed(3));
  }, [order]);

  const subtotalAfterCoupon = useMemo(() => {
    const v = subtotalBeforeCoupon - Number(order?.discountAmount || 0);
    return Number(Math.max(v, 0).toFixed(3));
  }, [subtotalBeforeCoupon, order]);

  const totalAfterCoupon = useMemo(() => {
    const v = subtotalAfterCoupon + Number(order?.shippingPrice || 0);
    return Number(Math.max(v, 0).toFixed(3));
  }, [subtotalAfterCoupon, order]);

  const statusPill = useMemo(() => {
    if (!order) return null;
    if (order.isCanceled) return { tone: "danger", icon: XCircle, text: "Canceled" };
    if (order.isDelivered) return { tone: "success", icon: CheckCircle2, text: "Delivered" };
    return { tone: "info", icon: Timer, text: "Processing" };
  }, [order]);

  return (
    <Layout>
      <div className="overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-24 md:pt-28 pb-16">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
                  Order details
                </h1>
                {statusPill ? (
                  <Pill icon={statusPill.icon} tone={statusPill.tone} text={statusPill.text} />
                ) : null}
              </div>

              <p className="mt-1 text-sm text-neutral-500">
                Thanks {userInfo?.name ? `, ${userInfo.name}` : ""}! Here’s your order.
              </p>

              {isLoading ? (
                <div className="mt-3 flex gap-2">
                  <SkeletonLine className="h-4 w-48" />
                  <SkeletonLine className="h-4 w-36" />
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1">
                    <Receipt className="h-4 w-4" />
                    Created:{" "}
                    <span className="font-semibold text-neutral-900">
                      {formatDate(order?.createdAt)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1">
                    <Package className="h-4 w-4" />
                    Items: <span className="font-semibold text-neutral-900">{totalQty}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toPDF()}
                disabled={!order}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                  order
                    ? "bg-neutral-950 text-white hover:opacity-95"
                    : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
                )}>
                <Download className="h-4 w-4" />
                Download invoice
              </button>

              <Link
                to="mailto:hn98q8@hotmail.com"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-neutral-900 hover:bg-neutral-50">
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </div>

          {/* ✅ Desktop: summary on the right. Mobile: summary at the bottom */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
            {/* LEFT */}
            <div className="space-y-6 min-w-0">
              <OrderProgress order={order} />

              {/* Items */}
              <Card>
                <CardHeader
                  title="Items"
                  subtitle={order?._id ? "Review what you purchased." : "Loading…"}
                  right={
                    order?._id ? (
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Order ID</div>
                        <div className="mt-1 inline-flex items-center gap-2">
                          <span className="text-sm font-extrabold text-neutral-900">
                            #{order?._id}
                          </span>
                          <Copy content={order?._id} />
                        </div>
                      </div>
                    ) : null
                  }
                />
                <Divider />

                <div className="p-5">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-neutral-200 p-4">
                          <div className="flex gap-3">
                            <SkeletonLine className="h-14 w-14 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                              <SkeletonLine className="h-4 w-2/3" />
                              <SkeletonLine className="h-3 w-1/3" />
                            </div>
                            <div className="w-24 space-y-2 text-right">
                              <SkeletonLine className="h-4 w-full" />
                              <SkeletonLine className="h-3 w-2/3 ml-auto" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden md:block">
                        <table className="w-full table-fixed">
                          <colgroup>
                            <col className="w-[44%]" />
                            <col className="w-[18%]" />
                            <col className="w-[8%]" />
                            {showDiscount ? <col className="w-[10%]" /> : null}
                            {showDiscount ? <col className="w-[10%]" /> : null}
                            <col className="w-[10%]" />
                          </colgroup>

                          <thead>
                            <tr className="text-xs font-extrabold text-neutral-500">
                              <th className="text-left pb-3">Product</th>
                              <th className="text-left pb-3">Variant</th>
                              <th className="text-center pb-3">Qty</th>
                              {showDiscount && <th className="text-right pb-3">Before</th>}
                              {showDiscount && <th className="text-right pb-3">Coupon</th>}
                              <th className="text-right pb-3">Total</th>
                            </tr>
                          </thead>

                          <tbody className="text-sm">
                            {order?.orderItems?.map((item) => {
                              const qty = Number(item?.qty) || 0;

                              const beforeCouponUnit = Number(item?.price) || 0;

                              const finalUnit = showDiscount
                                ? Math.max(beforeCouponUnit - discountPerUnit, 0)
                                : beforeCouponUnit;

                              const lineDiscount = showDiscount ? qty * discountPerUnit : 0;
                              const lineTotal = qty * finalUnit;

                              return (
                                <tr
                                  key={item._id}
                                  className="border-t border-neutral-200 align-top">
                                  <td className="py-4 pr-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img
                                        src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                                        alt={item.name}
                                        className="h-12 w-12 rounded-2xl border bg-neutral-50 object-cover"
                                      />
                                      <div className="min-w-0">
                                        <div className="truncate font-extrabold text-neutral-900">
                                          {item.name}
                                        </div>

                                        <div className="mt-1 text-xs text-neutral-500">
                                          Unit (after coupon):{" "}
                                          <span className="font-semibold text-neutral-900">
                                            {formatKD(finalUnit)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-4 pr-3 text-neutral-700">
                                    <div className="truncate">
                                      {item.variantColor || item.variantSize
                                        ? `${item.variantColor || "-"} / ${item.variantSize || "-"}`
                                        : "-"}
                                    </div>
                                  </td>

                                  <td className="py-4 text-center font-semibold text-neutral-900">
                                    {qty}
                                  </td>

                                  {showDiscount && (
                                    <td className="py-4 text-right text-neutral-500 line-through">
                                      {formatKD(beforeCouponUnit)}
                                    </td>
                                  )}

                                  {showDiscount && (
                                    <td className="py-4 text-right text-rose-700 font-semibold">
                                      -{formatKD(lineDiscount)}
                                    </td>
                                  )}

                                  <td className="py-4 text-right font-extrabold text-neutral-900">
                                    {formatKD(lineTotal)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="md:hidden space-y-3">
                        {order?.orderItems?.map((item) => {
                          const qty = Number(item?.qty) || 0;

                          const beforeCouponUnit = Number(item?.price) || 0;
                          const finalUnit = showDiscount
                            ? Math.max(beforeCouponUnit - discountPerUnit, 0)
                            : beforeCouponUnit;

                          const lineDiscount = showDiscount ? qty * discountPerUnit : 0;
                          const lineTotal = qty * finalUnit;

                          return (
                            <div
                              key={item._id}
                              className="rounded-2xl border border-neutral-200 bg-white p-4">
                              <div className="flex items-start gap-3">
                                <img
                                  src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                                  alt={item.name}
                                  className="h-14 w-14 rounded-2xl border bg-neutral-50 object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="truncate text-sm font-extrabold text-neutral-900">
                                        {item.name}
                                      </div>
                                      <div className="mt-1 text-xs text-neutral-500 truncate">
                                        {item.variantColor || item.variantSize
                                          ? `${item.variantColor || "-"} / ${item.variantSize || "-"}`
                                          : "No variant"}
                                      </div>
                                      <div className="mt-2 text-xs text-neutral-500">
                                        Unit (after coupon):{" "}
                                        <span className="font-semibold text-neutral-900">
                                          {formatKD(finalUnit)}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                      <div className="text-xs text-neutral-500">
                                        Qty{" "}
                                        <span className="font-semibold text-neutral-900">
                                          {qty}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-sm font-extrabold text-neutral-900">
                                        {formatKD(lineTotal)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                    {showDiscount && (
                                      <div className="rounded-2xl bg-neutral-50 p-3">
                                        <div className="text-[11px] font-semibold text-neutral-500">
                                          Before
                                        </div>
                                        <div className="mt-1 text-sm font-extrabold text-neutral-900 line-through">
                                          {formatKD(beforeCouponUnit)}
                                        </div>
                                      </div>
                                    )}

                                    {showDiscount && (
                                      <div className="rounded-2xl bg-rose-50 p-3">
                                        <div className="text-[11px] font-semibold text-rose-600">
                                          Coupon
                                        </div>
                                        <div className="mt-1 text-sm font-extrabold text-rose-700">
                                          -{formatKD(lineDiscount)}
                                        </div>
                                      </div>
                                    )}

                                    <div className="rounded-2xl bg-neutral-50 p-3">
                                      <div className="text-[11px] font-semibold text-neutral-500">
                                        Total
                                      </div>
                                      <div className="mt-1 text-sm font-extrabold text-neutral-900">
                                        {formatKD(lineTotal)}
                                      </div>
                                    </div>
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
              </Card>

              {/* ✅ Mobile summary at the bottom */}
              <div className="lg:hidden">
                <SummaryCard
                  order={order}
                  showDiscount={showDiscount}
                  subtotalBeforeCoupon={subtotalBeforeCoupon}
                  subtotalAfterCoupon={subtotalAfterCoupon}
                  totalAfterCoupon={totalAfterCoupon}
                />
              </div>
            </div>

            {/* ✅ Desktop summary on the right */}
            <div className="hidden lg:block lg:sticky lg:top-24 min-w-0 space-y-6">
              <SummaryCard
                order={order}
                showDiscount={showDiscount}
                subtotalBeforeCoupon={subtotalBeforeCoupon}
                subtotalAfterCoupon={subtotalAfterCoupon}
                totalAfterCoupon={totalAfterCoupon}
              />
            </div>
          </div>

          {/* Hidden invoice template for PDF generation */}
          <div
            ref={targetRef}
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              height: "auto",
              width: "auto",
            }}>
            <Invoice order={order} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;
