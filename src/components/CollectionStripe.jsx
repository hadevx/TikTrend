import { useMemo, useRef, useState, useEffect } from "react";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const capitalizeLabel = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);

  const categories = useMemo(() => {
    const tree = Array.isArray(categoryTree) ? categoryTree : [];
    const prods = Array.isArray(products) ? products : [];
    const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

    return tree.map((category) => {
      const name = category?.name || "Unknown";
      const label = capitalizeLabel(name);

      const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

      const firstProduct = prods.find((p) => String(p.category) === String(category._id));
      const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

      return { id: category._id, label, count, image };
    });
  }, [categoryTree, products, mainCategoriesWithCounts]);

  // scroll by one card
  const scrollByCard = (dir = 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : 320; // +gap
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // update active dot based on which card is most visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll("[data-card]"));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible) {
          const idx = cards.indexOf(visible.target);
          if (idx >= 0) setActive(idx);
        }
      },
      { root: el, threshold: [0.4, 0.6, 0.75] },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [categories.length]);

  const goTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const target = cards[index];
    if (target) target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section className="py-14 lg:py-20 px-2">
      <Reveal>
        <div className="container-custom px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900">Collections</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Browse by category — swipe or use arrows.
              </p>
            </div>

            {/* arrows (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="h-10 w-10 rounded-xl border bg-white hover:bg-zinc-50"
                aria-label="Previous">
                <ArrowLeft className="mx-auto h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="h-10 w-10 rounded-xl border bg-white hover:bg-zinc-50"
                aria-label="Next">
                <ArrowRight className="mx-auto h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative mt-6">
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2
                         snap-x snap-mandatory
                         [-ms-overflow-style:none] [scrollbar-width:none]
                         [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-card
                  onClick={() => navigate(`/category/${c.id}`)}
                  className="snap-start shrink-0 w-[240px] sm:w-[280px] md:w-[320px] text-left">
                  <div className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                    <div className="relative aspect-[4/5]">
                      <img
                        src={c.image}
                        alt={c.label}
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable="false"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 rounded-full bg-white/15 text-white text-xs px-3 py-1 backdrop-blur">
                        {c.count} items
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold text-white truncate">{c.label}</h3>
                        <p className="text-xs text-white/80 mt-0.5">View collection</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* mobile arrows */}
            <div className="mt-4 flex md:hidden items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="h-10 w-10 rounded-xl border bg-white hover:bg-zinc-50"
                aria-label="Previous">
                <ArrowLeft className="mx-auto h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="h-10 w-10 rounded-xl border bg-white hover:bg-zinc-50"
                aria-label="Next">
                <ArrowRight className="mx-auto h-4 w-4" />
              </button>
            </div>

            {/* dots */}
            {categories.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {categories.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === active ? "w-7 bg-zinc-900" : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
