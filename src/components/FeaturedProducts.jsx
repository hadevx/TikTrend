import { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";

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

export default function FeaturedProducts({ products, isLoading }) {
  const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  if (isLoading) return <Loader />;

  const shown = items.slice(0, 8);

  return (
    <section
      dir="ltr"
      id="featured-products"
      className="relative px-2 overflow-hidden py-14 lg:py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-black" />
        <div className="absolute left-1/2 top-[-160px] h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-28 top-44 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-[-180px] bottom-[-180px] h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      <div className="container-custom px-4">
        {/* Header */}
        <Reveal>
          <div className="mb-10 lg:mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center backdrop-blur">
                  <Sparkles className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60">FEATURED</p>
                  <p className="text-sm text-white/80">Top picks for you</p>
                </div>
              </div>

              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white">
                Shop the highlights
              </h2>

              <p className="mt-3 text-base md:text-lg leading-relaxed text-white/60">
                A refined selection of our best items — updated regularly.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        {shown.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-sm backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

            <div className="relative">
              <p className="text-lg font-semibold text-white">No featured products yet</p>
              <p className="mt-1 text-sm text-white/60">
                New drops are coming soon. Check back shortly.
              </p>

              <Link
                to="/all-products"
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Explore catalog
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

            {/* Bottom CTA */}
            <div className="mt-10 lg:mt-14">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_55%)]" />

                <div className="relative flex flex-col gap-4 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Want more options?</p>
                    <p className="mt-1 text-sm text-white/60">
                      Open the full catalog and find your next favorite.
                    </p>
                  </div>

                  <Link
                    to="/all-products"
                    className="group inline-flex w-fit items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-white/90">
                    View all products
                    <ArrowLeft className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
