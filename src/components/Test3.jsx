import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Wand2, ArrowRight, Check, Star } from "lucide-react";

/**
 * Persian-inspired landing page
 * - React + Tailwind
 * - No external CSS
 * - Uses subtle SVG patterns inspired by Persian tilework & rugs
 */

const cn = (...classes) => classes.filter(Boolean).join(" ");

function WallBackdrop({ className = "", imageUrl = "/persian-wall.jpg" }) {
  // “Clone” feel of the reference: distressed turquoise wall + warm red ornaments.
  // Put the provided image in your /public folder as: public/persian-wall.jpg
  // Then it will load at /persian-wall.jpg
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {/* Base image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Color grade (keeps text readable and matches palette) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.82),rgba(2,6,23,0.92))]" />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,rgba(56,189,248,0.10),transparent_35%),radial-gradient(90%_70%_at_10%_10%,rgba(244,63,94,0.12),transparent_45%),radial-gradient(90%_70%_at_90%_20%,rgba(250,204,21,0.10),transparent_45%)]" />

      {/* Optional grain (SVG noise) */}
      <svg
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        viewBox="0 0 400 400"
        aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="400" height="400" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

function PersianMedallion({ className = "" }) {
  // A medallion-like motif (rug-inspired) as inline SVG.
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true">
      <defs>
        <radialGradient
          id="rg"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(100 70) rotate(90) scale(120 120)">
          <stop offset="0" stopColor="rgba(56,189,248,0.30)" />
          <stop offset="0.45" stopColor="rgba(30,64,175,0.18)" />
          <stop offset="1" stopColor="rgba(2,6,23,0)" />
        </radialGradient>
        <linearGradient id="lg" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0" stopColor="rgba(250,204,21,0.35)" />
          <stop offset="0.45" stopColor="rgba(56,189,248,0.22)" />
          <stop offset="1" stopColor="rgba(148,163,184,0.12)" />
        </linearGradient>
      </defs>

      {/* Outer star */}
      <path
        d="M100 6 L124 28 L154 22 L162 52 L194 70 L172 100 L194 130 L162 148 L154 178 L124 172 L100 194 L76 172 L46 178 L38 148 L6 130 L28 100 L6 70 L38 52 L46 22 L76 28 Z"
        fill="url(#rg)"
        stroke="rgba(250,204,21,0.40)"
        strokeWidth="1.6"
      />

      {/* Inner octagon */}
      <path
        d="M100 28 L134 40 L160 66 L172 100 L160 134 L134 160 L100 172 L66 160 L40 134 L28 100 L40 66 L66 40 Z"
        fill="rgba(14,116,144,0.22)"
        stroke="rgba(56,189,248,0.35)"
        strokeWidth="1.4"
      />

      {/* Filigree lines */}
      <path
        d="M100 44 C120 58 132 76 132 100 C132 124 120 142 100 156"
        stroke="rgba(226,232,240,0.25)"
        strokeWidth="1.2"
      />
      <path
        d="M100 44 C80 58 68 76 68 100 C68 124 80 142 100 156"
        stroke="rgba(226,232,240,0.25)"
        strokeWidth="1.2"
      />
      <path
        d="M44 100 C58 80 76 68 100 68 C124 68 142 80 156 100"
        stroke="rgba(226,232,240,0.20)"
        strokeWidth="1.2"
      />
      <path
        d="M44 100 C58 120 76 132 100 132 C124 132 142 120 156 100"
        stroke="rgba(226,232,240,0.20)"
        strokeWidth="1.2"
      />

      {/* Center rosette */}
      <circle cx="100" cy="100" r="18" fill="rgba(2,6,23,0.45)" stroke="rgba(250,204,21,0.45)" />
      <path
        d="M100 86 L106 94 L116 94 L108 100 L112 110 L100 104 L88 110 L92 100 L84 94 L94 94 Z"
        fill="url(#lg)"
      />

      {/* Tiny corner motifs */}
      {[
        [100, 18],
        [182, 100],
        [100, 182],
        [18, 100],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} fill="rgba(250,204,21,0.45)" />
          <circle cx={x} cy={y} r={10} stroke="rgba(56,189,248,0.22)" />
        </g>
      ))}
    </svg>
  );
}

