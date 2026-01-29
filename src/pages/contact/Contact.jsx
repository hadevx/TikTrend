import React, { useState } from "react";
import Layout from "../../Layout";
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock } from "lucide-react";
import clsx from "clsx";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // demo submit
    setTimeout(() => {
      alert("Message sent! (Demo)");
      setFormData({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <Layout>
      {/* Prevent horizontal scroll */}
      <div className="relative mt-[70px] min-h-screen overflow-x-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-16 h-72 w-[90vw] max-w-[700px] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
          <div className="absolute right-0 top-80 h-64 w-64 translate-x-1/2 rounded-full bg-neutral-200/30 blur-3xl" />
        </div>

        <div className="container-custom px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          {/* Hero */}
          <div className="max-w-3xl">
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

          <div className="mt-10 grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Info */}
            <aside className="lg:col-span-2 space-y-4">
              <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <Mail className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Email</div>
                    <div className="mt-1 text-sm text-neutral-600">support@ipsumstore.com</div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <Phone className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Phone</div>
                    <div className="mt-1 text-sm text-neutral-600">+965 1234 5678</div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                    <MapPin className="h-5 w-5 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">Location</div>
                    <div className="mt-1 text-sm text-neutral-600">Kuwait City, Kuwait</div>
                  </div>
                </div>

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
                  <div className="mt-2 text-lg font-semibold">Include your order number</div>
                  <p className="mt-2 text-sm text-white/75">
                    If your message is about an order, add the order number so we can help faster.
                  </p>
                </div>
              </div>
            </aside>

            {/* Right: Form */}
            <section className="lg:col-span-3">
              <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-950">Send a message</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  We usually respond within 24 hours on business days.
                </p>

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
                    disabled={submitting}
                    className={clsx(
                      "w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition shadow-sm",
                      submitting
                        ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        : "bg-neutral-950 text-white hover:bg-neutral-900 active:scale-[0.99]",
                    )}>
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending..." : "Send message"}
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
