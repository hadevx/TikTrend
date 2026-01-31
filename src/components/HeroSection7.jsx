import React, { useMemo, useState } from "react";

/**
 * Responsive eCommerce Landing + Collections section
 * Tailwind required.
 */

const CATEGORIES = ["All", "Sneakers", "Hoodies", "Watches", "Bags"];

const COLLECTIONS = [
  {
    id: "c1",
    title: "New Season Essentials",
    subtitle: "Fresh drops • limited restock",
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c0ea2b6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c2",
    title: "Streetwear Staples",
    subtitle: "Hoodies • tees • everyday fit",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c3",
    title: "Minimal Accessories",
    subtitle: "Watches • bags • essentials",
    tag: "Curated",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "c4",
    title: "Under $100",
    subtitle: "Best value picks",
    tag: "Deal",
    image:
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=1400&q=80",
  },
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Aero Runner Pro",
    brand: "AER",
    price: 129,
    compareAt: 159,
    rating: 4.7,
    reviews: 1820,
    category: "Sneakers",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p2",
    name: "Cloud Street",
    brand: "NOVA",
    price: 99,
    compareAt: 129,
    rating: 4.5,
    reviews: 940,
    category: "Sneakers",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c0ea2b6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p3",
    name: "Everyday Hoodie",
    brand: "CORE",
    price: 68,
    compareAt: 84,
    rating: 4.6,
    reviews: 1260,
    category: "Hoodies",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1520975869010-5951d35fce97?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p4",
    name: "Minimal Timepiece",
    brand: "NOON",
    price: 149,
    compareAt: 189,
    rating: 4.4,
    reviews: 510,
    category: "Watches",
    badge: "Limited",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p5",
    name: "Metro Sling Bag",
    brand: "URB",
    price: 54,
    compareAt: 69,
    rating: 4.3,
    reviews: 330,
    category: "Bags",
    badge: "Value",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p6",
    name: "Heritage Backpack",
    brand: "FIELD",
    price: 89,
    compareAt: 109,
    rating: 4.5,
    reviews: 770,
    category: "Bags",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p7",
    name: "Cozy Zip Hoodie",
    brand: "CORE",
    price: 74,
    compareAt: 92,
    rating: 4.6,
    reviews: 610,
    category: "Hoodies",
    badge: "Soft",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "p8",
    name: "Sport Chrono",
    brand: "NOON",
    price: 199,
    compareAt: 249,
    rating: 4.7,
    reviews: 290,
    category: "Watches",
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1400&q=80",
  },
];

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6l-2 0" />
      <path d="M9 20a1 1 0 100-2 1 1 0 000 2z" />
      <path d="M18 20a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <path d="M10 7h7v7" />
    </svg>
  );
}

