import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import clsx from "clsx";
import {
  Sparkles,
  Shirt,
  Leaf,
  Ruler,
  ShieldCheck,
  Droplets,
  Wind,
  BadgeCheck,
} from "lucide-react";

/**
 * Clothes ecommerce "Materials / Craft" section
 * - Background switches per material
 * - Premium glass content card
 * - Feature chips + care badges + quick facts
 * - Buttons to switch between materials
 */

const materials = [
  {
    id: "cotton",
    name: "Premium Cotton",
    subtitle: "Soft, breathable, everyday luxury",
    description:
      "Our cotton essentials are crafted for all-day comfort. Smooth on skin, breathable in Kuwait’s heat, and built to keep shape wash after wash.",
    backgroundImage: "./images/img1.jpg",
    accent: "from-white/20 to-white/0",
    stats: [
      { label: "Feel", value: "Soft" },
      { label: "Breathability", value: "High" },
      { label: "Best for", value: "Daily wear" },
    ],
    features: [
      { icon: Wind, title: "Breathable", desc: "Airy weave for warm days." },
      { icon: Droplets, title: "Moisture friendly", desc: "Comfort that stays fresh." },
      { icon: Ruler, title: "Holds shape", desc: "Stays crisp, less sagging." },
    ],
    badges: ["Machine wash cold", "Low iron", "Do not bleach"],
  },
  {
    id: "linen",
    name: "Linen Blend",
    subtitle: "Lightweight, elevated summer texture",
    description:
      "A refined linen blend for a relaxed drape and a premium look. Perfect for warm weather, with a texture that feels expensive and modern.",
    backgroundImage: "./images/img2.jpg",
    accent: "from-white/20 to-white/0",
    stats: [
      { label: "Feel", value: "Crisp" },
      { label: "Breathability", value: "Very high" },
      { label: "Best for", value: "Summer" },
    ],
    features: [
      { icon: Leaf, title: "Naturally airy", desc: "Ideal for heat + humidity." },
      { icon: Shirt, title: "Relaxed drape", desc: "Looks effortless, feels premium." },
      { icon: Sparkles, title: "Textured luxe", desc: "Signature linen character." },
    ],
    badges: ["Gentle wash", "Steam recommended", "Hang dry"],
  },
  {
    id: "performance",
    name: "Performance Knit",
    subtitle: "Clean stretch, modern fit, easy care",
    description:
      "Designed for movement and long days. Our performance knit balances stretch and structure for a sharp silhouette with effortless comfort.",
    backgroundImage: "./images/img3.jpg",
    accent: "from-white/20 to-white/0",
    stats: [
      { label: "Feel", value: "Smooth" },
      { label: "Stretch", value: "Yes" },
      { label: "Best for", value: "Travel" },
    ],
    features: [
      { icon: ShieldCheck, title: "Durable", desc: "Built for frequent wear." },
      { icon: BadgeCheck, title: "Easy care", desc: "Low maintenance finish." },
      { icon: Ruler, title: "Clean fit", desc: "Structure without stiffness." },
    ],
    badges: ["Machine wash", "Quick dry", "Low heat"],
  },
];

export function MaterialsSection() {
  const [activeId, setActiveId] = useState(materials[0].id);

  const active = useMemo(
    () => materials.find((m) => m.id === activeId) || materials[0],
    [activeId],
  );

  return (
    <section
      id="materials"
      className="relative min-h-[85vh] md:min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {materials.map((m) => (
          <motion.div
            key={m.id}
            className="absolute inset-0"
            initial={{ opacity: m.id === activeId ? 1 : 0 }}
            animate={{ opacity: m.id === activeId ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}>
            <img
              src={m.backgroundImage || "/placeholder.svg"}
              alt={m.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        ))}

        {/* overlays for readability + premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="container-custom px-4 sm:px-6 w-full py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Title + glass card */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-white/75 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                  Fabric & Craft
                </p>

                <AnimatePresence mode="wait">
                  <motion.h2
                    key={active.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="mt-3 text-white text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
                    {active.name}
                  </motion.h2>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.subtitle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeInOut", delay: 0.05 }}
                    className="mt-3 text-white/90 text-lg sm:text-xl">
                    {active.subtitle}
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.description}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeInOut", delay: 0.08 }}
                    className="mt-4 text-white/85 text-sm sm:text-base leading-relaxed">
                    {active.description}
                  </motion.p>
                </AnimatePresence>

                {/* Glass info card */}
                <div className="mt-7 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.45)] overflow-hidden">
                  <div className={clsx("p-5 sm:p-6 bg-gradient-to-b", active.accent)}>
                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {active.stats.map((s) => (
                        <div
                          key={s.label}
                          className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
                          <div className="text-[11px] text-white/70">{s.label}</div>
                          <div className="mt-1 text-sm font-semibold text-white">{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Care badges */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {active.badges.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="p-5 sm:p-6 border-t border-white/10">
                    <div className="grid sm:grid-cols-3 gap-3">
                      {active.features.map((f) => {
                        const Icon = f.icon;
                        return (
                          <div
                            key={f.title}
                            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
                            <div className="flex items-center gap-2 text-white font-semibold">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm">{f.title}</span>
                            </div>
                            <p className="mt-2 text-xs text-white/75 leading-relaxed">{f.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 text-xs text-white/60">
                      Crafted for comfort, durability, and a clean silhouette — designed for modern
                      daily wear.
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: selector */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 sm:p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
                  Explore fabrics
                </p>

                <div className="flex flex-wrap gap-2">
                  {materials.map((m) => {
                    const isActive = m.id === activeId;
                    return (
                      <motion.button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveId(m.id)}
                        className={clsx(
                          "px-4 py-2 rounded-2xl text-sm font-semibold transition border",
                          isActive
                            ? "bg-white text-neutral-900 border-white"
                            : "bg-white/5 text-white border-white/15 hover:bg-white/10",
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}>
                        {m.name}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Mini hint */}
                <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">Why it matters</span>
                  </div>
                  <p className="mt-2 text-xs text-white/75 leading-relaxed">
                    Better fabric = better fit, better feel, and longer life. We choose materials
                    that look premium and wear beautifully.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
