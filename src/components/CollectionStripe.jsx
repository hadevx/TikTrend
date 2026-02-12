import { useMemo, useState, useEffect } from "react";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers, Heart } from "lucide-react";
import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";
import clsx from "clsx";

const formatLabel = (name = "") => String(name).trim() || "Unknown";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* ------------------------------ Text animation helpers ------------------------------ */

function splitWords(text = "") {
  return String(text).trim().split(/\s+/).filter(Boolean);
}

const wordContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
};

const wordUp = {
  hidden: { y: 18, opacity: 0, filter: "blur(6px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedWords({ text, className }) {
  const reduce = useReducedMotion();
  const words = useMemo(() => splitWords(text), [text]);

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="show"
      viewport={{
        // ✅ NOT once → re-animates whenever it comes back into view
        amount: 0.6,
        margin: "-80px",
      }}>
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} className="inline-block mr-[0.28em]" variants={wordUp}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * CollectionStrip – redesigned
 * ✅ Changes:
 * - Better header layout + animated text (replays on enter)
 * - Stronger card treatment: glow ring, glass, cleaner meta
 * - Removes "heart" (optional) and replaces with subtle icon button style
 * - Carousel stays controlled + swipe
 * - No dots
 */
export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const categories = useMemo(() => {
    const tree = Array.isArray(categoryTree) ? categoryTree : [];
    const prods = Array.isArray(products) ? products : [];
    const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

    return tree.map((category) => {
      const label = formatLabel(category?.name);
      const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

      const firstProduct = prods.find((p) => String(p.category) === String(category._id));
      const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

      const price =
        firstProduct?.hasDiscount && firstProduct?.discountedPrice != null
          ? Number(firstProduct.discountedPrice)
          : firstProduct?.price != null
            ? Number(firstProduct.price)
            : null;

      const from = price != null && !Number.isNaN(price) ? `${price.toFixed(2)} KD` : null;

      return { id: category._id, label, count, image, from };
    });
  }, [categoryTree, products, mainCategoriesWithCounts]);

  const hasMany = categories.length > 1;

  // controlled index
  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, categories.length - 1);

  const prev = () => setPage((p) => clamp(p - 1, 0, maxPage));
  const next = () => setPage((p) => clamp(p + 1, 0, maxPage));

  // responsive card width
  const [cardW, setCardW] = useState(340);
  useEffect(() => {
    const setByBp = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardW(440);
      else if (w >= 640) setCardW(370);
      else setCardW(305);
    };
    setByBp();
    window.addEventListener("resize", setByBp);
    return () => window.removeEventListener("resize", setByBp);
  }, []);

  const gap = 16;
  const x = useMotionValue(0);

  useEffect(() => {
    const to = -(page * (cardW + gap));
    const controls = animate(x, to, {
      type: "spring",
      stiffness: 140,
      damping: 26,
      mass: 0.9,
    });
    return () => controls.stop();
  }, [page, cardW, x]);

  // swipe feel
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const swipeConfidenceThreshold = 8000;

  return (
    <section dir="ltr" className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Background dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Glow layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 520px at 55% 35%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(820px 560px at 35% 70%, rgba(249,115,22,0.14), transparent 55%), radial-gradient(980px 560px at 55% 70%, rgba(0,0,0,0.2), rgba(0,0,0,0.85) 70%)",
        }}
      />

      <Reveal>
        <div className="relative mx-auto max-w-6xl px-6 py-14 lg:py-20">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-white/80" />
                  Collections
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl leading-[1.05]">
                <AnimatedWords text="Shop by category" />
              </h2>

              <div className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                <AnimatedWords text="Find your fit faster — curated essentials organized by category." />
              </div>

              {/* underline accent */}
              <motion.div
                aria-hidden
                className="mt-6 h-[2px] w-28 origin-left rounded-full bg-gradient-to-r from-orange-500/80 via-white/20 to-transparent"
                variants={lineReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.6, margin: "-80px" }}
              />
            </div>

            {/* Arrows */}
            {hasMany && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={page === 0}
                  className={clsx(
                    "grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10",
                    page === 0 && "opacity-40 cursor-not-allowed hover:bg-white/5",
                  )}
                  aria-label="Previous"
                  title="Previous">
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={page === maxPage}
                  className={clsx(
                    "grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10",
                    page === maxPage && "opacity-40 cursor-not-allowed hover:bg-white/5",
                  )}
                  aria-label="Next"
                  title="Next">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-neutral-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-neutral-950 to-transparent" />

            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-4"
                style={{ x }}
                drag={hasMany ? "x" : false}
                dragConstraints={{ left: -(maxPage * (cardW + gap)), right: 0 }}
                dragElastic={0.08}
                onDragEnd={(e, { offset, velocity }) => {
                  if (reduce) return;
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) next();
                  else if (swipe > swipeConfidenceThreshold) prev();
                  else {
                    const current = x.get();
                    const nearest = Math.round(Math.abs(current) / (cardW + gap));
                    setPage(clamp(nearest, 0, maxPage));
                  }
                }}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/category/${c.id}`)}
                    style={{ width: cardW }}
                    className="shrink-0 text-left"
                    aria-label={`Open category ${c.label}`}
                    title={c.label}>
                    <HeroConsistentCategoryCard item={c} />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* tiny footer line */}
          <div className="mt-8 flex items-center justify-between text-[10px] font-semibold text-white/45">
            <span>WEBSCHEMA</span>
            <span>★</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ Card (redesigned, hero-consistent) ------------------------------ */

function HeroConsistentCategoryCard({ item }) {
  const metaText = item.from ? `From ${item.from}` : `${item.count} items`;

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-[30px]",
        "bg-white/5 ring-1 ring-white/12 backdrop-blur-2xl",
        "shadow-[0_40px_120px_rgba(0,0,0,0.70)] transition",
        "hover:-translate-y-0.5 hover:bg-white/7",
      )}>
      {/* glow ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background:
            "radial-gradient(500px 180px at 35% 0%, rgba(249,115,22,0.22), transparent 60%), radial-gradient(500px 220px at 70% 40%, rgba(255,255,255,0.10), transparent 65%)",
        }}
      />

      {/* grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
        }}
      />

      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.label}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          draggable={false}
          loading="lazy"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 shadow-[inset_0_-140px_180px_rgba(0,0,0,0.55)]" />

        {/* top row */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/12 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {metaText}
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/12 backdrop-blur transition hover:bg-white/15">
            <Heart className="h-4 w-4" />
          </div>
        </div>

        {/* bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            <AnimatedWords text={item.label} className="inline-block" />
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/70">VIEW COLLECTION</p>

            <motion.span
              aria-hidden
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/12 backdrop-blur"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.6, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              {item.count}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