function StarRow({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} className="inline-flex">
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${isFull || isHalf ? "text-amber-400" : "text-white/20"}`}
              fill={isFull ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.75.75 0 011.04 0l2.64 2.62c.18.18.41.3.66.35l3.66.7a.75.75 0 01.41 1.28l-2.6 2.58a1.2 1.2 0 00-.34.76l.5 3.65a.75.75 0 01-1.09.8l-3.28-1.72a1.2 1.2 0 00-.86 0l-3.28 1.72a.75.75 0 01-1.09-.8l.5-3.65a1.2 1.2 0 00-.34-.76l-2.6-2.58a.75.75 0 01.41-1.28l3.66-.7c.25-.05.48-.17.66-.35l2.64-2.62z"
              />
              {isHalf && (
                <path
                  d="M12 4.1v14.2l-2.9 1.52.44-3.2a1.95 1.95 0 00-.56-1.5L6.7 12.7l3.2-.62c.4-.08.77-.27 1.06-.56L12 4.1z"
                  fill="currentColor"
                  opacity="0.95"
                  stroke="none"
                />
              )}
            </svg>
          </span>
        );
      })}
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold transition",
        active
          ? "bg-lime-300 text-black shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
          : "bg-white/5 text-white/75 hover:bg-white/10",
      ].join(" ")}>
      {children}
    </button>
  );
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:bg-white/10">
      {children}
    </button>
  );
}

function CollectionCard({ item }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-48"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-black">
          {item.tag}
        </div>
      </div>

      <div className="p-4">
        <div className="text-base font-semibold text-white">{item.title}</div>
        <div className="mt-1 text-xs text-white/60">{item.subtitle}</div>

        <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15">
          Shop collection <ArrowUpRight />
        </button>
      </div>
    </div>
  );
}

export default function EcommerceInfluencerCloneWithCollections() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured"); // featured | price-asc | price-desc
  const [cart, setCart] = useState(() => new Map());
  const [likes, setLikes] = useState(() => new Set());

  const cartCount = useMemo(() => {
    let c = 0;
    cart.forEach((qty) => (c += qty));
    return c;
  }, [cart]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = PRODUCTS.filter((p) => {
      const inCategory = category === "All" ? true : p.category === category;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return inCategory && inQuery;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [query, category, sort]);

  const addToCart = (id) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) || 0) + 1);
      return next;
    });
  };

  const toggleLike = (id) => {
    setLikes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        {/* NAV */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-bold">WX</span>
            </div>
            <div className="hidden items-center gap-5 text-sm text-white/70 md:flex">
              <span className="font-semibold text-white">Home</span>
              <span className="cursor-pointer hover:text-white">Shop</span>
              <span className="cursor-pointer hover:text-white">Deals</span>
              <span className="cursor-pointer hover:text-white">Orders</span>
              <span className="cursor-pointer hover:text-white">Support</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10 sm:block">
              London, UK
            </div>

            <IconButton label="Wishlist">
              <HeartIcon />
            </IconButton>

            <IconButton label="Cart">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-lime-300 px-1 text-[11px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </IconButton>

            <img
              src="https://i.pravatar.cc/40?img=5"
              alt="Profile"
              className="h-10 w-10 rounded-full ring-1 ring-white/15"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* HERO */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Find{" "}
              <span className="inline-flex items-center gap-2">
                products
                <span className="rounded-full border border-white/20 bg-white/5 px-2 py-1 text-sm">
                  <SearchIcon />
                </span>
              </span>
              <br />
              you’ll actually love
            </h1>

            <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-white/60">
              Search, filter, and shop from curated collections. Clean layout, responsive grid, and
              product cards built for eCommerce.
            </p>

            {/* Search bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <SearchIcon />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sneakers, hoodies, watches..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </div>

              <button className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(163,230,53,0.25)] transition hover:opacity-90">
                Browse deals
              </button>
            </div>

            {/* Filters row */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c} active={c === category} onClick={() => setCategory(c)}>
                    {c}
                  </Chip>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10 outline-none">
                  <option value="featured" className="bg-[#0E0E0E]">
                    Featured
                  </option>
                  <option value="price-asc" className="bg-[#0E0E0E]">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-[#0E0E0E]">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* CTA CARD (lime) */}
          <div className="relative overflow-hidden rounded-3xl bg-lime-300 p-6 text-black shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-black/60">Today’s drop</div>
                <div className="mt-2 text-2xl font-semibold leading-tight">
                  Limited-time
                  <br />
                  bundles
                </div>
              </div>
              <div className="rounded-2xl bg-black/10 p-2">
                <ArrowUpRight />
              </div>
            </div>

            <p className="mt-3 text-sm text-black/70">
              Save up to <span className="font-semibold">35%</span> on curated sets.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                {
                  img: "https://images.unsplash.com/photo-1528701800489-20be3c0ea2b6?auto=format&fit=crop&w=600&q=80",
                  label: "Sneakers",
                },
                {
                  img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
                  label: "Hoodies",
                },
                {
                  img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
                  label: "Watches",
                },
              ].map((x) => (
                <div key={x.label} className="rounded-2xl bg-white/35 p-2">
                  <img
                    src={x.img}
                    alt={x.label}
                    className="h-16 w-full rounded-xl object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-2 text-xs font-semibold">{x.label}</div>
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-14 -right-14 h-44 w-44 rounded-full border border-black/20" />
          </div>
        </div>

        {/* COLLECTIONS SECTION */}
        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs text-white/50">Collections</div>
              <div className="text-lg font-semibold">Shop by vibe</div>
            </div>

            <button className="hidden rounded-xl bg-white/5 px-4 py-2 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 sm:inline-flex">
              View all collections
            </button>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((c) => (
              <CollectionCard key={c.id} item={c} />
            ))}
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs text-white/50">Recommended</div>
            <div className="text-lg font-semibold">Top picks for you</div>
          </div>
          <button className="hidden rounded-xl bg-white/5 px-4 py-2 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 sm:inline-flex">
            View all products
          </button>
        </div>

        {/* GRID */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Purple promo tile (kept) */}
          <div className="relative overflow-hidden rounded-3xl bg-[#8B6CFF] p-5 text-white ring-1 ring-white/10 sm:col-span-2 lg:col-span-1">
            <div className="text-xs text-white/70">Collections</div>
            <div className="mt-2 text-2xl font-semibold leading-tight">
              View All
              <br />
              products
            </div>
            <div className="mt-1 text-xs text-white/70">{PRODUCTS.length} items</div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[21, 28, 35].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/64?img=${i}`}
                    alt="Customer"
                    className="h-9 w-9 rounded-full border-2 border-[#8B6CFF] object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <span className="text-xs text-white/70">12k happy customers</span>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90">
              Explore catalog
            </button>

            <div className="pointer-events-none absolute -bottom-8 -left-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full border border-white/25" />
          </div>

          {filtered.map((p) => {
            const isLiked = likes.has(p.id);
            const discount = Math.max(0, Math.round(((p.compareAt - p.price) / p.compareAt) * 100));

            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-black">
                      {p.badge}
                    </span>
                    {discount > 0 && (
                      <span className="rounded-full bg-lime-300 px-2 py-0.5 text-[11px] font-bold text-black">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleLike(p.id)}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-black/45 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-black/55"
                    aria-label="Toggle wishlist">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
                    </svg>
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-white/55">{p.brand}</div>
                      <div className="truncate text-base font-semibold text-white">{p.name}</div>
                    </div>
                    <div className="shrink-0 rounded-2xl bg-white/5 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10">
                      {p.category}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <StarRow rating={p.rating} />
                    <span className="text-xs text-white/55">
                      {p.rating.toFixed(1)} ({p.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white">{formatMoney(p.price)}</div>
                      <div className="text-xs text-white/45 line-through">
                        {formatMoney(p.compareAt)}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(p.id)}
                      className="rounded-2xl bg-lime-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(163,230,53,0.18)] transition hover:opacity-90">
                      Add
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div className="text-[10px] text-white/45">Shipping</div>
                      <div className="text-xs font-semibold text-white">Free</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div className="text-[10px] text-white/45">Return</div>
                      <div className="text-xs font-semibold text-white">30d</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                      <div className="text-[10px] text-white/45">Stock</div>
                      <div className="text-xs font-semibold text-white">Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM METRIC */}
        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Up to <span className="text-6xl sm:text-7xl">45%</span>
          </div>

          <p className="max-w-[560px] text-sm leading-relaxed text-white/60">
            Shop faster with curated collections and smart filters. Compare deals instantly, and add
            favorites to cart in one click.
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/45">
          © {new Date().getFullYear()} Webxio Shop — Demo UI clone (eCommerce adaptation)
        </div>
      </div>
    </div>
  );
}
