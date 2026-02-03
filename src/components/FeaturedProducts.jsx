import { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import clsx from "clsx";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

/**
 * FeaturedProducts – consistent with ClothingHero:
 * - Same dark base (neutral-950)
 * - Same dotted grid background + vignette/glow layers
 * - Same pill/badge styling (white/5 + ring)
 * - Same primary/secondary buttons
 */
export default function FeaturedProducts({ products, isLoading }) {
  const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  if (isLoading) return <Loader />;

  const shown = items.slice(0, 8);

  return (
    <section
      dir="ltr"
      id="featured-products"
      className="relative w-full overflow-hidden bg-neutral-950 text-white">
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
      {/* Vignette + glow (match hero) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 45%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(700px 520px at 40% 60%, rgba(249,115,22,0.12), transparent 55%), radial-gradient(900px 520px at 50% 65%, rgba(0,0,0,0.2), rgba(0,0,0,0.8) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-14 lg:py-20">
        {/* Header */}
        <Reveal>
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* pill (same as hero) */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Featured • Top picks
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Shop the highlights
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                A refined selection of our best items—updated regularly for clean, effortless fits.
              </p>

              {/* small info chips */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                  <TrendingUp className="h-4 w-4 text-white/70" />
                  Premium essentials
                </span>

                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                  Fast delivery
                </span>
                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                  Secure checkout
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        {shown.length === 0 ? (
          <div className="relative overflow-hidden rounded-[28px] bg-white/5 p-10 text-center ring-1 ring-white/12 backdrop-blur-2xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
              }}
            />

            <div className="relative">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>

              <p className="mt-5 text-lg font-semibold text-white">No featured products yet</p>
              <p className="mt-2 text-sm text-white/70">
                New drops are coming soon. Check back shortly.
              </p>

              <Link
                to="/all-products"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                View all products
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={container}>
              {shown.map((product) => (
                <motion.div key={product._id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA (hero buttons style) */}
            <div className="mt-10 lg:mt-14">
              <div className="relative overflow-hidden rounded-[28px] bg-white/5 ring-1 ring-white/12 backdrop-blur-2xl">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
                  }}
                />

                <div className="relative flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Want more options?</p>
                    <p className="mt-1 text-sm text-white/70">
                      Open the full catalog and find your next favorite.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/all-products"
                      className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                      View all products
                      <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>

                    <Link
                      to="/all-products"
                      className={clsx(
                        "inline-flex items-center justify-center rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white",
                        "ring-1 ring-white/12 hover:bg-white/10 transition",
                      )}>
                      Explore lookbook
                      <ArrowLeft className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
