import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { provinces } from "../assets/data/addresses.js";
import { useSelector } from "react-redux";
import { useCreateAddressMutation, useGetAddressQuery } from "../redux/queries/userApi";
import { toast } from "react-toastify";

export default function AddressModal({ isOpen, onClose }) {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [block, setBlock] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");

  const [createAddress, { isLoading }] = useCreateAddressMutation();
  const { refetch } = useGetAddressQuery(userInfo?._id, { skip: !userInfo?._id });

  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus first field once
    setTimeout(() => firstFieldRef.current?.focus?.(), 0);

    // ESC close
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const onGovernorateChange = (e) => {
    const name = e.target.value;
    setSelectedGovernorate(name);

    const province = provinces.find((p) => p.name === name);
    setCities(province?.cities || []);
    setCity("");
  };

  const isValid = useMemo(
    () => Boolean(selectedGovernorate && city && block && street && house),
    [selectedGovernorate, city, block, street, house],
  );

  const reset = () => {
    setSelectedGovernorate("");
    setCities([]);
    setCity("");
    setBlock("");
    setHouse("");
    setStreet("");
  };

  const save = async () => {
    if (!isValid) return toast.error("All fields are required", { position: "top-center" });

    try {
      await createAddress({
        governorate: selectedGovernorate,
        city,
        block,
        street,
        house,
      }).unwrap();

      toast.success("Address saved", { position: "top-center" });
      refetch?.();
      reset();
      onClose?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save address", { position: "top-center" });
    }
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10";

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-3"
      onMouseDown={(e) => {
        // close only if user clicks on the overlay, not inside modal
        if (e.target === e.currentTarget) onClose?.();
      }}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-neutral-900">Add shipping address</div>
            <div className="text-xs text-neutral-500">
              {userInfo?.name ? `For ${userInfo.name}` : "Fill your delivery details"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-xs font-semibold text-neutral-700">Governorate</div>
              <select
                ref={firstFieldRef}
                value={selectedGovernorate}
                onChange={onGovernorateChange}
                className={inputCls}>
                <option value="">Choose governorate</option>
                {provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-semibold text-neutral-700">City</div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!selectedGovernorate}
                className={inputCls}>
                <option value="">
                  {selectedGovernorate ? "Choose city" : "Select governorate first"}
                </option>
                {cities.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-xs font-semibold text-neutral-700">Block</div>
              <input
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className={inputCls}
                placeholder="e.g. 3"
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-semibold text-neutral-700">House</div>
              <input
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className={inputCls}
                placeholder="e.g. 12"
              />
            </label>
          </div>

          <label className="block">
            <div className="mb-1 text-xs font-semibold text-neutral-700">Street</div>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={inputCls}
              placeholder="e.g. 25"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose?.();
              }}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">
              Cancel
            </button>

            <button
              type="button"
              onClick={save}
              disabled={!isValid || isLoading}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                !isValid || isLoading
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                  : "bg-neutral-950 text-white hover:bg-neutral-900"
              }`}>
              {isLoading ? "Saving..." : "Save address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Portal prevents parent transforms from breaking focus
  return createPortal(modal, document.body);
}
