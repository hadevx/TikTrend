import React, { useMemo, useState } from "react";
import Layout from "../../Layout";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Clock,
  Instagram,
  Twitter,
  Music2,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

// ✅ get store status from API
import { useGetStoreStatusQuery } from "../../redux/queries/maintenanceApi";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch store social/contact info
  const { data: storeStatus, isLoading } = useGetStoreStatusQuery();
  const store = storeStatus?.[0];

  const emailValue = store?.email?.trim() ? store.email.trim() : "-";

  const storePhone = useMemo(() => {
    const raw = store?.phoneNumber ? String(store.phoneNumber).trim() : "";
    // keep digits and plus, remove spaces
    return raw.replace(/\s/g, "");
  }, [store?.phoneNumber]);

  const storePhonePretty = store?.phoneNumber?.trim() ? store.phoneNumber.trim() : "—";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ send message to WhatsApp using phone from API (Kuwait friendly)
  const openWhatsApp = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const msg = formData.message.trim();

    if (!name || !email || !msg) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!storePhone) {
      toast.error("Store phone number is not available.");
      return;
    }

    // WhatsApp needs digits only (no +)
    const phoneDigits = storePhone.replace(/[^\d]/g, "");
    if (!phoneDigits) {
      toast.error("Invalid store phone number.");
      return;
    }

    const text = `New message from Contact page:%0A%0AName: ${encodeURIComponent(
      name,
    )}%0AEmail: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(msg)}`;

    // wa.me format: https://wa.me/<number>?text=<encoded>
    const url = `https://wa.me/${phoneDigits}?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // ✅ Use store phone from API to send message
      openWhatsApp();
      setFormData({ name: "", email: "", message: "" });
      toast.success("Redirecting to WhatsApp…");
    } finally {
      setSubmitting(false);
    }
  };

  const normalizeHandleOrUrl = (value) => {
    if (!value) return "";
    return String(value).trim();
  };

  const toUrl = (platform, value) => {
    const v = normalizeHandleOrUrl(value);
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;

    const handle = v.startsWith("@") ? v.slice(1) : v;

    if (platform === "instagram") return `https://instagram.com/${handle}`;
    if (platform === "twitter") return `https://x.com/${handle}`;
    if (platform === "tiktok") return `https://www.tiktok.com/@${handle}`;
    return v;
  };

  const pretty = (platform, value) => {
    const v = normalizeHandleOrUrl(value);
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) {
      try {
        const u = new URL(v);
        return u.pathname?.replace(/\//g, "") || u.host;
      } catch {
        return v;
      }
    }
    return v;
  };

  return (
    <Layout>
      <div className="relative mt-[70px] min-h-screen overflow-x-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-16 h-72 w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
          <div className="absolute right-0 top-80 h-64 w-64 translate-x-1/2 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <div className="container-custom px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          {/* Hero */}
          <div className="max-w-3xl px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
              <ShieldCheck className="h-4 w-4" />
              Support
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950">
              Contact us
            </h1>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Questions about sizing, orders, or availability? Send us a message and we’ll get back
              to you as soon as possible.
            </p>
          </div>

          <div className="mt-10 grid px-4 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Info */}
            <aside className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-6 shadow-sm">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <Mail className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Email</div>
                    {emailValue !== "-" ? (
                      <a
                        href={`mailto:${emailValue}`}
                        className="mt-1 inline-block text-sm text-neutral-600 hover:text-neutral-900">
                        {emailValue}
                      </a>
                    ) : (
                      <div className="mt-1 text-sm text-neutral-500">—</div>
                    )}
                  </div>
                </div>

                {/* Phone (from API) */}
                <div className="mt-4 flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <Phone className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-950">Phone</div>
                    {isLoading ? (
                      <div className="mt-1 text-sm text-neutral-500">Loading…</div>
                    ) : storePhone ? (
                      <a
                        href={`tel:${storePhone}`}
                        className="mt-1 inline-block text-sm text-neutral-600 hover:text-neutral-900">
                        {storePhonePretty}
                      </a>
                    ) : (
                      <div className="mt-1 text-sm text-neutral-500">—</div>
                    )}
                  </div>
                </div>

                {/* Location (static) */}
                <div className="mt-4 flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <MapPin className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Location</div>
                    <div className="mt-1 text-sm text-neutral-600">Kuwait City, Kuwait</div>
                  </div>
                </div>

                {/* Social (from API) */}
                <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-neutral-950">Social</div>

                  <div className="mt-3 space-y-2">
                    {/* Instagram */}
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Instagram className="h-4 w-4 text-neutral-900" />
                        <span className="text-sm text-neutral-700">Instagram</span>
                      </div>

                      {isLoading ? (
                        <span className="text-sm text-neutral-500">Loading…</span>
                      ) : store?.instagram?.trim() ? (
                        <a
                          href={toUrl("instagram", store.instagram)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-neutral-900 hover:opacity-70 truncate max-w-[160px]">
                          {pretty("instagram", store.instagram)}
                        </a>
                      ) : (
                        <span className="text-sm text-neutral-500">—</span>
                      )}
                    </div>

                    {/* Twitter / X */}
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Twitter className="h-4 w-4 text-neutral-900" />
                        <span className="text-sm text-neutral-700">Twitter / X</span>
                      </div>

                      {isLoading ? (
                        <span className="text-sm text-neutral-500">Loading…</span>
                      ) : store?.twitter?.trim() ? (
                        <a
                          href={toUrl("twitter", store.twitter)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-neutral-900 hover:opacity-70 truncate max-w-[160px]">
                          {pretty("twitter", store.twitter)}
                        </a>
                      ) : (
                        <span className="text-sm text-neutral-500">—</span>
                      )}
                    </div>

                    {/* TikTok */}
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Music2 className="h-4 w-4 text-neutral-900" />
                        <span className="text-sm text-neutral-700">TikTok</span>
                      </div>

                      {isLoading ? (
                        <span className="text-sm text-neutral-500">Loading…</span>
                      ) : store?.tiktok?.trim() ? (
                        <a
                          href={toUrl("tiktok", store.tiktok)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-neutral-900 hover:opacity-70 truncate max-w-[160px]">
                          {pretty("tiktok", store.tiktok)}
                        </a>
                      ) : (
                        <span className="text-sm text-neutral-500">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Support hours */}
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                  <Clock className="h-5 w-5 text-neutral-900 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Support hours</div>
                    <div className="mt-1 text-sm text-neutral-600">Mon–Fri • 9:00 AM – 6:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
                <div className="relative">
                  <div className="text-sm font-semibold text-white/85">Tip</div>
                  <div className="mt-2 text-lg font-semibold">WhatsApp message</div>
                  <p className="mt-2 text-sm text-white/75">
                    When you submit, we’ll open WhatsApp using the store phone number from your
                    settings.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right: Form */}
            <section className="lg:col-span-3">
              <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-950">Send a message</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  This will open WhatsApp and send your message to the store number.
                </p>

                {!storePhone && !isLoading && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                    Store phone is not set in admin settings.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-900">Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-900">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-900">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      rows={6}
                      className="mt-2 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || isLoading || !storePhone}
                    className={clsx(
                      "w-full inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition shadow-sm",
                      submitting || isLoading || !storePhone
                        ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-950 text-white hover:bg-neutral-900 active:scale-[0.99]",
                    )}>
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending..." : "Send on WhatsApp"}
                  </button>

                  <div className="text-xs text-neutral-500 text-center">
                    By submitting, you agree to be contacted about your request.
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
