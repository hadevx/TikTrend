import { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
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
 * FeaturedProducts – LIGHT / editorial enhancement:
 * - Light base + subtle paper grid
 * - Softer shadows + neutral borders
 * - Serif headline + muted copy
 * - CTA matches clean editorial style
 *
 * NOTE: Your ProductCard is currently dark/glass. It will still render,
 * but for a fully "light" look, consider a light ProductCard variant too.
 */
export default function FeaturedProducts({ products, isLoading }) {
  const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  if (isLoading) return <Loader />;

  const shown = items.slice(0, 8);

  return (
    <section
      dir="ltr"
      id="featured-products"
      className="relative w-full overflow-hidden bg-background text-foreground">
      {/* Subtle paper grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Soft editorial vignette / highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 30%, rgba(0,0,0,0.05), transparent 60%), radial-gradient(700px 520px at 40% 55%, rgba(249,115,22,0.10), transparent 55%), linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.95))",
          mixBlendMode: "normal",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-14 lg:py-20">
        {/* Header */}
        <Reveal>
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/70 ring-1 ring-foreground/10">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Featured • Top picks
              </div>

              <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                Shop the highlights
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                A refined selection of our best items—updated regularly for clean, effortless fits.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        {shown.length === 0 ? (
          <div className="relative overflow-hidden rounded-[28px] bg-white/70 p-10 text-center ring-1 ring-foreground/10 backdrop-blur">
            {/* light grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
              }}
            />

            <div className="relative">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-foreground/[0.04] ring-1 ring-foreground/10">
                <Sparkles className="h-5 w-5 text-foreground/70" />
              </div>

              <p className="mt-5 text-lg font-semibold text-foreground">No featured products yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                New drops are coming soon. Check back shortly.
              </p>

              <Link
                to="/all-products"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[0_18px_50px_rgba(0,0,0,0.18)] hover:opacity-95 transition">
                View all products
                <ArrowRight className="ml-2 h-4 w-4" />
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

            {/* Bottom CTA (clean editorial card) */}
            <div className="mt-10 lg:mt-14">
              <div className="relative overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-foreground/10 backdrop-blur">
                {/* light grain */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
                  }}
                />

                <div className="relative flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">Want more options?</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Open the full catalog and find your next favorite.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/all-products"
                      className={clsx(
                        "inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background",
                        "border border-black hover:opacity-95 transition group",
                      )}>
                      View all products
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <Link
                      to="/all-products"
                      className={clsx(
                        "inline-flex items-center justify-center rounded-2xl bg-transparent px-5 py-3 text-sm font-semibold text-foreground",
                        "ring-1 ring-foreground/12 hover:bg-foreground/[0.04] transition group",
                      )}>
                      Explore lookbook
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
