import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Truck, ShieldCheck, RotateCcw, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";

const HIGHLIGHTS = [
  {
    id: "quality",
    title: "Premium quality",
    desc: "Clean stitching. Better fabrics.",
    icon: BadgeCheck,
  },
  { id: "delivery", title: "Fast delivery", desc: "Quick dispatch in Kuwait.", icon: Truck },
  {
    id: "secure",
    title: "Secure checkout",
    desc: "Trusted payments & privacy.",
    icon: ShieldCheck,
  },
  { id: "returns", title: "Easy exchanges", desc: "Simple size swaps & support.", icon: RotateCcw },
];

const TESTIMONIALS = [
  { id: "t1", quote: "Perfect fit. Feels premium.", name: "Ahmed", meta: "Kuwait City" },
  { id: "t2", quote: "Minimal design, maximum quality.", name: "Sara", meta: "Salmiya" },
  { id: "t3", quote: "Exchange was effortless.", name: "Fahad", meta: "Hawally" },
];

export default function TrustHighlights() {
  const [active, setActive] = useState(TESTIMONIALS[0].id);

  const activeTestimonial = useMemo(
    () => TESTIMONIALS.find((t) => t.id === active) || TESTIMONIALS[0],
    [active],
  );

  return (
    <section className="relative overflow-hidden px-2 py-16 sm:py-20 lg:py-28">
      {/* Breathtaking but simple background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-neutral-200/55 blur-3xl" />
        <div className="absolute right-[-140px] bottom-[-140px] h-[360px] w-[360px] rounded-full bg-neutral-100 blur-3xl" />
      </div>

      <div className="container-custom px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-neutral-500">
              Trust built in Kuwait
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950">
              Simple. Premium. <span className="italic font-light text-neutral-800">Reliable.</span>
            </h2>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Everything you need for a smooth shopping experience — no noise, just quality.
            </p>
          </div>
        </Reveal>

        {/* Cards + Quote */}
        <div className="mt-10 lg:mt-14 grid gap-6 lg:grid-cols-12">
          {/* Left: Minimal feature grid */}
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <div className="grid gap-4 sm:grid-cols-2">
                {HIGHLIGHTS.map((h) => {
                  const Icon = h.icon;
                  return (
                    <motion.div
                      key={h.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="group rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
                      <div className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-neutral-950" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-neutral-950">{h.title}</h3>
                            <p className="mt-1 text-sm text-neutral-600">{h.desc}</p>
                          </div>
                        </div>

                        {/* tiny accent */}
                        <div className="mt-5 h-px w-full bg-neutral-200/80" />
                        <div className="mt-3 text-xs font-semibold text-neutral-500">
                          Built for everyday wear
                        </div>
                      </div>

                      {/* glow on hover (subtle, premium) */}
                      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition">
                        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_55%)]" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>

            {/* One clean stats strip */}
            <Reveal delay={0.08}>
              <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-200">
                  {[
                    ["Delivery", "Fast in Kuwait"],
                    ["Fit", "True to size"],
                    ["Support", "Quick replies"],
                    ["Returns", "Easy exchange"],
                  ].map(([k, v]) => (
                    <div key={k} className="p-4">
                      <div className="text-[11px] text-neutral-500">{k}</div>
                      <div className="mt-1 text-sm font-semibold text-neutral-950">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Elegant testimonial + CTA */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                {/* soft shine */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative p-6 sm:p-7">
                  <div className="text-xs font-semibold tracking-[0.22em] uppercase text-white/70">
                    Customers say
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="mt-4">
                      <p className="text-xl sm:text-2xl font-semibold leading-snug">
                        “{activeTestimonial.quote}”
                      </p>
                      <p className="mt-4 text-sm text-white/75">
                        <span className="font-semibold text-white">{activeTestimonial.name}</span> •{" "}
                        {activeTestimonial.meta}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* minimal selectors */}
                  <div className="mt-6 flex gap-2">
                    {TESTIMONIALS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActive(t.id)}
                        className={`h-2.5 rounded-full transition-all ${
                          t.id === active ? "w-8 bg-white" : "w-2.5 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Show testimonial from ${t.name}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative border-t border-white/10 p-6 sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-white/75">Ready to shop the latest drops?</p>

                    <Link
                      to="/all-products"
                      className="inline-flex w-fit items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition">
                      Shop now <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
