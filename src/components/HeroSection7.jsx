import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles, Menu } from "lucide-react";
import clsx from "clsx";

/**
 * HERO SECTION – Editorial / Campaign
 * Left = STARSET editorial (centered headline)
 * Right = Cinematic brand hero (NO PRODUCTS)
 */

export default function StarsetHeroCampaign({
  leftVideoThumb = "https://images.unsplash.com/photo-1520975958225-514d97a2f6bb?auto=format&fit=crop&w=900&q=80",
  rightHeroImage = "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=80",
}) {
  return (
    <section className="w-full pt-20 bg-[#f4efe8]">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="grid min-h-[720px] grid-cols-1 gap-4 lg:grid-cols-[1.05fr_1fr]">
          <LeftEditorial />
          <RightCampaignHero image={rightHeroImage} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- LEFT PANEL -------------------------------- */

function LeftEditorial() {
  const chips = useMemo(() => ["BEAUTY TIPS", "OUTFIT IDEAS", "STYLE", "ACCESSORIES"], []);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#f4efe8]">
      {/* Grid + rings */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
      </div>

      <CornerBrackets />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5">
        <div className="flex items-center gap-3 text-xs font-semibold text-black/70">
          <span className="tracking-wide">WEBSCHEMA</span>
        </div>
        <span className="text-xs font-semibold text-black/60">EN</span>
      </div>

      {/* Chips */}
      <div className="relative z-10 mt-8 px-6">
        <div className="ml-auto flex w-fit flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-black/10 bg-white/40 px-3 py-1 text-[10px] font-semibold tracking-wide text-black/70">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* CENTERED HEADLINE */}
      <div className="relative z-10 flex flex-1 items-center px-6">
        <div className="mx-auto max-w-[520px] text-center">
          <h1 className="text-[46px] pt-2 lg:pt-0 font-black uppercase leading-[0.95] tracking-tight text-black md:text-[58px]">
            WE ARE STARSET
            <br />
            EVENTS AND WE
            <br />
            MAKE THE
            <br />
            <span>IMPOSSIBLE</span>
          </h1>

          <div className="mt-8 flex justify-center">
            <button className="rounded-full bg-black px-6 py-3 text-[11px] font-semibold tracking-wide text-white">
              EXPLORE
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-between px-6 pb-5 text-[10px] font-semibold text-black/50">
        <span>KW</span>
        <span>&hearts;</span>
      </div>
    </div>
  );
}

/* -------------------------------- RIGHT HERO -------------------------------- */

function RightCampaignHero({ image }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-black text-white">
      {/* Top controls */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
          <Sparkles className="h-4 w-4" />
          New Campaign
        </div>

        {/*  <button className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-black">
          MENU <Menu className="h-4 w-4" />
        </button> */}
      </div>

      {/* Background image */}
      <motion.img
        src={image}
        alt="Campaign"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl">
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/70">
            Fall / Winter Collection
          </div>

          <h2 className="text-[40px] font-black leading-tight md:text-[56px]">
            Designed for
            <br />
            the moments
            <br />
            you remember
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            A visual journey through form, movement, and identity. Crafted for campaigns that speak
            louder than words.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black text-black">
              Watch Film <Play className="h-4 w-4" />
            </button>

            <button className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-xs font-semibold text-white">
              View Story <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------- UTIL -------------------------------- */

function CornerBrackets() {
  const base = "pointer-events-none absolute z-10 h-5 w-5 border-black/40";
  return (
    <>
      <span className={clsx(base, "left-4 top-4 border-l-2 border-t-2")} />
      <span className={clsx(base, "right-4 top-4 border-r-2 border-t-2")} />
      <span className={clsx(base, "left-4 bottom-4 border-l-2 border-b-2")} />
      <span className={clsx(base, "right-4 bottom-4 border-r-2 border-b-2")} />
    </>
  );
}
