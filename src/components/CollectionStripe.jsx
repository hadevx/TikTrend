import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const formatLabel = (name = "") => String(name).trim() || "Unknown";

/**
 * CollectionStrip – Editorial (matches StarsetHeroCampaign)
 * Improved carousel:
 * - No overflow scroll + no scrollIntoView + no IntersectionObserver
 * - Controlled index with spring animation
 * - Drag/swipe support (mobile feels natural)
 * - Arrows + dots remain
 */
export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const tree = Array.isArray(categoryTree) ? categoryTree : [];
    const prods = Array.isArray(products) ? products : [];
    const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

    return tree.map((category) => {
      const label = formatLabel(category?.name);
      const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

      const firstProduct = prods.find((p) => String(p.category) === String(category._id));
      const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

      return { id: category._id, label, count, image };
    });
  }, [categoryTree, products, mainCategoriesWithCounts]);

  const hasMany = categories.length > 1;

  // --- Controlled carousel index (each "page" is one card step) ---
  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, categories.length - 1);

  const prev = () => setPage((p) => Math.max(p - 1, 0));
  const next = () => setPage((p) => Math.min(p + 1, maxPage));
  const goTo = (i) => setPage(Math.max(0, Math.min(i, maxPage)));

  // swipe feel
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const swipeConfidenceThreshold = 8000;

  // IMPORTANT:
  // We animate by one-card width + gap.
  // Width changes by breakpoint. We'll use a CSS variable for card width.
  // Tailwind: set --cardW per breakpoint and use it in translate calc.
  const trackX = `calc(${page} * (var(--cardW) + 16px) * -1)`;

  return (
    <section dir="ltr" className="w-full bg-[#f4efe8] px-2 py-14 lg:py-20">
      <Reveal>
        <div className="container-custom px-4">
          {/* OUTER EDITORIAL PANEL (matches hero left panel) */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#f4efe8]">
            {/* Grid + rings */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.55]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:80px_80px]" />
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
              <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
            </div>

            <CornerBrackets />

            <div className="relative z-10 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/40 px-4 py-2 text-[11px] font-semibold tracking-wide text-black/70">
                    <Layers className="h-4 w-4" />
                    COLLECTIONS
                  </div>

                  <h2 className="mt-4 text-3xl md:text-5xl font-black uppercase leading-[0.98] tracking-tight text-black">
                    Shop by category
                  </h2>

                  <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed text-black/60">
                    Editorial collections—quick entry points to what you’re looking for.
                  </p>
                </div>

                {/* Desktop arrows */}
                {hasMany && (
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      disabled={page === 0}
                      className={clsx(
                        "group h-11 w-11 rounded-2xl border border-black/10 bg-white/40 backdrop-blur transition hover:bg-white/60",
                        page === 0 && "opacity-40 cursor-not-allowed hover:bg-white/40",
                      )}
                      aria-label="Previous"
                      title="Previous">
                      <ArrowLeft className="mx-auto h-4 w-4 text-black transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      disabled={page === maxPage}
                      className={clsx(
                        "group h-11 w-11 rounded-2xl border border-black/10 bg-white/40 backdrop-blur transition hover:bg-white/60",
                        page === maxPage && "opacity-40 cursor-not-allowed hover:bg-white/40",
                      )}
                      aria-label="Next"
                      title="Next">
                      <ArrowRight className="mx-auto h-4 w-4 text-black transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Carousel (NO scroll container) */}
              <div className="relative mt-7">
                {/* edge fades */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#f4efe8] to-transparent z-20" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#f4efe8] to-transparent z-20" />

                {/* viewport */}
                <div className="relative overflow-hidden">
                  <motion.div
                    drag={hasMany ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.08}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) next();
                      else if (swipe > swipeConfidenceThreshold) prev();
                    }}
                    animate={{ x: trackX }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    className={clsx(
                      "flex gap-4",
                      "[--cardW:240px] sm:[--cardW:280px] md:[--cardW:330px]",
                    )}>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => navigate(`/category/${c.id}`)}
                        className="shrink-0 w-[240px] sm:w-[280px] md:w-[330px] text-left"
                        aria-label={`Open category ${c.label}`}
                        title={c.label}>
                        <div className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white/30 shadow-sm backdrop-blur transition hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
                          <div className="pointer-events-none absolute -inset-1 rounded-[30px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.55),transparent_60%)] opacity-0 blur transition duration-300 group-hover:opacity-100" />

                          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                            <img
                              src={c.image}
                              alt={c.label}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                              draggable="false"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                            <div className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                              {c.count} items
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {c.label}
                              </h3>
                              <p className="mt-0.5 text-xs font-semibold tracking-wide text-white/80">
                                VIEW COLLECTION
                              </p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                </div>

                {/* Mobile arrows */}
                {hasMany && (
                  <div className="mt-5 flex md:hidden items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      disabled={page === 0}
                      className={clsx(
                        "group h-11 w-11 rounded-2xl border border-black/10 bg-white/40 backdrop-blur transition hover:bg-white/60",
                        page === 0 && "opacity-40 cursor-not-allowed hover:bg-white/40",
                      )}
                      aria-label="Previous"
                      title="Previous">
                      <ArrowLeft className="mx-auto h-4 w-4 text-black transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={next}
                      disabled={page === maxPage}
                      className={clsx(
                        "group h-11 w-11 rounded-2xl border border-black/10 bg-white/40 backdrop-blur transition hover:bg-white/60",
                        page === maxPage && "opacity-40 cursor-not-allowed hover:bg-white/40",
                      )}
                      aria-label="Next"
                      title="Next">
                      <ArrowRight className="mx-auto h-4 w-4 text-black transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}

                {/* Dots */}
                {hasMany && (
                  <div className="mt-5 flex items-center justify-center gap-2">
                    {categories.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        title={`Slide ${i + 1}`}
                        className={clsx(
                          "h-2.5 rounded-full transition-all",
                          i === page ? "w-8 bg-black/80" : "w-2.5 bg-black/20 hover:bg-black/30",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* tiny footer line like editorial panel */}
              <div className="mt-6 flex justify-between text-[10px] font-semibold text-black/45">
                <span>KW</span>
                <span>★</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* same brackets vibe as your hero */
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
