// Invoice.js
import React, { useMemo } from "react";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

const formatKD = (n) => `${Number(n || 0).toFixed(3)} KD`;

const safe = (v, fallback = "—") => {
  const s = String(v ?? "").trim();
  return s ? s : fallback;
};

const Cell = ({ label, value }) => (
  <div className="min-w-0 rounded-2xl border border-neutral-200 px-4 py-3">
    <div className="text-[11px] font-extrabold tracking-wide text-neutral-500">{label}</div>
    <div className="mt-1 truncate text-sm font-semibold text-neutral-900">{safe(value)}</div>
  </div>
);

const Invoice = ({ order }) => {
  const { data: store } = useGetStoreStatusQuery();
  const storeInfo = store?.[0];

  const rows = useMemo(() => (Array.isArray(order?.orderItems) ? order.orderItems : []), [order]);

  const created = useMemo(() => {
    if (!order?.createdAt) return "—";
    const d = new Date(order.createdAt);
    if (Number.isNaN(d.getTime())) return String(order.createdAt).substring(0, 10);
    return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
  }, [order?.createdAt]);

  const subtotal = useMemo(() => {
    const v = rows.reduce(
      (total, item) => total + Number(item?.qty || 0) * Number(item?.price || 0),
      0,
    );
    return Number(v.toFixed(3));
  }, [rows]);

  const shipping = Number(order?.shippingPrice || 0);
  const discount = Number(order?.discountAmount || 0);

  const total = useMemo(() => {
    if (order?.totalPrice != null) return Number(order.totalPrice || 0);
    return Math.max(subtotal - discount + shipping, 0);
  }, [order?.totalPrice, subtotal, discount, shipping]);

  const getVariantLabel = (item) => {
    const color =
      item?.variantColor || item?.color || item?.variant?.color || item?.selectedColor || "";
    const size = item?.variantSize || item?.size || item?.variant?.size || item?.selectedSize || "";
    if (color && size) return `${color} / ${size}`;
    if (color) return color;
    if (size) return size;
    return "—";
  };

  const address = order?.shippingAddress || {};
  const customer = order?.user || {};

  return (
    <div className="bg-white text-neutral-900">
      <div className="p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight leading-none">INVOICE</h1>
            <p className="mt-2 text-sm font-semibold text-neutral-900 truncate">
              {safe(storeInfo?.storeName, "Store")}
            </p>
            {(storeInfo?.email || storeInfo?.phoneNumber) && (
              <p className="mt-1 text-xs text-neutral-500 truncate">
                {storeInfo?.email ? storeInfo.email : ""}
                {storeInfo?.email && storeInfo?.phoneNumber ? " • " : ""}
                {storeInfo?.phoneNumber ? storeInfo.phoneNumber : ""}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[11px] font-extrabold tracking-wide text-neutral-500">DATE</div>
            <div className="mt-1 text-sm font-semibold text-neutral-900">{created}</div>
          </div>
        </div>

        <div className="my-6 h-px bg-neutral-200" />

        {/* Bill To + Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div className="rounded-3xl border border-neutral-200 p-5">
            <p className="text-[11px] font-extrabold tracking-wide text-neutral-500">BILL TO</p>
            <p className="mt-2 text-lg font-extrabold text-neutral-950 truncate">
              {safe(customer?.name)}
            </p>
            <p className="text-sm text-neutral-700 truncate">{safe(customer?.email)}</p>
            <p className="text-sm text-neutral-700 truncate">{safe(customer?.phone)}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Cell label="Email" value={customer?.email} />
              <Cell label="Phone" value={customer?.phone} />
            </div>
          </div>

          {/* Address */}
          <div className="rounded-3xl border border-neutral-200 p-5">
            <p className="text-[11px] font-extrabold tracking-wide text-neutral-500">
              SHIPPING ADDRESS
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Cell label="Governorate" value={address?.governorate} />
              <Cell label="City" value={address?.city} />
              <Cell label="Block" value={address?.block} />
              <Cell label="Street" value={address?.street} />
              <div className="sm:col-span-2">
                <Cell label="House" value={address?.house} />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6 rounded-3xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-200">
            <p className="text-[11px] font-extrabold tracking-wide text-neutral-500">ITEMS</p>
            <p className="mt-1 text-base font-extrabold text-neutral-950">
              {rows.length} item{rows.length === 1 ? "" : "s"}
            </p>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 text-[11px] font-extrabold tracking-wide text-neutral-500">
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Variant</th>
                <th className="text-right px-5 py-3">Qty</th>
                <th className="text-right px-5 py-3">Unit</th>
                <th className="text-right px-5 py-3">Line total</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {rows.map((item) => {
                const qty = Number(item?.qty || 0);
                const price = Number(item?.price || 0);
                const lineTotal = qty * price;

                return (
                  <tr
                    key={item?._id || `${item?.name}-${qty}-${price}`}
                    className="border-b border-neutral-200">
                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <div className="font-extrabold text-neutral-950 truncate">
                          {safe(item?.name)}
                        </div>
                        {item?.sku || item?.productId ? (
                          <div className="mt-1 text-xs text-neutral-500">
                            {item?.sku ? `SKU: ${item.sku}` : null}
                            {item?.sku && item?.productId ? " • " : null}
                            {item?.productId ? `ID: ${item.productId}` : null}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-neutral-700">{getVariantLabel(item)}</td>

                    <td className="px-5 py-4 text-right font-semibold text-neutral-900">{qty}</td>

                    <td className="px-5 py-4 text-right text-neutral-700">{formatKD(price)}</td>

                    <td className="px-5 py-4 text-right font-extrabold text-neutral-900">
                      {formatKD(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 rounded-3xl border border-neutral-200 p-5">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-extrabold text-neutral-900">{formatKD(subtotal)}</span>
            </div>

            {discount > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">
                  Discount{order?.coupon?.code ? ` (${order.coupon.code})` : ""}
                </span>
                <span className="font-extrabold text-rose-700">-{formatKD(discount)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Shipping fees</span>
              <span className="font-extrabold text-neutral-900">{formatKD(shipping)}</span>
            </div>
          </div>

          <div className="my-4 h-px bg-neutral-200" />

          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-neutral-800">Total</span>
            <span className="text-xl font-extrabold text-neutral-950">{formatKD(total)}</span>
          </div>
        </div>

        <div className="mt-8 text-xs text-center text-neutral-500">
          Thank you for your business ♥
        </div>
      </div>
    </div>
  );
};

export default Invoice;
