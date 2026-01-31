import { useMemo, useState } from "react";
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
} from "../../redux/queries/userApi";
import { useGetMyOrdersQuery } from "../../redux/queries/orderApi.js";
import AddressModal from "../address/AddressModal.jsx";
import { provinces } from "../../assets/data/addresses.js";
import UserLevel from "../../components/Level.jsx";
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
  RefreshCcw,
} from "lucide-react";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: userAddress, refetch } = useGetAddressQuery(userInfo?._id);
  const { data: myorders } = useGetMyOrdersQuery();

  const level = myorders?.length || 1;

  const [updateUser] = useUpdateUserMutation();
  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();
  const [logoutApiCall, { isLoading: loadingLogout }] = useLogoutMutation();

  // UI state
  const [tab, setTab] = useState("overview"); // overview | orders | address | account
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  // Inputs
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [newBlock, setNewBlock] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newHouse, setNewHouse] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const list = Array.isArray(myorders) ? myorders : [];
    const delivered = list.filter((o) => o?.isDelivered).length;
    const canceled = list.filter((o) => o?.isCanceled).length;
    const processing = Math.max(0, list.length - delivered - canceled);
    return { total: list.length, delivered, canceled, processing };
  }, [myorders]);

  // logout
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (e) {
      toast.error("Logout failed", { position: "top-center" });
    }
  };

  // update user info
  const handleUpdatePersonal = async () => {
    try {
      if (newPhone && newPhone.length !== 8) {
        toast.error("Please enter a valid phone number");
        return;
      }
      const res = await updateUser({
        name: newName || userInfo?.name,
        email: newEmail || userInfo?.email,
        phone: newPhone || userInfo?.phone,
      }).unwrap();

      dispatch(setUserInfo(res));
      toast.success("Updated successfully", { position: "top-center" });
      setEditPersonal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // update address
  const handleUpdateAddress = async () => {
    try {
      await updateAddress({
        governorate: selectedProvince,
        city,
        block: newBlock,
        street: newStreet,
        house: newHouse,
      }).unwrap?.();

      refetch();
      setEditAddress(false);
      toast.success("Updated address", { position: "top-center" });
    } catch (e) {
      toast.error("Failed to update address", { position: "top-center" });
    }
  };

  // provinces → cities
  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const province = provinces.find((p) => p.name === provinceName);
    setCities(province ? province.cities : []);
    setCity("");
  };

  const handleCityChange = (e) => setCity(e.target.value);

  const OrderStatusPill = ({ order }) => {
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
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
          cfg.cls,
        )}>
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </span>
    );
  };

  const Card = ({ title, icon: Icon, action, children }) => (
    <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-neutral-800" /> : null}
          <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        </div>
        {action}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );

  return (
    <Layout>
      <div className="relative overflow-x-hidden bg-gray-100">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
          <div className="absolute -right-24 top-80 h-64 w-64 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <motion.div
          transition={{ duration: 0.6 }}
          className="min-h-screen max-w-6xl   lg:mx-auto mt-[70px] lg:mt-[110px] px-3 pb-16">
          {/* Top bar */}
          <div className="flex items-center justify-between">
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

          {/* Header */}
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-neutral-900 text-white grid place-items-center font-bold text-lg">
                  {String(userInfo?.name || "U")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-xl md:text-2xl font-semibold tracking-tight text-neutral-950">
                    {userInfo?.name}
                  </h1>
                  <p className="text-sm text-neutral-600 truncate">{userInfo?.email}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {userInfo?.phone ? `+965 ${userInfo.phone}` : "Add your phone number"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500">Total orders</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.total}</div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500">Processing</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">
                  {stats.processing}
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500">Delivered</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.delivered}</div>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="text-xs text-neutral-500">Canceled</div>
                <div className="mt-1 text-lg font-semibold text-neutral-950">{stats.canceled}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 grid lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-5 space-y-6">
              {(tab === "overview" || tab === "account") && (
                <Card
                  title="Personal information"
                  icon={UserIcon}
                  action={
                    !editPersonal ? (
                      <button
                        type="button"
                        onClick={() => setEditPersonal(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    ) : null
                  }>
                  {!editPersonal ? (
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                        <UserIcon className="h-4 w-4 text-neutral-600" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">Name</div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                        <Mail className="h-4 w-4 text-neutral-600" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">Email</div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                        <Phone className="h-4 w-4 text-neutral-600" />
                        <div className="min-w-0">
                          <div className="text-xs text-neutral-500">Phone</div>
                          <div className="truncate font-medium text-neutral-900">
                            {userInfo?.phone ? `+965 ${userInfo.phone}` : "Not set"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={userInfo?.name}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={userInfo?.email}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                      <input
                        type="number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder={userInfo?.phone || "Phone (8 digits)"}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleUpdatePersonal}
                          className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditPersonal(false)}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {(tab === "overview" || tab === "address") && (
                <Card
                  title="Shipping address"
                  icon={MapPin}
                  action={
                    userAddress && !editAddress ? (
                      <button
                        type="button"
                        onClick={() => setEditAddress(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    ) : null
                  }>
                  {!userAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                      + Add your address
                    </button>
                  ) : !editAddress ? (
                    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Governorate</span>
                        <span className="font-medium text-neutral-900">
                          {userAddress?.governorate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">City</span>
                        <span className="font-medium text-neutral-900">{userAddress?.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">Street</span>
                        <span className="font-medium text-neutral-900">{userAddress?.street}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">House</span>
                        <span className="font-medium text-neutral-900">{userAddress?.house}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <select
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="">Choose governorate</option>
                        {provinces.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={city}
                        onChange={handleCityChange}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="">Choose city</option>
                        {cities.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={newBlock}
                          onChange={(e) => setNewBlock(e.target.value)}
                          placeholder="Block"
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                        <input
                          value={newHouse}
                          onChange={(e) => setNewHouse(e.target.value)}
                          placeholder="House"
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                      </div>

                      <input
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Street"
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleUpdateAddress}
                          disabled={loadingAddress}
                          className="rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition disabled:opacity-60">
                          {loadingAddress ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditAddress(false)}
                          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Right column */}
            <div className="lg:col-span-7">
              {(tab === "overview" || tab === "orders") && (
                <Card
                  title={`My orders (${stats.total})`}
                  icon={Package}
                  action={
                    stats.total > 0 ? (
                      <button
                        type="button"
                        onClick={() => setTab("orders")}
                        className="inline-flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        View all <ChevronRight className="h-4 w-4" />
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
                    <div className="space-y-3">
                      {(Array.isArray(myorders) ? myorders : [])
                        .slice(0, tab === "orders" ? 50 : 6)
                        .map((order) => (
                          <div
                            key={order._id}
                            className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 hover:bg-neutral-50 transition">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-neutral-900">
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

                            <div className="mt-3 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  toast.info("Order details screen not connected yet", {
                                    position: "top-center",
                                  })
                                }
                                className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
                                View details <ChevronRight className="h-4 w-4" />
                              </button>

                              <span className="text-xs text-neutral-500">
                                {order?.isDelivered
                                  ? "Delivered"
                                  : order?.isCanceled
                                    ? "Canceled"
                                    : "In progress"}
                              </span>
                            </div>
                          </div>
                        ))}

                      {tab !== "orders" && stats.total > 6 && (
                        <button
                          type="button"
                          onClick={() => setTab("orders")}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                          View all orders
                        </button>
                      )}
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>

          <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </motion.div>
      </div>
    </Layout>
  );
}

export default Profile;
