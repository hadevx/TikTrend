import React, { useMemo, useState } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* <SiteNav /> */}
      <ClothingHero />
      {/* <FeaturedStrip /> */}
      {/* <CategoryShowcase /> */}
      {/* <BestSellers /> */}
      {/* <ValueProps /> */}
      {/* <Testimonials /> */}
      {/* <FAQ /> */}
      {/* <Newsletter /> */}
      {/* <SiteFooter /> */}
    </div>
  );
}

/* ----------------------------- HERO (YOUR BLOCK) ----------------------------- */

function ClothingHero() {
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Onyx");

  const colors = useMemo(
    () => [
      { name: "Onyx", swatch: "bg-neutral-900" },
      { name: "Sage", swatch: "bg-emerald-900" },
      { name: "Clay", swatch: "bg-orange-900" },
      { name: "Ice", swatch: "bg-slate-200" },
    ],
    [],
  );

  const sizes = useMemo(() => ["XS", "S", "M", "L", "XL"], []);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Background dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Vignette + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 45%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(700px 520px at 40% 60%, rgba(249,115,22,0.12), transparent 55%), radial-gradient(900px 520px at 50% 65%, rgba(0,0,0,0.2), rgba(0,0,0,0.8) 70%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2">
        {/* Left: Copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            New drop • Winter essentials
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Minimal. Modular. Made to move.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Elevated basics in premium fabrics—tees, hoodies, cargos, and outerwear that layer
            cleanly. Built for everyday wear with a sharp silhouette.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              Shop the collection
            </button>
            <button className="rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 hover:bg-white/10 transition">
              Explore lookbook
            </button>
            <div className="ml-0 flex items-center gap-2 sm:ml-2">
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/80?img=12",
                  "https://i.pravatar.cc/80?img=32",
                  "https://i.pravatar.cc/80?img=56",
                ].map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Customer avatar ${i + 1}`}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-neutral-950"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                ))}
              </div>

              <div className="text-xs text-white/65">
                Loved by <span className="text-white/85">12,000+</span> customers
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <SelectPill label="Category" value="Outerwear" />
            <SelectPill label="Shipping" value="Free over  15 KD" />
            <SelectPill label="Returns" value="30 days" />
          </div>
        </div>

        {/* Right: Visual stack */}
        <div className="relative mx-auto h-[760px] w-[520px] max-w-full">
          {/* small avatar bubble */}
          <div className="absolute left-6 top-28 h-10 w-10 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.5)]">
            <div className="grid h-full w-full place-items-center">
              <div className="h-6 w-6 rounded-full bg-white/15" />
            </div>
          </div>

          {/* Wishlist card */}
          <GlassCard className="absolute right-4 top-12 w-[200px] rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-white/90">Wishlist</div>
              <div className="grid h-6 min-w-6 place-items-center rounded-full bg-orange-500 px-2 text-[10px] font-semibold text-black">
                18
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 240 180" fill="none">
                  <path
                    d="M92 44c8-14 20-22 28-22s20 8 28 22l18 16-10 16v72c0 8-6 14-14 14H100c-8 0-14-6-14-14V76L76 60l18-16Z"
                    fill="rgba(0,0,0,0.55)"
                  />
                  <path
                    d="M104 54c6-10 12-14 16-14s10 4 16 14"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <rect
                    x="103"
                    y="92"
                    width="34"
                    height="20"
                    rx="10"
                    fill="rgba(255,255,255,0.08)"
                  />
                  <path
                    d="M120 98v10"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </GlassCard>

          {/* Main product card */}
          <div className="absolute left-1/2 top-36 w-[420px] -translate-x-1/2 rounded-[28px] bg-white/5 backdrop-blur-2xl ring-1 ring-white/12 shadow-[0_40px_120px_rgba(0,0,0,0.75)]">
            <div className="relative overflow-hidden rounded-[28px]">
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-600/35 via-neutral-500/20 to-orange-900/30" />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
                }}
              />

              <div className="relative aspect-[4/3] w-full">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 540" fill="none">
                  <path
                    d="M290 150c20-28 44-42 70-42s50 14 70 42l-36 40c-10 10-18 14-34 14s-24-4-34-14l-36-40Z"
                    fill="rgba(0,0,0,0.90)"
                  />
                  <path
                    d="M220 210c36-26 82-40 140-40s104 14 140 40c22 16 34 40 34 76 0 120-92 190-174 190s-174-70-174-190c0-36 12-60 34-76Z"
                    fill="rgba(0,0,0,0.92)"
                  />
                  <path
                    d="M360 196v270"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M292 252c26 18 52 26 68 26s42-8 68-26"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M220 250c-40 28-62 76-62 136 0 22 4 42 10 58"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <path
                    d="M500 250c40 28 62 76 62 136 0 22-4 42-10 58"
                    stroke="rgba(0,0,0,0.85)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 shadow-[inset_0_-120px_160px_rgba(0,0,0,0.65)]" />
              </div>

              <div className="absolute left-5 top-5 rounded-2xl bg-black/25 px-4 py-3 backdrop-blur-xl ring-1 ring-white/10">
                <div className="text-xs text-white/75">Featured</div>
                <div className="mt-1 text-sm font-semibold">Arc Shell Jacket</div>
                <div className="mt-1 text-xs text-white/70">Water-repellent</div>
              </div>
            </div>
          </div>

          {/* Options card */}
          <GlassCard className="absolute left-0 top-[330px] w-[240px] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-white/85">Pick your fit</div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">
                <span className="text-sm">→</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <div className="text-[11px] text-white/65">Color</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className={
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition " +
                        (color === c.name
                          ? "bg-white/10 ring-white/20"
                          : "bg-white/5 ring-white/10 hover:bg-white/10")
                      }
                      aria-pressed={color === c.name}>
                      <span className={"h-3 w-3 rounded-full ring-1 ring-white/15 " + c.swatch} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-white/65">Size</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={
                        "h-8 w-10 rounded-xl text-xs ring-1 transition " +
                        (size === s
                          ? "bg-white/10 ring-white/20"
                          : "bg-white/5 ring-white/10 hover:bg-white/10")
                      }
                      aria-pressed={size === s}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-white/65">Selected</div>
                  <div className="text-[11px] text-white/80">
                    {color} • {size}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-neutral-950">
                    Add to cart
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                    ♡
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Social proof card */}
          <div className="absolute bottom-[170px] right-1 w-[240px] rounded-2xl bg-orange-600/95 p-4 text-black shadow-[0_28px_80px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">Trending now</div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-black/10">
                <span className="text-sm">→</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-black/10 p-3">
              <div className="flex h-16 items-end gap-1">
                {[12, 18, 16, 24, 22, 34, 30, 48, 40, 56, 50].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-sm bg-black/70"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <div className="mt-2 text-[11px] font-semibold">Arc Shell Jacket</div>
              <div className="text-[10px] text-black/70">+32% views this week</div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-black/10" />
              <div className="min-w-0">
                <div className="truncate text-[11px] font-semibold">4.8/5 average rating</div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/15">
                  <div className="h-full w-[90%] rounded-full bg-black/70" />
                </div>
                <div className="mt-1 text-[10px] text-black/70">2,341 reviews</div>
              </div>
            </div>
          </div>

          {/* Brand mark */}
          <div className="absolute bottom-8 left-10 select-none font-mono text-sm tracking-[0.35em] text-white/55">
            WEBSCHEMA
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/85">{value}</div>
    </div>
  );
}

