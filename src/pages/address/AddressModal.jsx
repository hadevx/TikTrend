import { useState, useRef, useEffect, useMemo } from "react";
import { provinces } from "../../assets/data/addresses.js";
import { useSelector } from "react-redux";
import { useCreateAddressMutation, useGetAddressQuery } from "../../redux/queries/userApi";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { X, CheckCircle2 } from "lucide-react";

function TruckAnimation() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="absolute inset-0 grid place-items-center p-8">
        <motion.svg viewBox="0 0 800 420" className="w-full max-w-[640px]" initial={false}>
          {/* Road */}
          <rect x="0" y="320" width="800" height="120" fill="rgba(255,255,255,0.06)" />
          <rect x="0" y="318" width="800" height="2" fill="rgba(255,255,255,0.10)" />

          {/* Moving road dashes */}
          <motion.g
            initial={{ x: 0 }}
            animate={{ x: -240 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            opacity="0.55">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x={60 + i * 120}
                y={372}
                width="70"
                height="10"
                rx="5"
                fill="rgba(255,255,255,0.25)"
              />
            ))}
          </motion.g>

          {/* Background dots */}
          <g opacity="0.35">
            {Array.from({ length: 24 }).map((_, i) => (
              <circle
                key={i}
                cx={40 + ((i * 33) % 760)}
                cy={40 + Math.floor(i / 6) * 32}
                r="2"
                fill="rgba(255,255,255,0.22)"
              />
            ))}
          </g>

          {/* Truck bob */}
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
            {/* Shadow */}
            <ellipse cx="380" cy="320" rx="210" ry="18" fill="rgba(0,0,0,0.35)" />

            {/* Trailer */}
            <g>
              <rect
                x="190"
                y="150"
                width="300"
                height="140"
                rx="26"
                fill="rgba(255,255,255,0.92)"
              />
              <rect x="205" y="168" width="270" height="104" rx="20" fill="rgba(0,0,0,0.06)" />
              <rect x="190" y="240" width="300" height="16" rx="8" fill="rgba(255,255,255,0.18)" />
            </g>

            {/* Cab */}
            <g>
              <path
                d="M490 190
                   C490 170 506 154 526 154
                   H600
                   C632 154 658 180 658 212
                   V290
                   H490
                   Z"
                fill="rgba(255,255,255,0.94)"
              />
              <path
                d="M540 172 H600
                   C617 172 632 186 632 204
                   V222
                   H540
                   Z"
                fill="rgba(10,10,10,0.18)"
              />
              <rect x="640" y="254" width="18" height="18" rx="6" fill="rgba(255,255,255,0.70)" />
              <rect x="644" y="258" width="10" height="10" rx="4" fill="rgba(255,255,255,0.95)" />
            </g>

            {/* Hitch */}
            <rect x="472" y="262" width="26" height="14" rx="7" fill="rgba(255,255,255,0.55)" />

            {/* Wheels */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              style={{ transformOrigin: "290px 300px" }}>
              <circle cx="290" cy="300" r="34" fill="rgba(10,10,10,0.60)" />
              <circle cx="290" cy="300" r="18" fill="rgba(255,255,255,0.18)" />
              <circle cx="290" cy="300" r="6" fill="rgba(255,255,255,0.45)" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect
                  key={i}
                  x="288"
                  y="270"
                  width="4"
                  height="16"
                  rx="2"
                  fill="rgba(255,255,255,0.30)"
                  transform={`rotate(${i * 60} 290 300)`}
                />
              ))}
            </motion.g>

            <motion.g
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              style={{ transformOrigin: "560px 300px" }}>
              <circle cx="560" cy="300" r="34" fill="rgba(10,10,10,0.60)" />
              <circle cx="560" cy="300" r="18" fill="rgba(255,255,255,0.18)" />
              <circle cx="560" cy="300" r="6" fill="rgba(255,255,255,0.45)" />
              {Array.from({ length: 6 }).map((_, i) => (
                <rect
                  key={i}
                  x="558"
                  y="270"
                  width="4"
                  height="16"
                  rx="2"
                  fill="rgba(255,255,255,0.30)"
                  transform={`rotate(${i * 60} 560 300)`}
                />
              ))}
            </motion.g>

            {/* Arches */}
            <path
              d="M245 290 C255 260 325 260 335 290"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M515 290 C525 260 595 260 605 290"
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />

            {/* Badge */}
            <rect x="222" y="186" width="110" height="38" rx="19" fill="rgba(0,0,0,0.10)" />
            <text
              x="277"
              y="211"
              textAnchor="middle"
              fontSize="16"
              fontFamily="ui-sans-serif, system-ui"
              fill="rgba(255,255,255,0.90)">
              DELIVERY
            </text>
          </motion.g>
        </motion.svg>
      </div>
    </div>
  );
}

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
  const firstFieldRef = useRef(null);

  // ESC close + lock scroll + (safe) autofocus
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      document.body.style.overflowX = "hidden";

      // SAFE autofocus:
      // Only focus first field if user hasn't already focused inside the modal
      requestAnimationFrame(() => {
        const active = document.activeElement;
        const modalEl = modalRef.current;
        const alreadyInside = modalEl && active && modalEl.contains(active);
        if (!alreadyInside) firstFieldRef.current?.focus?.();
      });
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
      document.body.style.overflowX = "";
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

  const Field = ({ label, hint, children }) => (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-semibold text-neutral-700">{label}</label>
        {hint ? <span className="text-[11px] text-neutral-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );

  const inputCls =
    "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-300 focus:ring-2 focus:ring-neutral-900/10";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/55"
            onMouseDown={onClose} // close on outside click
          />

          {/* Center */}
          <div className="relative h-full w-full overflow-y-auto px-3 py-6 sm:py-10">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close
              className={clsx(
                "mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl",
                "ring-1 ring-black/5",
              )}
              initial={{ opacity: 0, scale: 0.97, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 22 }}
              transition={{ type: "spring", stiffness: 230, damping: 22 }}>
              {/* Split layout: Truck left full height, Form right */}
              <div className="grid min-h-[640px] lg:grid-cols-2">
                {/* LEFT: Truck full */}
                <div className="relative hidden lg:block">
                  <TruckAnimation />

                  {/* Optional overlay text */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-2xl font-semibold">Hi {userInfo?.name || "there"} 👋</p>
                    <p className="mt-1 text-sm text-white/90">
                      Add your address once, use it for every future order.
                    </p>
                  </div>
                </div>

                {/* RIGHT: Form */}
                <div className="flex flex-col">
                  {/* Right header */}
                  <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        Add shipping address
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        Faster delivery and smoother checkout.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 transition"
                      aria-label="Close">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 p-5 sm:p-7">
                    {/* Progress */}
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-800">Address status</p>
                        <p className="text-xs text-neutral-500">
                          {isValid ? "Ready to save" : "Fill all fields to continue"}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                          isValid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-200 text-neutral-600",
                        )}>
                        {isValid ? "Complete" : "Incomplete"}
                      </span>
                    </div>

                    <div className="space-y-4 min-w-0">
                      {/* Governorate + City */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Governorate" hint="Required">
                          <select
                            ref={firstFieldRef}
                            value={selectedGovernorate}
                            onChange={handleGovernorateChange}
                            className={inputCls}>
                            <option value="" disabled>
                              Choose governorate
                            </option>
                            {provinces.map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field
                          label="City"
                          hint={selectedGovernorate ? "Required" : "Select governorate first"}>
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!selectedGovernorate}
                            className={clsx(inputCls, !selectedGovernorate && "bg-neutral-50")}>
                            <option value="" disabled>
                              {selectedGovernorate ? "Choose city" : "Select governorate first"}
                            </option>
                            {cities.map((c, idx) => (
                              <option key={idx} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      {/* Block + House */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Block" hint="Required">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 3"
                            value={block}
                            onChange={(e) => setBlock(e.target.value)}
                            className={inputCls}
                          />
                        </Field>

                        <Field label="House" hint="Required">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 12"
                            value={house}
                            onChange={(e) => setHouse(e.target.value)}
                            className={inputCls}
                          />
                        </Field>
                      </div>

                      {/* Street */}
                      <Field label="Street" hint="Required">
                        <input
                          type="text"
                          placeholder="e.g. 25"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className={inputCls}
                        />
                      </Field>

                      {/* Actions */}
                      <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
