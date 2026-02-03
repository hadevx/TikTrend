import { useMemo } from "react";
import { Bell, Heart, Search, ShoppingCart, User2 } from "lucide-react";
import clsx from "clsx";

/**
 * Bright-style ecommerce landing (clone layout)
 * - Top header: logo + search + icons
 * - Hero banner: rounded, green gradient, product + orange + headline
 * - 3 category cards row: image overlay + title + "Start from" + heart
 *
 * Tailwind required.
 * Replace image URLs with your own assets.
 */

export default function BrightEcomClone() {
  const categories = useMemo(
    () => [
      {
        id: "womens-shoe",
        label: "Women's Shoe",
        from: "$45.50",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        tone: "sky",
      },
      {
        id: "cycle-accessories",
        label: "Cycle Accessories",
        from: "$105.00",
        img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
        tone: "dark",
      },
      {
        id: "home-accessories",
        label: "Home Accessories",
        from: "$94.00",
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
        tone: "sky",
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-neutral-900">
      <div className="mx-auto max-w-[1180px] px-4 py-6">
        <Header />

        <Hero />

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} item={c} />
          ))}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------- HEADER -------------------------------- */

function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* Left: burger + brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50">
          <span className="block h-3 w-4 relative">
            <span className="absolute left-0 top-0 h-0.5 w-4 rounded bg-neutral-900" />
            <span className="absolute left-0 top-[6px] h-0.5 w-3 rounded bg-neutral-900" />
            <span className="absolute left-0 top-[12px] h-0.5 w-4 rounded bg-neutral-900" />
          </span>
        </button>

        <div className="font-semibold tracking-tight">
          = <span className="font-bold">Bright.</span>
        </div>
      </div>

      {/* Center: search */}
      <div className="hidden flex-1 md:flex">
        <div className="mx-auto w-full max-w-[520px]">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-200">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              placeholder="Search product, items"
            />
          </div>
        </div>
      </div>

      {/* Right: icons */}
      <div className="flex items-center gap-2">
        <IconBtn label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />
        </IconBtn>

        <IconBtn label="Cart">
          <ShoppingCart className="h-5 w-5" />
        </IconBtn>

        <IconBtn label="Profile">
          <User2 className="h-5 w-5" />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50">
      {children}
    </button>
  );
}

/* -------------------------------- HERO -------------------------------- */

function Hero() {
  const heroBottle =
    "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1000&q=80";
  const heroOrange =
    "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=900&q=80";

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#0f5a4a] via-[#0b4f43] to-[#0a3f37] px-6 py-10 text-white shadow-sm">
        {/* top row inside hero */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-white/70">September 12–22</div>

          <div className="flex items-center gap-2">
            <RoundNavBtn ariaLabel="Previous slide">‹</RoundNavBtn>
            <RoundNavBtn ariaLabel="Next slide">›</RoundNavBtn>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
          {/* left: bottle */}
          <div className="relative hidden lg:block">
            <img
              src={heroBottle}
              alt="Bottle"
              className="mx-auto h-[240px] w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>

          {/* center: text */}
          <div className="text-center">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              Enjoy free home
              <br />
              delivery in this summer
            </h1>

            <p className="mt-3 text-xs font-semibold text-white/70">
              Designer Dresses • Pick from trendy Designer Dress
            </p>

            <button
              type="button"
              className="mt-6 rounded-full bg-[#f28b2e] px-6 py-3 text-xs font-bold text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]">
              Get Started
            </button>
          </div>

          {/* right: orange */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src={heroOrange}
              alt="Orange"
              className="h-[170px] w-[170px] rounded-full object-cover shadow-[0_25px_55px_rgba(0,0,0,0.35)]"
              draggable={false}
            />
          </div>
        </div>

        {/* subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
    </section>
  );
}

function RoundNavBtn({ children, ariaLabel }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/15">
      <span className="text-lg leading-none">{children}</span>
    </button>
  );
}

/* ------------------------------ CATEGORY CARD ------------------------------ */

function CategoryCard({ item }) {
  const overlay =
    item.tone === "dark"
      ? "from-black/80 via-black/35 to-black/10"
      : "from-black/55 via-black/20 to-black/10";

  const frameBg = item.tone === "dark" ? "bg-neutral-900" : "bg-[#b8d6ea]"; // close to the screenshot

  return (
    <button
      type="button"
      className={clsx(
        "group relative w-full overflow-hidden rounded-[22px] shadow-sm ring-1 ring-black/5 transition",
        "hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(0,0,0,0.10)]",
        frameBg,
      )}
      aria-label={`Open ${item.label}`}
      title={item.label}>
      {/* image */}
      <div className="relative aspect-[16/10]">
        <img
          src={item.img}
          alt={item.label}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          draggable={false}
        />
        <div className={clsx("absolute inset-0 bg-gradient-to-t", overlay)} />

        {/* top row: "Start From" + heart */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <div className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            Start From {item.from}
          </div>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/20">
            <Heart className="h-4 w-4" />
          </div>
        </div>

        {/* title */}
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="text-2xl font-bold tracking-tight text-white">{item.label}</h3>
        </div>
      </div>
    </button>
  );
}