function GlassCard({ className = "", children }) {
  return (
    <div
      className={
        "bg-white/8 backdrop-blur-2xl ring-1 ring-white/14 shadow-[0_26px_80px_rgba(0,0,0,0.55)] " +
        className
      }>
      {children}
    </div>
  );
}

/* ----------------------------- SECTIONS BELOW HERO ----------------------------- */

function SectionShell({ kicker, title, desc, children, id }) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[220px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.18), transparent 60%)",
          }}
        />
      </div>

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          {kicker}
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">{desc}</p>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function FeaturedStrip() {
  const items = [
    { label: "Free shipping", value: "Over $75" },
    { label: "Premium fabric", value: "Brushed + durable" },
    { label: "Fit guarantee", value: "30-day returns" },
    { label: "New drops", value: "Every 2 weeks" },
  ];

  return (
    <div className="border-y border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 py-8 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[11px] text-white/60">{it.label}</div>
            <div className="mt-1 text-sm font-semibold text-white/85">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryShowcase() {
  const cats = [
    { name: "Outerwear", desc: "Shells, puffers, layers", tag: "Weather-ready" },
    { name: "Hoodies", desc: "Heavyweight fleece", tag: "Everyday staple" },
    { name: "Tees", desc: "Clean collar + drape", tag: "Premium cotton" },
    { name: "Bottoms", desc: "Cargos + relaxed fits", tag: "All-day comfort" },
  ];

  return (
    <SectionShell
      id="categories"
      kicker="Shop by category"
      title="Build the uniform"
      desc="Pick pieces that layer cleanly. Neutral palette, sharp lines, zero fuss.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c) => (
          <a
            href="#"
            key={c.name}
            className="group relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(560px 220px at 40% 0%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(520px 220px at 80% 100%, rgba(249,115,22,0.12), transparent 55%)",
              }}
            />
            <div className="relative">
              <div className="inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] text-white/70 ring-1 ring-white/10">
                {c.tag}
              </div>
              <div className="mt-4 text-lg font-semibold">{c.name}</div>
              <div className="mt-1 text-sm text-white/65">{c.desc}</div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85">
                Browse <span className="transition group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

function BestSellers() {
  const products = [
    { name: "Arc Shell Jacket", price: "$148", note: "Water-repellent" },
    { name: "Core Hoodie", price: "$96", note: "Heavyweight fleece" },
    { name: "Daily Tee (2-pack)", price: "$54", note: "Structured collar" },
    { name: "Cargo Pant", price: "$112", note: "Relaxed taper" },
  ];

  return (
    <SectionShell
      id="bestsellers"
      kicker="Best sellers"
      title="The pieces everyone repeats"
      desc="Tried-and-true silhouettes with premium materials and consistent sizing.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.name} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-white/10 to-white/0 ring-1 ring-white/10">
              <div className="h-full w-full shadow-[inset_0_-120px_160px_rgba(0,0,0,0.35)]" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-white/60">{p.note}</div>
              </div>
              <div className="text-sm font-semibold text-white/85">{p.price}</div>
            </div>
            <button className="mt-4 w-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950">
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ValueProps() {
  const props = [
    {
      title: "Consistent fit",
      desc: "Same cut across drops so you can reorder confidently.",
    },
    {
      title: "Premium fabric",
      desc: "Durable knits and brushed interiors that stay soft.",
    },
    {
      title: "Minimal palette",
      desc: "Neutrals that mix effortlessly—no loud logos needed.",
    },
    {
      title: "Built to layer",
      desc: "Clean silhouettes designed for everyday stacking.",
    },
  ];

  return (
    <SectionShell
      id="why"
      kicker="Why ARC.WEAR"
      title="Designed like equipment"
      desc="Everything is intentional: material, seam placement, drape, and durability.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {props.map((p) => (
          <div key={p.title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm">✦</span>
            </div>
            <div className="mt-4 text-sm font-semibold">{p.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/65">{p.desc}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Noor",
      text: "The fit is sharp without feeling restrictive. I’ve basically stopped wearing anything else.",
      meta: "Arc Shell + Cargo",
    },
    {
      name: "Omar",
      text: "Premium feel. The hoodie holds shape after washes and doesn’t pill.",
      meta: "Core Hoodie",
    },
    {
      name: "Sara",
      text: "Minimal branding is the point. Everything layers cleanly—super easy to style.",
      meta: "Daily Tee",
    },
  ];

  return (
    <SectionShell
      id="reviews"
      kicker="Social proof"
      title="Worn on repeat"
      desc="Real feedback from customers who care about fabric and fit.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((t) => (
          <div key={t.name} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/10" />
              <div className="min-w-0">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-white/55">{t.meta}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">“{t.text}”</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "How does sizing run?",
      a: "True-to-size with a clean, slightly relaxed silhouette. Size down for a tighter fit.",
    },
    {
      q: "What’s your return policy?",
      a: "30-day returns on unworn items. Exchanges are easy and fast.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes—rates and delivery times are calculated at checkout.",
    },
    {
      q: "How should I care for the garments?",
      a: "Cold wash, low tumble or hang dry. Avoid high heat to preserve drape and softness.",
    },
  ];

  return (
    <SectionShell
      id="faq"
      kicker="FAQ"
      title="Quick answers"
      desc="Everything you need to know before you buy.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold">{f.q}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/65">{f.a}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-[32px] bg-white/5 p-8 ring-1 ring-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 260px at 20% 0%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(900px 260px at 80% 100%, rgba(249,115,22,0.16), transparent 55%)",
          }}
        />
        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Early access
            </div>
            <div className="mt-4 text-2xl font-semibold tracking-tight">
              Get new drops before they sell out
            </div>
            <div className="mt-2 text-sm text-white/65">
              Drop alerts, restocks, and limited runs. No spam.
            </div>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              className="h-12 flex-1 rounded-2xl bg-neutral-950/40 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none focus:ring-white/20"
              placeholder="Email address"
              type="email"
            />
            <button
              type="button"
              className="h-12 rounded-2xl bg-white px-5 text-sm font-semibold text-neutral-950">
              Join list
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols = [
    { title: "Shop", links: ["New", "Outerwear", "Hoodies", "Tees"] },
    { title: "Company", links: ["About", "Sustainability", "Careers", "Press"] },
    { title: "Support", links: ["Shipping", "Returns", "Size guide", "Contact"] },
  ];

  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div>
            <div className="font-mono text-sm tracking-[0.35em] text-white/70">ARC.WEAR</div>
            <div className="mt-3 text-sm leading-relaxed text-white/60">
              Elevated essentials built for daily wear—clean silhouettes, premium fabrics, and
              consistent sizing.
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-3 grid gap-2">
                {c.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm text-white/60 hover:text-white/80 transition">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/45">© {new Date().getFullYear()} ARC.WEAR</div>
          <div className="flex items-center gap-3 text-xs text-white/45">
            <a href="#" className="hover:text-white/70 transition">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white/70 transition">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white/70 transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