function CornerOrnament({ position = "tl" }) {
  // Corner motif inspired by the reference image (warm red + cream + teal lines)
  const pos =
    position === "tl"
      ? "left-0 top-0"
      : position === "bl"
        ? "left-0 bottom-0"
        : position === "tr"
          ? "right-0 top-0"
          : "right-0 bottom-0";

  const rotate =
    position === "tl"
      ? "rotate-0"
      : position === "tr"
        ? "rotate-90"
        : position === "br"
          ? "rotate-180"
          : "-rotate-90";

  return (
    <div className={cn("pointer-events-none absolute", pos)} aria-hidden="true">
      <svg
        className={cn(
          "h-56 w-56 opacity-[0.95] drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
          rotate,
        )}
        viewBox="0 0 220 220"
        fill="none">
        {/* Outer scallop */}
        <path
          d="M0 0H220V220C160 220 122 198 94 170C66 142 44 104 0 0Z"
          fill="rgba(239,68,68,0.78)"
        />
        {/* Cream edge */}
        <path
          d="M0 0H220V220C168 220 132 202 106 176C80 150 58 112 14 14L0 0Z"
          fill="rgba(250,245,255,0.72)"
        />
        {/* Teal border */}
        <path
          d="M0 0H220V220C172 220 140 204 116 180C92 156 72 122 32 32L0 0Z"
          fill="rgba(20,184,166,0.45)"
        />
        {/* Inner red panel */}
        <path
          d="M0 0H220V220C176 220 148 206 126 184C104 162 86 132 50 50L0 0Z"
          fill="rgba(220,38,38,0.72)"
        />
        {/* Decorative lines */}
        <path
          d="M10 10C55 55 72 96 86 130C98 160 118 186 170 210"
          stroke="rgba(2,6,23,0.35)"
          strokeWidth="2"
        />
        <path
          d="M22 22C62 62 78 98 92 132C104 160 124 184 170 204"
          stroke="rgba(250,204,21,0.40)"
          strokeWidth="2"
        />
      </svg>

      {/* Hanging heart charm */}
      {(position === "tl" || position === "bl") && (
        <div className={cn("absolute left-20", position === "tl" ? "top-40" : "bottom-40")}>
          <div className="h-10 w-10 rotate-45 rounded-[14px] bg-rose-500/85 shadow-[0_10px_24px_rgba(0,0,0,0.35)]" />
          <div className="absolute -left-[7px] top-[7px] h-10 w-10 rounded-full bg-rose-500/85" />
          <div className="absolute left-[7px] -top-[7px] h-10 w-10 rounded-full bg-rose-500/85" />
          <div className="absolute left-1/2 top-[-26px] h-7 w-px -translate-x-1/2 bg-amber-200/40" />
        </div>
      )}
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <Sparkles className="h-5 w-5 text-teal-200" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-100">Mehr Studio</p>
            <p className="text-xs text-slate-400">Teal wall • Red ornaments</p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <a className="hover:text-slate-100" href="#work">
            Work
          </a>
          <a className="hover:text-slate-100" href="#features">
            Features
          </a>
          <a className="hover:text-slate-100" href="#process">
            Process
          </a>
          <a className="hover:text-slate-100" href="#pricing">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 md:inline-flex">
            View plans
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-rose-400/15 px-4 py-2 text-sm font-semibold text-rose-100 ring-1 ring-rose-300/30 hover:bg-rose-400/20">
            Get a quote <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
      {children}
    </span>
  );
}

function SectionTitle({ kicker, title, desc, align = "left" }) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        align === "right" && "ml-auto text-right",
      )}>
      {kicker ? (
        <p className="text-xs font-semibold tracking-[0.22em] text-sky-200/80">{kicker}</p>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h2>
      {desc ? <p className="mt-3 text-sm leading-6 text-slate-300">{desc}</p> : null}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-2xl font-semibold text-slate-50">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_10%,rgba(56,189,248,0.16),transparent_60%)]" />
      </div>
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40">
          <Icon className="h-5 w-5 text-sky-200" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
      </div>
    </div>
  );
}

