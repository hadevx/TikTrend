import { useState } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
import one from "../../assets/levels/one.png";
import { provinces } from "../../assets/data/addresses.js";
// import Level from "../../components/Level.jsx";
import UserLevel from "../../components/Level.jsx";

function Profile() {
  const [clickEditPersonal, setClickEditPersonal] = useState(false);
  const [clickEditAddress, setClickEditAddress] = useState(false);
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

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: userAddress, refetch } = useGetAddressQuery(userInfo?._id);
  const { data: myorders } = useGetMyOrdersQuery();

  const level = myorders?.length || 10;

  const [updateUser] = useUpdateUserMutation();
  const [updateAddress, { isLoading: loadingAddress }] = useUpdateAddressMutation();
  const [logoutApiCall, { isLoading }] = useLogoutMutation();

  // logout
  const handleLogout = async () => {
    await logoutApiCall().unwrap();
    dispatch(logout());
    navigate("/");
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
      setClickEditPersonal(false);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // update address
  const handleUpdateAddress = async () => {
    await updateAddress({
      governorate: selectedProvince,
      city,
      block: newBlock,
      street: newStreet,
      house: newHouse,
    });
    refetch();
    setClickEditAddress(false);
    toast.success("Updated address", { position: "top-center" });
  };

  // provinces → cities
  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    setSelectedProvince(provinceName);
    const province = provinces.find((p) => p.name === provinceName);
    setCities(province ? province.cities : []);
  };

  const handleCityChange = (e) => setCity(e.target.value);

  return (
    <Layout>
      <motion.div
        transition={{ duration: 0.6 }}
        className="min-h-screen flex  flex-col items-center bg-gradient-to-b from-rose-50 to-zinc-100">
        {/* Header */}
        <div className="w-full relative  flex flex-col items-center p-6 bg-gradient-to-tr from-zinc-700 to-zinc-900  shadow-lg">
          <div className="absolute left-5 top-5 p-1 shadow-[0_5px_10px_rgba(255,255,255,0.5)] hover:bg-zinc-100 cursor-pointer bg-zinc-50 rounded-md ">
            <ChevronLeft className="text-black" onClick={() => navigate(-1)} />
          </div>

          {/* Avatar */}
          {/*  <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden ">
              <img src={one} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-2 -right-2 ">
              <Level level={myorders?.length || 1} />
            </span>
          </div> */}
          <UserLevel level={level} />

          <h1 className="mt-4 text-2xl font-extrabold text-white">{userInfo?.name}</h1>
          <p className="text-sm text-rose-100">{userInfo?.email}</p>

          <div className="flex gap-5 mt-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="bg-white  text-black px-4 py-2 rounded-full shadow-[0_5px_10px_rgba(255,255,255,0.5)] font-bold text-sm">
              {isLoading ? <Spinner className="border-t-transparent" /> : "Log out"}
            </button>
            <button
              onClick={() => setClickEditPersonal(true)}
              className="bg-white text-black px-4 py-2 rounded-full shadow-[0_5px_10px_rgba(255,255,255,0.5)] font-bold text-sm">
              Edit
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="w-full px-2 mt-6  flex flex-col gap-2">
          {/* Personal */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-3">Personal Info</h2>
            {!clickEditPersonal ? (
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Name:</span> {userInfo?.name}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {userInfo?.phone}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={userInfo?.name}
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={userInfo?.email}
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <input
                  type="number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder={userInfo?.phone}
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdatePersonal}
                    className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-bold">
                    Update
                  </button>
                  <button
                    onClick={() => setClickEditPersonal(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-3">Address</h2>
            {!clickEditAddress ? (
              userAddress ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Governorate:</span> {userAddress?.governorate}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span> {userAddress?.city}
                  </p>
                  <p>
                    <span className="font-semibold">Street:</span> {userAddress?.street}
                  </p>
                  <p>
                    <span className="font-semibold">House:</span> {userAddress?.house}
                  </p>
                  <button
                    onClick={() => setClickEditAddress(true)}
                    className="text-rose-600 text-sm font-semibold mt-2">
                    Edit Address
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-rose-600 font-semibold">
                  + Add your address
                </button>
              )
            ) : (
              <div className="flex flex-col gap-3">
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="px-3 py-2 rounded-lg border bg-gray-50">
                  <option value="">Choose province</option>
                  {provinces.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={city}
                  onChange={handleCityChange}
                  className="px-3 py-2 rounded-lg border bg-gray-50">
                  <option value="">Choose city</option>
                  {cities.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={newBlock}
                  onChange={(e) => setNewBlock(e.target.value)}
                  placeholder="Block"
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <input
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Street"
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <input
                  value={newHouse}
                  onChange={(e) => setNewHouse(e.target.value)}
                  placeholder="House"
                  className="px-3 py-2 rounded-lg border bg-gray-50"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateAddress}
                    disabled={loadingAddress}
                    className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-bold">
                    {loadingAddress ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => setClickEditAddress(false)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-3">My Orders ({myorders?.length})</h2>
            {myorders?.length === 0 ? (
              <p className="text-gray-500">You don't have orders yet</p>
            ) : (
              myorders?.map((order) => (
                <div key={order._id} className="p-3 border-b last:border-0">
                  <p className="text-sm text-gray-600">
                    {order?.createdAt.substring(0, 10)} ·{" "}
                    <span className="font-semibold">{order?.totalPrice.toFixed(3)} KD</span>
                  </p>
                  <p className="text-xs">
                    Status:{" "}
                    <span
                      className={
                        order?.isDelivered
                          ? "text-green-600"
                          : order?.isCanceled
                          ? "text-red-600"
                          : "text-yellow-600"
                      }>
                      {order?.isDelivered
                        ? "Delivered"
                        : order?.isCanceled
                        ? "Canceled"
                        : "Processing"}
                    </span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </motion.div>
    </Layout>
  );
}

export default Profile;
