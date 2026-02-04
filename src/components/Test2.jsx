import React, { useMemo, useState } from "react";

/**
 * Ecommerce Dashboard (Tailwind) — “Control Center” inspired
 * ---------------------------------------------------------
 * ✅ Single-file React component
 * ✅ Tailwind-only styling (no external libs)
 * ✅ Functional UI: search, filters, cart drawer, quantity controls
 *
 * Usage:
 * - Drop into src/App.jsx (Vite/CRA/Next)
 * - Ensure Tailwind is configured
 */

export default function App() {
  const initialProducts = useMemo(
    () => [
      {
        id: "p1",
        name: "Neon Horizon Hoodie",
        brand: "Koi Studio",
        price: 74,
        rating: 4.7,
        reviews: 128,
        stock: 34,
        category: "Apparel",
        color: "Midnight",
        badge: "Bestseller",
        img: placeholder("Neon Hoodie"),
      },
      {
        id: "p2",
        name: "Orbit Running Shoes",
        brand: "Astra",
        price: 129,
        rating: 4.5,
        reviews: 86,
        stock: 12,
        category: "Footwear",
        color: "Cloud",
        badge: "Low stock",
        img: placeholder("Orbit Shoes"),
      },
      {
        id: "p3",
        name: "Pulse Wireless Earbuds",
        brand: "Volt",
        price: 99,
        rating: 4.6,
        reviews: 302,
        stock: 58,
        category: "Electronics",
        color: "Graphite",
        badge: "Trending",
        img: placeholder("Pulse Buds"),
      },
      {
        id: "p4",
        name: "Arc Desk Lamp",
        brand: "Lumen",
        price: 59,
        rating: 4.4,
        reviews: 41,
        stock: 22,
        category: "Home",
        color: "Sand",
        badge: "New",
        img: placeholder("Arc Lamp"),
      },
      {
        id: "p5",
        name: "Sway Yoga Mat",
        brand: "Flow",
        price: 42,
        rating: 4.8,
        reviews: 210,
        stock: 90,
        category: "Fitness",
        color: "Ocean",
        badge: "Top rated",
        img: placeholder("Yoga Mat"),
      },
      {
        id: "p6",
        name: "Drift Sunglasses",
        brand: "Sol",
        price: 68,
        rating: 4.3,
        reviews: 54,
        stock: 9,
        category: "Accessories",
        color: "Onyx",
        badge: "Low stock",
        img: placeholder("Sunglasses"),
      },
    ],
    [],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [darkMode, setDarkMode] = useState(true); // matches the “control center” vibe
  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState([
    { id: "p1", qty: 1 },
    { id: "p3", qty: 2 },
  ]);

  const categories = useMemo(
    () => ["All", ...new Set(initialProducts.map((p) => p.category))],
    [initialProducts],
  );

  const products = useMemo(() => {
    let list = [...initialProducts];

    if (category !== "All") list = list.filter((p) => p.category === category);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.color} ${p.badge}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sort === "Price: Low") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High") list.sort((a, b) => b.price - a.price);
    if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "Stock") list.sort((a, b) => b.stock - a.stock);

    return list;
  }, [initialProducts, category, query, sort]);

  const cartItems = useMemo(() => {
    const map = new Map(initialProducts.map((p) => [p.id, p]));
    return cart
      .map((c) => {
        const p = map.get(c.id);
        if (!p) return null;
        return { ...p, qty: c.qty, line: c.qty * p.price };
      })
      .filter(Boolean);
  }, [cart, initialProducts]);

  const cartSubtotal = useMemo(() => cartItems.reduce((sum, it) => sum + it.line, 0), [cartItems]);
  const shipping = cartSubtotal > 120 ? 0 : cartSubtotal > 0 ? 8 : 0;
  const tax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const cartTotal = Math.round((cartSubtotal + shipping + tax) * 100) / 100;

  function addToCart(productId) {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === productId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + 1, 99) };
        return next;
      }
      return [...prev, { id: productId, qty: 1 }];
    });
    setCartOpen(true);
  }

  function setQty(productId, qty) {
    const safe = Math.max(1, Math.min(99, qty));
    setCart((prev) => prev.map((x) => (x.id === productId ? { ...x, qty: safe } : x)));
  }

  function decQty(productId) {
    setCart((prev) =>
      prev.map((x) => (x.id === productId ? { ...x, qty: x.qty - 1 } : x)).filter((x) => x.qty > 0),
    );
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((x) => x.id !== productId));
  }

  const shellBg = darkMode
    ? "bg-gradient-to-b from-neutral-200 to-neutral-300"
    : "bg-gradient-to-b from-neutral-100 to-neutral-200";

  return (
    <div className={`min-h-screen w-full ${shellBg} p-6 flex items-center justify-center`}>
      <div className="w-[1100px] max-w-full">
        {/* Top bar */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-black shadow-[0_12px_40px_rgba(0,0,0,0.18)] grid place-items-center">
              <BagIcon className="text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-900">Store Console</div>
              <div className="text-sm text-neutral-600">
                Ecommerce dashboard • Orders • Inventory • Customers
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
              <SearchIcon className="text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="w-[320px] bg-transparent outline-none text-sm text-neutral-900 placeholder:text-neutral-500"
              />
              {query ? (
                <button
                  onClick={() => setQuery("")}
                  className="h-7 w-7 rounded-full bg-neutral-100 grid place-items-center">
                  <XIcon className="text-neutral-700" />
                </button>
              ) : null}
            </div>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className="rounded-2xl bg-black text-white px-4 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] text-sm font-semibold">
              {darkMode ? "Dark Panels" : "Dark Panels"}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="rounded-2xl bg-white px-4 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.12)] text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <CartIcon className="text-neutral-900" />
              Cart
              <span className="ml-1 rounded-full bg-neutral-900 text-white text-xs px-2 py-0.5">
                {cart.reduce((n, x) => n + x.qty, 0)}
              </span>
            </button>
          </div>

          {/* mobile search */}
          <div className="md:hidden flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
            <SearchIcon className="text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent outline-none text-sm text-neutral-900 placeholder:text-neutral-500"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="h-7 w-7 rounded-full bg-neutral-100 grid place-items-center">
                <XIcon className="text-neutral-700" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: KPIs + actions */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-12 gap-4">
            <Panel dark={darkMode} className="col-span-6 h-[170px]">
              <KPI
                title="Revenue"
                value="$94,100"
                sub="+8.2% vs last week"
                chip="Live"
                icon={<TrendUpIcon />}
                gradient="from-amber-400/90 via-sky-500/90 to-rose-500/90"
              />
            </Panel>

            <Panel dark={darkMode} className="col-span-3 h-[170px]">
              <MiniDial title="Conversion" value="3.4%" hint="Today" />
            </Panel>

            <Panel dark={darkMode} className="col-span-3 h-[170px]">
              <MiniDial title="Returns" value="1.1%" hint="7 days" />
            </Panel>

            <Panel dark={darkMode} className="col-span-7 h-[170px]">
              <SplitToggles />
            </Panel>

            <Panel dark={darkMode} className="col-span-5 h-[170px]">
              <StockMeter title="Inventory Health" value="78%" bars={5} filled={4} />
            </Panel>

            <Panel dark={darkMode} className="col-span-12 h-[200px]">
              <Tasks />
            </Panel>
          </div>

          {/* CENTER: Products */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-12 gap-4">
            <Panel dark={darkMode} className="col-span-12 h-[110px]">
              <Filters
                categories={categories}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                dark={darkMode}
              />
            </Panel>

            <div className="col-span-12 grid grid-cols-12 gap-4">
              {products.map((p) => (
                <Panel key={p.id} dark={darkMode} className="col-span-12 md:col-span-6 h-[220px]">
                  <ProductCard product={p} onAdd={() => addToCart(p.id)} />
                </Panel>
              ))}
              {products.length === 0 ? (
                <Panel dark={darkMode} className="col-span-12 h-[140px]">
                  <div
                    className={`h-full rounded-[28px] ${darkMode ? "bg-black text-white" : "bg-white text-neutral-900"} p-5 flex items-center justify-between`}>
                    <div>
                      <div className="text-lg font-semibold">No results</div>
                      <div className={darkMode ? "text-white/60" : "text-neutral-600"}>
                        Try a different search or filter.
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setQuery("");
                        setCategory("All");
                        setSort("Featured");
                      }}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold ${darkMode ? "bg-white text-black" : "bg-black text-white"}`}>
                      Reset
                    </button>
                  </div>
                </Panel>
              ) : null}
            </div>
          </div>

          {/* RIGHT: Orders + Now shipping */}
          <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
            <Panel dark={false} className="col-span-12 h-[220px]">
              <NowShipping />
            </Panel>

            <Panel dark={darkMode} className="col-span-12 h-[80px]">
              <QuickAction dark={darkMode} />
            </Panel>

            <Panel dark={false} className="col-span-12 h-[270px]">
              <Orders />
            </Panel>

            <Panel dark={darkMode} className="col-span-12 h-[170px]">
              <Support dark={darkMode} />
            </Panel>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-600">
          Tailwind tip: adjust sizes in{" "}
          <span className="font-mono">w-[...] / h-[...] / rounded-[...]</span> for your exact brand
          UI.
        </div>
      </div>

      {/* Cart Drawer */}
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold text-neutral-900">Cart</div>
              <div className="text-sm text-neutral-600">{cartItems.length} items</div>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="h-10 w-10 rounded-full bg-neutral-100 grid place-items-center">
              <XIcon className="text-neutral-900" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                Your cart is empty.
              </div>
            ) : (
              cartItems.map((it) => (
                <div key={it.id} className="rounded-2xl bg-neutral-50 p-4 flex gap-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{it.name}</div>
                        <div className="text-xs text-neutral-500">
                          {it.brand} • {it.color}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(it.id)}
                        className="text-xs font-semibold text-neutral-900 hover:underline">
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decQty(it.id)}
                          className="h-9 w-9 rounded-full bg-white shadow-sm grid place-items-center">
                          <MinusIcon className="text-neutral-900" />
                        </button>
                        <input
                          value={it.qty}
                          onChange={(e) => setQty(it.id, Number(e.target.value || 1))}
                          className="h-9 w-14 rounded-2xl bg-white shadow-sm text-center text-sm font-semibold text-neutral-900 outline-none"
                        />
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="h-9 w-9 rounded-full bg-white shadow-sm grid place-items-center">
                          <PlusIcon className="text-neutral-900" />
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-neutral-900">
                        ${money(it.line)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-5 rounded-2xl bg-neutral-900 p-4 text-white">
            <Row label="Subtotal" value={`$${money(cartSubtotal)}`} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : `$${money(shipping)}`} />
            <Row label="Tax" value={`$${money(tax)}`} />
            <div className="my-3 h-px bg-white/15" />
            <Row label="Total" value={`$${money(cartTotal)}`} strong />
            <button
              disabled={cartItems.length === 0}
              className={`mt-4 w-full rounded-2xl py-3 text-sm font-semibold ${
                cartItems.length === 0 ? "bg-white/20 text-white/60" : "bg-white text-black"
              }`}>
              Checkout
            </button>
            <div className="mt-2 text-xs text-white/60">Free shipping over $120</div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

/* -------------------------------- Components ------------------------------- */

function Panel({ dark, className = "", children }) {
  return (
    <div className={`rounded-[32px] bg-transparent ${className}`}>
      <div className="h-full w-full rounded-[32px] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        {children}
      </div>
    </div>
  );
}

function KPI({ title, value, sub, chip, icon, gradient }) {
  return (
    <div className="h-full rounded-[28px] bg-black text-white p-5 relative overflow-hidden">
      <div
        className={`absolute -left-10 -bottom-12 h-[160px] w-[240px] rounded-tr-[70px] bg-gradient-to-r ${gradient}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-white/55">{title}</div>
          <div className="mt-2 text-3xl font-semibold leading-none">{value}</div>
          <div className="mt-2 text-sm text-white/65">{sub}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{chip}</div>
          <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center">{icon}</div>
        </div>
      </div>
    </div>
  );
}

function MiniDial({ title, value, hint }) {
  return (
    <div className="h-full rounded-[28px] bg-black text-white p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-white/55">{title}</div>
        <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">
          <DotIcon className="text-white" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold leading-none">{value}</div>
        <div className="mt-2 text-xs text-white/60">{hint}</div>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-[65%] bg-white/60 rounded-full" />
      </div>
    </div>
  );
}

function SplitToggles() {
  return (
    <div className="h-full rounded-[28px] bg-black p-5 text-white">
      <div className="flex items-center gap-3">
        <Segment>Paused</Segment>
        <Segment active>Live</Segment>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <MetricCard title="Abandoned Carts" value="23" hint="Last hour" />
        <MetricCard title="Avg. Order Value" value="$62.40" hint="7 days" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <div className="text-[11px] uppercase tracking-wide text-white/55">{title}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/60">{hint}</div>
    </div>
  );
}

function Segment({ active = false, children }) {
  return (
    <div
      className={[
        "px-4 py-2 rounded-full border text-sm font-semibold",
        active ? "bg-white text-black border-white/30" : "bg-black text-white border-white/15",
      ].join(" ")}>
      {children}
    </div>
  );
}

function StockMeter({ title, value, bars = 5, filled = 3 }) {
  return (
    <div className="h-full rounded-[28px] bg-black p-5 text-white flex flex-col justify-between">
      <div className="text-[11px] uppercase tracking-wide text-white/55">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="flex gap-2">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-10 w-6 rounded-lg ${i < filled ? "bg-emerald-500" : "bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Tasks() {
  return (
    <div className="h-full rounded-[28px] bg-black p-5 text-white">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Today</div>
        <div className="h-7 w-7 rounded-full bg-white/10 grid place-items-center text-xs">6</div>
      </div>

      <div className="mt-4 space-y-3">
        <TaskDot color="bg-purple-500" label="Review supplier invoice" />
        <TaskDot color="bg-sky-400" label="Confirm promo banner copy" />
        <TaskDot color="bg-pink-400" label="Reply to 3 support tickets" />
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-white/55">
        <span>01</span>
        <span>0:17</span>
      </div>

      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-[22%] bg-white/60 rounded-full" />
      </div>
    </div>
  );
}

function TaskDot({ color, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-sm text-white/80">{label}</span>
    </div>
  );
}

function Filters({ categories, category, setCategory, sort, setSort, dark }) {
  return (
    <div
      className={`h-full rounded-[28px] ${dark ? "bg-black text-white" : "bg-white text-neutral-900"} p-5`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div
            className={`text-[11px] uppercase tracking-wide ${dark ? "text-white/55" : "text-neutral-500"}`}>
            Products
          </div>
          <div className="text-lg font-semibold">Catalog</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`h-10 rounded-2xl px-3 text-sm font-semibold outline-none ${
              dark ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-900"
            }`}>
            {categories.map((c) => (
              <option key={c} value={c} className="text-neutral-900">
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`h-10 rounded-2xl px-3 text-sm font-semibold outline-none ${
              dark ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-900"
            }`}>
            {["Featured", "Price: Low", "Price: High", "Rating", "Stock"].map((s) => (
              <option key={s} value={s} className="text-neutral-900">
                {s}
              </option>
            ))}
          </select>

          <button
            className={`h-10 rounded-2xl px-3 text-sm font-semibold flex items-center gap-2 ${
              dark ? "bg-white text-black" : "bg-black text-white"
            }`}>
            <PlusIcon className={dark ? "text-black" : "text-white"} />
            New
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const badgeTone = badgeToneClass(product.badge);
  return (
    <div className="h-full rounded-[28px] bg-black p-5 text-white flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-white/60">{product.brand}</div>
          <div className="text-lg font-semibold leading-tight truncate">{product.name}</div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeTone}`}>
              {product.badge}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              {product.category}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              {product.color}
            </span>
          </div>
        </div>

        <div className="h-16 w-16 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center">
          <img src={product.img} alt={product.name} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">${product.price}</div>
          <div className="mt-1 text-xs text-white/60">
            <span className="inline-flex items-center gap-1">
              <StarIcon className="text-white" />
              {product.rating}
            </span>{" "}
            • {product.reviews} reviews •{" "}
            <span className={product.stock <= 12 ? "text-orange-300" : "text-emerald-300"}>
              {product.stock} in stock
            </span>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-semibold shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          Add
        </button>
      </div>

      <div className="mt-auto pt-4">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-[68%] bg-white/70 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function NowShipping() {
  return (
    <div className="h-full rounded-[28px] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-neutral-500">Now Shipping</div>
          <div className="text-sm font-semibold text-neutral-900">Neon Horizon Hoodie</div>
          <div className="mt-1 text-xs text-neutral-500">Order #10482 • USPS Priority</div>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-neutral-100 overflow-hidden flex items-center justify-center">
          <VinylIcon />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-900 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Packed</div>
          <div className="text-xs text-white/60">ETA 2–3 days</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full w-[72%] bg-white rounded-full" />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-white/70">
          <span>Label created</span>
          <span>Out for delivery</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="h-10 flex-1 rounded-2xl bg-neutral-100 text-neutral-900 text-sm font-semibold">
          View order
        </button>
        <button className="h-10 w-10 rounded-2xl bg-neutral-900 grid place-items-center">
          <ArrowRightIcon className="text-white" />
        </button>
      </div>
    </div>
  );
}

function QuickAction({ dark }) {
  return (
    <div
      className={`h-full rounded-[28px] ${dark ? "bg-black" : "bg-white"} px-6 flex items-center justify-between`}>
      <div className={`text-sm font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>
        Promo Mode
      </div>
      <div
        className={`h-9 w-9 rounded-full ${dark ? "bg-white/10" : "bg-neutral-100"} grid place-items-center`}>
        <BoltIcon className={dark ? "text-white" : "text-neutral-900"} />
      </div>
    </div>
  );
}

function Orders() {
  const rows = [
    {
      id: "10488",
      name: "Pulse Earbuds",
      time: "10:20 AM",
      status: "Paid",
      tone: "bg-emerald-500/15 text-emerald-700",
    },
    {
      id: "10487",
      name: "Orbit Shoes",
      time: "9:50 AM",
      status: "Packed",
      tone: "bg-sky-500/15 text-sky-700",
    },
    {
      id: "10486",
      name: "Arc Lamp",
      time: "9:05 AM",
      status: "Refund",
      tone: "bg-rose-500/15 text-rose-700",
    },
    {
      id: "10485",
      name: "Sway Yoga Mat",
      time: "8:44 AM",
      status: "Paid",
      tone: "bg-emerald-500/15 text-emerald-700",
    },
  ];

  return (
    <div className="h-full rounded-[28px] bg-white p-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-neutral-500">Orders</div>
          <div className="text-3xl font-semibold text-neutral-900 leading-none">22</div>
        </div>
        <div className="text-xs text-neutral-500">6 pending</div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-neutral-900 p-4 text-white">
          <div className="text-sm font-semibold">Deep Focus: Fulfillment</div>
          <div className="mt-1 text-xs text-white/60">9:00 AM – 11:00 AM</div>
        </div>

        {rows.map((r, idx) => (
          <div key={r.id} className="rounded-2xl bg-neutral-50 p-4 relative overflow-hidden">
            {idx === 2 ? (
              <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-red-500/70" />
            ) : null}
            <div className="flex items-start justify-between gap-3 relative">
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  #{r.id} • {r.name}
                </div>
                <div className="mt-1 text-xs text-neutral-500">{r.time}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.tone}`}>
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Support({ dark }) {
  return (
    <div
      className={`h-full rounded-[28px] ${dark ? "bg-black text-white" : "bg-white text-neutral-900"} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-[11px] uppercase tracking-wide ${dark ? "text-white/55" : "text-neutral-500"}`}>
            Support
          </div>
          <div className="text-lg font-semibold">Inbox</div>
        </div>
        <div
          className={`h-10 w-10 rounded-2xl ${dark ? "bg-white/10" : "bg-neutral-100"} grid place-items-center`}>
          <ChatIcon className={dark ? "text-white" : "text-neutral-900"} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <SupportRow dark={dark} dot="bg-purple-500" title="Where is my order?" time="8m" />
        <SupportRow dark={dark} dot="bg-sky-400" title="Change shipping address" time="21m" />
        <SupportRow dark={dark} dot="bg-pink-400" title="Refund request" time="1h" />
      </div>

      <button
        className={`mt-4 w-full rounded-2xl py-2.5 text-sm font-semibold ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
        Open inbox
      </button>
    </div>
  );
}

function SupportRow({ dark, dot, title, time }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-3 py-2 ${dark ? "bg-white/10" : "bg-neutral-100"}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span
          className={`text-sm font-semibold truncate ${dark ? "text-white/85" : "text-neutral-900"}`}>
          {title}
        </span>
      </div>
      <span className={`text-xs ${dark ? "text-white/60" : "text-neutral-500"}`}>{time}</span>
    </div>
  );
}

/* ------------------------------- Drawer UI -------------------------------- */

function Drawer({ open, onClose, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={[
          "absolute right-0 top-0 h-full w-[420px] max-w-[92vw] bg-white shadow-[0_30px_120px_rgba(0,0,0,0.35)] transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={strong ? "text-white font-semibold" : "text-white/70"}>{label}</span>
      <span className={strong ? "text-white font-semibold" : "text-white/70"}>{value}</span>
    </div>
  );
}

/* --------------------------------- Utils ---------------------------------- */

function money(n) {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function badgeToneClass(badge) {
  const b = String(badge || "").toLowerCase();
  if (b.includes("best")) return "bg-amber-400/20 text-amber-200";
  if (b.includes("trend")) return "bg-sky-500/20 text-sky-200";
  if (b.includes("low")) return "bg-orange-500/20 text-orange-200";
  if (b.includes("new")) return "bg-emerald-500/20 text-emerald-200";
  if (b.includes("top")) return "bg-purple-500/20 text-purple-200";
  return "bg-white/10 text-white/80";
}

/**
 * Inline “image” placeholder using SVG data URL
 * (so the code runs without any assets)
 */
function placeholder(label) {
  const svg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#0b0b0b"/>
        <stop offset="1" stop-color="#1f2937"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" rx="32" fill="url(#g)"/>
    <circle cx="198" cy="62" r="22" fill="rgba(255,255,255,0.10)"/>
    <circle cx="198" cy="62" r="10" fill="#3b82f6"/>
    <text x="24" y="132" fill="rgba(255,255,255,0.88)" font-family="Inter, ui-sans-serif" font-size="20" font-weight="700">${escapeXml(
      label,
    )}</text>
    <text x="24" y="162" fill="rgba(255,255,255,0.55)" font-family="Inter, ui-sans-serif" font-size="14">Product preview</text>
  </svg>`);
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function escapeXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------------------------- Icons ---------------------------------- */

function IconBase({ className = "", children }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className}>
      {children}
    </svg>
  );
}

function BagIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M6 9h12l-1 12H7L6 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </IconBase>
  );
}

function CartIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M6 6h15l-2 9H8L6 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="M18 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
    </IconBase>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

function XIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

function PlusIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

function MinusIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function StarIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path
        d="m12 3 2.6 5.6 6 .9-4.3 4.2 1 6-5.3-3-5.3 3 1-6L3.4 9.5l6-.9L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function TrendUpIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path
        d="M3 17l6-6 4 4 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function DotIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path d="M12 12h.01" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </IconBase>
  );
}

function BoltIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path
        d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function ChatIcon({ className = "" }) {
  return (
    <IconBase className={className}>
      <path
        d="M21 14a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function VinylIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#0B0B0B" />
      <circle cx="32" cy="32" r="20" fill="#111" />
      <circle cx="32" cy="32" r="12" fill="#0B0B0B" />
      <circle cx="32" cy="32" r="4" fill="#3B82F6" />
      <path d="M32 4a28 28 0 0 1 28 28" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
    </svg>
  );
}