function WorkCard({ title, desc, tag }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.0),rgba(2,6,23,0.8))]" />
      </div>
      <div className="relative p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            {tag}
          </span>
          <Star className="h-4 w-4 text-amber-200/70" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>

        {/* faux thumbnail */}
        <div className="mt-6 grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40">
          <div className="h-40 w-40 opacity-90">
            <PersianMedallion />
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ name, price, desc, features, featured }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-7",
        featured ? "border-sky-300/30 bg-sky-500/10" : "border-white/10 bg-white/5",
      )}>
      {featured ? (
        <div className="absolute right-4 top-4 rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-amber-300/30">
          Most popular
        </div>
      ) : null}

      <h3 className="text-base font-semibold text-slate-100">{name}</h3>
      <p className="mt-2 text-sm text-slate-300">{desc}</p>

      <div className="mt-5 flex items-end gap-2">
        <div className="text-3xl font-semibold text-slate-50">{price}</div>
        <div className="pb-1 text-xs text-slate-400">/ project</div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-200">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-300/20">
              <Check className="h-3.5 w-3.5 text-emerald-200" />
            </span>
            <span className="leading-6">{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={cn(
          "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
          featured
            ? "bg-sky-300/20 text-sky-50 ring-1 ring-sky-200/30 hover:bg-sky-300/25"
            : "bg-white/5 text-slate-100 ring-1 ring-white/15 hover:bg-white/10",
        )}>
        Start with {name} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function PersianLandingPage() {
  const features = useMemo(
    () => [
      {
        icon: Wand2,
        title: "Tilework-inspired UI systems",
        desc: "A component library that feels like hand-laid mosaic—consistent, ornate, and fast to ship.",
      },
      {
        icon: Zap,
        title: "Performance-first visuals",
        desc: "Rich textures without heavy assets: layered gradients, SVG motifs, and crisp typography.",
      },
      {
        icon: Shield,
        title: "Accessible by design",
        desc: "High-contrast palettes, readable scale, and motion that respects reduced-motion settings.",
      },
    ],
    [],
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <WallBackdrop imageUrl="/persian-wall.jpg" />
      <CornerOrnament position="tl" />
      <CornerOrnament position="bl" />
      <Nav />

      {/* HERO */}
      <main>
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-18">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}>
                <Badge>Persian aesthetics • Modern product</Badge>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                  A landing page that feels like
                  <span className="text-sky-200"> Isfahan tilework</span>.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Deep blues, turquoise highlights, and gilded accents—translated into a modern
                  React + Tailwind system that stays fast, responsive, and unmistakably Persian.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300/15 px-5 py-3 text-sm font-semibold text-amber-50 ring-1 ring-amber-200/30 hover:bg-amber-300/20">
                    Request a build <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#work"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/15 hover:bg-white/10">
                    See examples
                  </a>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  <Stat value="2–5" label="days to launch" />
                  <Stat value="95+" label="Lighthouse target" />
                  <Stat value="A11y" label="built-in" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_35%,rgba(56,189,248,0.18),transparent_65%)]" />

                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.22em] text-sky-200/80">
                        FEATURED MOTIF
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Medallion + mosaic layers (no images needed)
                      </p>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-slate-950/40">
                      <Sparkles className="h-5 w-5 text-sky-200" />
                    </div>
                  </div>

                  <div className="mt-6 grid place-items-center rounded-3xl border border-white/10 bg-slate-950/40 p-8">
                    <div className="h-56 w-56 sm:h-72 sm:w-72">
                      <PersianMedallion />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold text-slate-100">Palette</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Indigo base, turquoise glow, subtle gold
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold text-slate-100">Texture</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Grainy rug depth + glazed tile sheen
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle
            kicker="PORTFOLIO"
            title="Ornate, but still minimal"
            desc="Use Persian geometry as structure, then keep the layout clean—lots of air, strong type, intentional accents."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <WorkCard
              tag="SaaS landing"
              title="Mosaic hero + crisp sections"
              desc="A tilework header with a calm content rhythm and modern CTAs."
            />
            <WorkCard
              tag="E-commerce"
              title="Rug-inspired product storytelling"
              desc="Texture-forward imagery paired with a strong, accessible UI."
            />
            <WorkCard
              tag="Brand"
              title="Cultural identity, modern polish"
              desc="A refined palette with motif details used sparingly for impact."
            />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="absolute inset-x-0 -top-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <SectionTitle
              kicker="WHAT YOU GET"
              title="A Persian-inspired system—ready to ship"
              desc="Everything you need for a high-end landing page: sections, components, motion, and a consistent visual language."
            />

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((f) => (
                <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
              ))}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
                <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_20%_10%,rgba(250,204,21,0.12),transparent_60%),radial-gradient(60%_70%_at_80%_20%,rgba(56,189,248,0.12),transparent_60%)]" />
                <div className="relative">
                  <h3 className="text-base font-semibold text-slate-100">
                    Built for customization
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Swap motifs, dial up/down ornamentation, or move the palette toward cobalt,
                    lapis, or navy—without changing the layout.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Hero + sections",
                      "FAQ",
                      "Pricing",
                      "Testimonials",
                      "Responsive",
                      "A11y",
                    ].map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="mx-auto max-w-6xl px-4 py-16">
          <SectionTitle
            kicker="PROCESS"
            title="From motif to modern UI"
            desc="A simple workflow: we extract the visual language (geometry, palette, borders), then apply it with restraint."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Mood + motif map",
                desc: "Pick 2–3 hero patterns (tile, medallion, border). Define intensity and spacing rules.",
              },
              {
                step: "02",
                title: "Component system",
                desc: "Buttons, cards, sections, typography scale, and reusable pattern utilities.",
              },
              {
                step: "03",
                title: "Polish + ship",
                desc: "Animation, responsiveness, SEO, and performance checks—then deploy.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="absolute right-0 top-0 h-28 w-28 opacity-30">
                  <PersianMedallion />
                </div>
                <div className="relative">
                  <p className="text-xs font-semibold tracking-[0.22em] text-sky-200/80">
                    STEP {s.step}
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-slate-100">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <SectionTitle
              kicker="PRICING"
              title="Choose your ornament level"
              desc="Start simple, then add complexity (patterns, borders, custom illustrations) as needed."
            />
            <div className="flex items-center gap-3 lg:justify-end">
              <span className="text-xs text-slate-400">Includes React + Tailwind</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Responsive + SEO
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Minimal"
              price="$1.2k"
              desc="Clean layout with subtle pattern layers."
              features={["Hero + 4 sections", "Basic motif accents", "1 round of edits"]}
            />
            <PricingCard
              name="Classic"
              price="$2.4k"
              desc="Full landing with medallion + mosaic utilities."
              features={[
                "Hero + 7 sections",
                "Custom SVG motif set",
                "2 rounds of edits",
                "Deployment help",
              ]}
              featured
            />
            <PricingCard
              name="Royal"
              price="$4.2k"
              desc="High-end bespoke: patterns, borders, illustrations."
              features={[
                "Hero + 10 sections",
                "Illustrated accents",
                "Design system",
                "3 rounds of edits",
              ]}
            />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative mx-auto max-w-6xl px-4 pb-20 pt-8">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5">
            <div className="grid gap-10 p-8 lg:grid-cols-2 lg:p-10">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-sky-200/80">CONTACT</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  Want this style for your brand?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Send your references (tilework, rug borders, color direction). We’ll deliver a
                  production-ready landing page you can extend.
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-200">
                  {["Fast setup", "Customizable motif intensity", "Modern UX + Persian soul"].map(
                    (t) => (
                      <div key={t} className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-300/10 ring-1 ring-amber-200/20">
                          <Check className="h-3.5 w-3.5 text-amber-100" />
                        </span>
                        <span>{t}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                <div className="grid gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-200">Name</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-300/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-200">Email</label>
                    <input
                      type="email"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-300/30"
                      placeholder="you@domain.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-200">Project notes</label>
                    <textarea
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-300/30"
                      placeholder="What are you building? Any pattern references or palette preferences?"
                    />
                  </div>

                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-300/20 px-5 py-3 text-sm font-semibold text-sky-50 ring-1 ring-sky-200/30 hover:bg-sky-300/25">
                    Send request <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-xs text-slate-400">
                    Tip: replace the inline SVG motifs with your own patterns for a closer match.
                  </p>
                </div>
              </form>
            </div>

            <div className="border-t border-white/10 px-8 py-6 text-xs text-slate-400 lg:px-10">
              © {new Date().getFullYear()} Mehr Studio • Crafted with React + Tailwind
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
