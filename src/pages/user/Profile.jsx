import { useMemo, useState, useEffect, memo } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUserInfo } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import {
  useUpdateUserMutation,
  useUpdateAddressMutation,
  useLogoutMutation,
  useGetAddressQuery,
  useGetUserDetailsQuery,
} from "../../redux/queries/userApi";
import { useGetMyOrdersQuery } from "../../redux/queries/orderApi.js";
import AddressModal from "../../components/AddressModal.jsx";
import { provinces } from "../../assets/data/addresses.js";
import clsx from "clsx";
import {
  ArrowLeft,
  LogOut,
  Pencil,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  Package,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronRight,
  Ban,
  Crown,
} from "lucide-react";

/* ----------------------------- Small UI blocks ---------------------------- */

const Card = memo(function Card({ title, icon: Icon, action, children }) {
  return (
    <div className="w-full min-w-0 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-2 min-w-0">
          {Icon ? <Icon className="h-4 w-4 text-neutral-800 shrink-0" /> : null}
          <h2 className="text-sm font-semibold text-neutral-900 truncate">{title}</h2>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      <div className="px-5 pb-5 min-w-0">{children}</div>
    </div>
  );
});

const InfoRow = memo(function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 min-w-0">
      {Icon ? <Icon className="h-4 w-4 text-neutral-600 shrink-0" /> : null}
      <div className="min-w-0">
        <div className="text-xs text-neutral-500">{label}</div>
        <div className="truncate font-medium text-neutral-900">{value || "—"}</div>
      </div>
    </div>
  );
});

const StatTile = memo(function StatTile({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <div className="text-xs text-neutral-500 truncate">{label}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-950">{value}</div>
    </div>
  );
});

const OrderStatusPill = memo(function OrderStatusPill({ order }) {
  const delivered = order?.isDelivered;
  const canceled = order?.isCanceled;

  const cfg = delivered
    ? {
        label: "Delivered",
        icon: CheckCircle2,
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }
    : canceled
      ? { label: "Canceled", icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200" }
      : { label: "Processing", icon: Clock3, cls: "bg-amber-50 text-amber-700 border-amber-200" };

  const Icon = cfg.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        cfg.cls,
      )}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
});

const TextInput = memo(function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <label className="block min-w-0">
      <span className="text-xs text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                   focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
      />
    </label>
  );
});

const PhoneInput = memo(function PhoneInput({ label, value, onChange, placeholder, disabled }) {
  return (
    <label className="block min-w-0">
      <span className="text-xs text-neutral-500">{label}</span>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                   focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60"
      />
    </label>
  );
});

const SelectInput = memo(function SelectInput({ label, value, onChange, children, disabled }) {
  return (
    <label className="block min-w-0">
      <span className="text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none
                   focus:ring-2 focus:ring-neutral-900/10 disabled:opacity-60">
        {children}
      </select>
    </label>
  );
});

const ActionButton = memo(function ActionButton({
  children,
  onClick,
  disabled,
  variant = "solid",
}) {
  const base = "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60";
  const solid = "bg-neutral-950 text-white hover:bg-neutral-900";
  const outline = "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variant === "solid" ? solid : outline)}>
      {children}
    </button>
  );
});

const VipBadge = memo(function VipBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
      <Crown className="h-3.5 w-3.5" />
      VIP
    </span>
  );
});

/* -------------------------------- Avatar --------------------------------- */
const VipAvatar = memo(function VipAvatar({ initials }) {
  return (
    <div className="relative shrink-0">
      <div className="relative size-16 rounded-2xl bg-neutral-900 text-white grid place-items-center font-bold text-2xl border border-white/30 ring-4 ring-neutral-900/10 shadow-sm overflow-hidden">
        {initials}
      </div>
    </div>
  );
});

