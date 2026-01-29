import { useState, useRef, useEffect, useMemo } from "react";
import { provinces } from "../../assets/data/addresses.js";
import address2 from "../../assets/images/kuwait.webp";
import { useSelector } from "react-redux";
import { useCreateAddressMutation, useGetAddressQuery } from "../../redux/queries/userApi";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { MapPin, X, CheckCircle2 } from "lucide-react";

export default function AddressModal({ isOpen, onClose }) {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [block, setBlock] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");

  const [createAddress, { isLoading: loadingCreateAddress }] = useCreateAddressMutation();
  const { refetch } = useGetAddressQuery(userInfo?._id);

  const modalRef = useRef(null);

  // Close modal on outside click + ESC
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    }
    function handleEsc(event) {
      if (event.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      // prevent page scroll while modal open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleGovernorateChange = (e) => {
    const provinceName = e.target.value;
    setSelectedGovernorate(provinceName);

    const province = provinces.find((p) => p.name === provinceName);
    setCities(province ? province.cities : []);
    setCity("");
  };

  const isValid = useMemo(() => {
    return Boolean(selectedGovernorate && city && block && street && house);
  }, [selectedGovernorate, city, block, street, house]);

  const handleCreateAddress = async () => {
    if (!isValid) return toast.error("All fields are required", { position: "top-center" });

    try {
      await createAddress({
        governorate: selectedGovernorate,
        city,
        block,
        street,
        house,
      }).unwrap();

      toast.success("You've added a new address", { position: "top-center" });
      refetch();
      onClose();

      // reset after closing (optional)
      setSelectedGovernorate("");
      setCities([]);
      setCity("");
      setBlock("");
      setStreet("");
      setHouse("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save address", { position: "top-center" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Center */}
          <div className="relative h-full w-full overflow-y-auto px-3 py-6 sm:py-10">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-800" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Add shipping address</p>
                    <p className="text-xs text-neutral-500">
                      This helps us deliver your orders faster.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 transition"
                  aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="grid lg:grid-cols-2">
                {/* Left visual */}
                <div className="relative hidden lg:block">
                  <img src={address2} alt="Kuwait" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xl font-semibold">Hi {userInfo?.name} 👋</p>
                    <p className="mt-1 text-sm text-white/90">
                      Add your address to enjoy a smoother checkout experience.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="p-5 sm:p-7">
                  <div className="lg:hidden mb-5">
                    <p className="text-lg font-semibold text-neutral-950">Hi {userInfo?.name} 👋</p>
                    <p className="text-sm text-neutral-600">
                      Add your address to enjoy a smoother checkout experience.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Governorate */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Governorate
                      </label>
                      <select
                        value={selectedGovernorate}
                        onChange={handleGovernorateChange}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="" disabled>
                          Choose governorate
                        </option>
                        {provinces.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10">
                        <option value="" disabled>
                          Choose city
                        </option>
                        {cities.map((c, idx) => (
                          <option key={idx} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Block + House */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">
                          Block
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3"
                          value={block}
                          onChange={(e) => setBlock(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-2">
                          House
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 12"
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                        />
                      </div>
                    </div>

                    {/* Street */}
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-2">
                        Street
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 25"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                      />
                    </div>

                    {/* Footer actions */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleCreateAddress}
                        disabled={!isValid || loadingCreateAddress}
                        className={clsx(
                          "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition",
                          !isValid || loadingCreateAddress
                            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                            : "bg-neutral-950 text-white hover:bg-neutral-900 active:scale-[0.99]",
                        )}>
                        <CheckCircle2 className="h-4 w-4" />
                        {loadingCreateAddress ? "Saving..." : "Save address"}
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Your address is used only for delivery and order updates.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