/* --------------------------------- Profile -------------------------------- */

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id;

  const { data: me } = useGetUserDetailsQuery(userId, { skip: !userId });

  const isBlocked = Boolean(me?.isBlocked ?? userInfo?.isBlocked);
  const isVIP = Boolean(me?.isVIP ?? userInfo?.isVIP);

  const { data: userAddress, refetch: refetchAddress } = useGetAddressQuery(userId, {
    skip: !userId,
  });
  const { data: myorders } = useGetMyOrdersQuery(undefined, { skip: !userId });

  const [updateUser, { isLoading: loadingUpdateUser }] = useUpdateUserMutation();
  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();
  const [logoutApiCall, { isLoading: loadingLogout }] = useLogoutMutation();

  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [personalForm, setPersonalForm] = useState({ name: "", email: "", phone: "" });
  const [addressForm, setAddressForm] = useState({
    governorate: "",
    city: "",
    block: "",
    street: "",
    house: "",
  });

  const [cities, setCities] = useState([]);

  // ✅ Show more orders
  const ORDERS_STEP = 5;
  const [visibleOrders, setVisibleOrders] = useState(ORDERS_STEP);

  const ordersList = useMemo(() => {
    return Array.isArray(myorders) ? myorders : [];
  }, [myorders]);

  const visibleOrdersList = useMemo(() => {
    return ordersList.slice(0, visibleOrders);
  }, [ordersList, visibleOrders]);

  const canShowMore = visibleOrders < ordersList.length;

  const stats = useMemo(() => {
    const list = ordersList;
    const delivered = list.filter((o) => o?.isDelivered).length;
    const canceled = list.filter((o) => o?.isCanceled).length;
    const processing = Math.max(0, list.length - delivered - canceled);
    return { total: list.length, delivered, canceled, processing };
  }, [ordersList]);

  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = prev;
    };
  }, []);

  useEffect(() => {
    if (editPersonal) {
      setPersonalForm({
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPersonal]);

  useEffect(() => {
    if (editAddress) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAddress]);

  useEffect(() => {
    if (isBlocked) {
      setEditPersonal(false);
      setEditAddress(false);
      setIsModalOpen(false);
    }
  }, [isBlocked]);

  // ✅ Reset visible orders when list changes (or user logs in/out)
  useEffect(() => {
    setVisibleOrders(ORDERS_STEP);
  }, [ordersList.length, userId]);

  const initials = useMemo(() => {
    const name = String(userInfo?.name || "").trim();
    const first = (name.charAt(0) || "W").toUpperCase();
    const last = (name.charAt(name.length - 1) || "S").toUpperCase();
    return `${first}${last}`;
  }, [userInfo?.name]);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch {
      toast.error("Logout failed", { position: "top-center" });
    }
  };

  const savePersonal = async () => {
    try {
      if (isBlocked) {
        toast.error("Your account is blocked.", { position: "top-center" });
        return;
      }

      const phone = String(personalForm.phone || "").trim();
      if (phone && phone.length !== 8) {
        toast.error("Please enter a valid phone number");
        return;
      }

      const res = await updateUser({
        name: personalForm.name || userInfo?.name,
        email: personalForm.email || userInfo?.email,
        phone: phone || userInfo?.phone,
      }).unwrap();

      dispatch(setUserInfo(res));
      toast.success("Updated successfully", { position: "top-center" });
      setEditPersonal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const saveAddress = async () => {
    try {
      if (isBlocked) {
        toast.error("Your account is blocked.", { position: "top-center" });
        return;
      }

      await updateAddress({
        governorate: addressForm.governorate,
        city: addressForm.city,
        block: addressForm.block,
        street: addressForm.street,
        house: addressForm.house,
      }).unwrap();

      refetchAddress();
      setEditAddress(false);
      toast.success("Updated address", { position: "top-center" });
    } catch {
      toast.error("Failed to update address", { position: "top-center" });
    }
  };

  const onProvinceChange = (e) => {
    const governorate = e.target.value;
    const province = provinces.find((p) => p.name === governorate);
    setCities(province ? province.cities : []);
    setAddressForm((prev) => ({ ...prev, governorate, city: "" }));
  };

  return (
    <Layout>
      <div className="relative overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
          <div className="absolute -right-24 top-80 h-64 w-64 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <motion.div
          transition={{ duration: 0.6 }}
          className="min-h-screen mx-auto w-full max-w-6xl mt-[70px] lg:mt-[110px] px-3 pb-16">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 transition">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loadingLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 active:scale-[0.99] transition">
              {loadingLogout ? (
                <Spinner className="border-t-transparent" />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </button>
          </div>

          <div className="mt-6 w-full min-w-0 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between min-w-0">
              <div className="flex items-center gap-4 min-w-0">
                <VipAvatar initials={initials} />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="truncate text-xl md:text-2xl font-semibold tracking-tight text-neutral-950">
                      {userInfo?.name}
                    </h1>
                    {isVIP ? <VipBadge /> : null}
                  </div>

                  <p className="text-sm text-neutral-600 truncate">{userInfo?.email}</p>
                  <p className="text-xs text-neutral-500 mt-1 truncate">
                    {userInfo?.phone ? `+965 ${userInfo.phone}` : "Add your phone number"}
                  </p>
                </div>
              </div>
            </div>

            {isBlocked && (
              <div className="mt-5 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Ban className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-rose-800">Your account is blocked</p>
                    <p className="mt-1 text-sm text-rose-700">
                      You can view your profile, but updates and orders are disabled. Contact
                      support if you believe this is a mistake.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Total orders" value={stats.total} />
              <StatTile label="Processing" value={stats.processing} />
              <StatTile label="Delivered" value={stats.delivered} />
              <StatTile label="Canceled" value={stats.canceled} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2 min-w-0">
            <Card
              title="Personal information"
              icon={UserIcon}
              action={
                !editPersonal ? (
                  <button
                    type="button"
                    onClick={() => setEditPersonal(true)}
                    disabled={isBlocked}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition",
                      isBlocked && "opacity-60 cursor-not-allowed",
                    )}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                ) : null
              }>
              {!editPersonal ? (
                <div className="grid gap-3 text-sm min-w-0">
                  <InfoRow icon={UserIcon} label="Name" value={userInfo?.name} />
                  <InfoRow icon={Mail} label="Email" value={userInfo?.email} />
                  <InfoRow
                    icon={Phone}
                    label="Phone"
                    value={userInfo?.phone ? `+965 ${userInfo.phone}` : "Not set"}
                  />
                </div>
              ) : (
                <div className="space-y-3 min-w-0">
                  <TextInput
                    label="Name"
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    disabled={isBlocked}
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    disabled={isBlocked}
                  />
                  <PhoneInput
                    label="Phone"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="8 digits"
                    disabled={isBlocked}
                  />

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <ActionButton
                      onClick={savePersonal}
                      disabled={isBlocked || loadingUpdateUser}
                      variant="solid">
                      {loadingUpdateUser ? "Saving..." : "Save"}
                    </ActionButton>
                    <ActionButton onClick={() => setEditPersonal(false)} variant="outline">
                      Cancel
                    </ActionButton>
                  </div>
                </div>
              )}
            </Card>

            <Card
              title="Shipping address"
              icon={MapPin}
              action={
                userAddress && !editAddress ? (
                  <button
                    type="button"
                    onClick={() => setEditAddress(true)}
                    disabled={isBlocked}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition",
                      isBlocked && "opacity-60 cursor-not-allowed",
                    )}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                ) : null
              }>
              {!userAddress ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  disabled={isBlocked}
                  className={clsx(
                    "w-full rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition",
                    isBlocked && "opacity-60 cursor-not-allowed",
                  )}>
                  + Add your address
                </button>
              ) : !editAddress ? (
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700 space-y-2 min-w-0">
                  {[
                    ["Governorate", userAddress?.governorate],
                    ["City", userAddress?.city],
                    ["Block", userAddress?.block],
                    ["Street", userAddress?.street],
                    ["House", userAddress?.house],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 min-w-0">
                      <span className="text-xs text-neutral-500">{k}</span>
                      <span className="font-medium text-neutral-900 truncate">{v || "-"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 min-w-0">
                  <SelectInput
                    label="Governorate"
                    value={addressForm.governorate}
                    onChange={onProvinceChange}
                    disabled={isBlocked}>
                    <option value="">Choose governorate</option>
                    {provinces.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((a) => ({ ...a, city: e.target.value }))}
                    disabled={isBlocked || !addressForm.governorate}>
                    <option value="">Choose city</option>
                    {cities.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectInput>

                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Block"
                      value={addressForm.block}
                      onChange={(e) => setAddressForm((a) => ({ ...a, block: e.target.value }))}
                      placeholder="Block"
                      disabled={isBlocked}
                    />
                    <TextInput
                      label="House"
                      value={addressForm.house}
                      onChange={(e) => setAddressForm((a) => ({ ...a, house: e.target.value }))}
                      placeholder="House"
                      disabled={isBlocked}
                    />
                  </div>

                  <TextInput
                    label="Street"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm((a) => ({ ...a, street: e.target.value }))}
                    placeholder="Street"
                    disabled={isBlocked}
                  />

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <ActionButton
                      onClick={saveAddress}
                      disabled={isBlocked || loadingAddress}
                      variant="solid">
                      {loadingAddress ? "Saving..." : "Save"}
                    </ActionButton>
                    <ActionButton onClick={() => setEditAddress(false)} variant="outline">
                      Cancel
                    </ActionButton>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* ✅ Orders: show 5 then Show more */}
          <div className="mt-6">
            <Card
              title={`My orders (${stats.total})`}
              icon={Package}
              action={
                canShowMore ? (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleOrders((v) => Math.min(v + ORDERS_STEP, ordersList.length))
                    }
                    className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                    Show more
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null
              }>
              {stats.total === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-10 text-center">
                  <p className="font-semibold text-neutral-900">No orders yet</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Once you place an order, it will show up here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                    Start shopping
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 min-w-0">
                  {visibleOrdersList.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 hover:bg-neutral-50 transition min-w-0">
                      <div className="flex items-start justify-between gap-3 min-w-0">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            Order #{String(order?._id).slice(-6).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {order?.createdAt?.substring(0, 10)} • Total{" "}
                            <span className="font-semibold text-neutral-900">
                              {order?.totalPrice?.toFixed(3)} KD
                            </span>
                          </p>
                        </div>
                        <OrderStatusPill order={order} />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/order/${order?._id}`, { state: { order } })}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
                          View details <ChevronRight className="h-4 w-4" />
                        </button>

                        <span className="text-xs text-neutral-500 whitespace-nowrap">
                          {order?.isDelivered
                            ? "Delivered"
                            : order?.isCanceled
                              ? "Canceled"
                              : "In progress"}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* ✅ bottom button too (nice on mobile) */}
                  {canShowMore ? (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleOrders((v) => Math.min(v + ORDERS_STEP, ordersList.length))
                      }
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                      Show more ({Math.min(ORDERS_STEP, ordersList.length - visibleOrders)} more)
                    </button>
                  ) : null}
                </div>
              )}
            </Card>
          </div>

          <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.div>
      </div>
    </Layout>
  );
}

export default Profile;
