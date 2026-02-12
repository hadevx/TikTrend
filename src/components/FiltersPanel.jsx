import { useMemo } from "react";
import clsx from "clsx";
import { Filter, RefreshCcw, ArrowUpDown } from "lucide-react";

function FiltersPanel({
  compact = false,

  // state
  selectedColors,
  setSelectedColors,
  selectedSubCategory,
  setSelectedSubCategory,
  priceRange,
  setPriceRange,
  sort,
  setSort,
  onlyDiscount,
  setOnlyDiscount,
  onlyInStock,
  setOnlyInStock,

  // data
  products,
  allSubCategories,

  // helpers
  activeFilterCount,
  clearFilters,
  onRefresh,
  onClose,
}) {
  const normalizeColor = (c) =>
    String(c || "")
      .trim()
      .toLowerCase();

  const colorToCss = (raw) => {
    const c = normalizeColor(raw);
    const map = {
      // neutrals
      black: "#111827",
      white: "#ffffff",
      grey: "#9ca3af",
      gray: "#9ca3af",
      darkgray: "#4b5563",
      darkgrey: "#4b5563",
      lightgray: "#e5e7eb",
      lightgrey: "#e5e7eb",
      charcoal: "#1f2937",
      slate: "#64748b",
      offwhite: "#f8fafc",
      ivory: "#fffff0",
      cream: "#fffdd0",
      beige: "#e7d3b1",
      tan: "#d2b48c",
      sand: "#c2b280",
      stone: "#a8a29e",
      taupe: "#8b7d7b",

      // reds / pinks
      red: "#ef4444",
      darkred: "#991b1b",
      maroon: "#7f1d1d",
      burgundy: "#800020",
      crimson: "#dc143c",
      scarlet: "#ff2400",
      coral: "#ff7f50",
      salmon: "#fa8072",
      rose: "#fb7185",
      pink: "#ec4899",
      hotpink: "#ff69b4",
      fuchsia: "#d946ef",
      magenta: "#ff00ff",

      // oranges / yellows
      orange: "#f97316",
      darkorange: "#c2410c",
      amber: "#f59e0b",
      gold: "#d4af37",
      golden: "#d4af37",
      yellow: "#f59e0b",
      lemon: "#facc15",
      mustard: "#d4a017",
      ochre: "#cc7722",

      // greens
      green: "#22c55e",
      darkgreen: "#166534",
      olive: "#556b2f",
      lime: "#84cc16",
      mint: "#98ff98",
      emerald: "#10b981",
      forest: "#228b22",
      sage: "#9caf88",

      // blues
      blue: "#3b82f6",
      navy: "#1f2a44",
      sky: "#0ea5e9",
      lightblue: "#60a5fa",
      darkblue: "#1d4ed8",
      royalblue: "#4169e1",
      cobalt: "#0047ab",
      indigo: "#4f46e5",
      denim: "#1560bd",

      // teals / cyans
      teal: "#14b8a6",
      cyan: "#06b6d4",
      turquoise: "#40e0d0",
      aqua: "#00ffff",

      // purples
      purple: "#a855f7",
      violet: "#8b5cf6",
      lavender: "#e9d5ff",
      plum: "#8e4585",

      // browns
      brown: "#8b5e34",
      chocolate: "#7b3f00",
      coffee: "#6f4e37",
      caramel: "#c68e17",

      // metallics
      silver: "#d1d5db",
      metallicsilver: "#c0c0c0",
      bronze: "#cd7f32",
      copper: "#b87333",

      // “fun” / common names
      peach: "#ffdab9",
      lilac: "#c8a2c8",
      khaki: "#c3b091",
      champagne: "#f7e7ce",
    };

    if (/^#?[0-9a-f]{6}$/i.test(c)) return c.startsWith("#") ? c : `#${c}`;
    return map[c] || c;
  };

  const availableColors = useMemo(() => {
    const set = new Set();
    for (const p of products || []) {
      for (const v of p?.variants || []) {
        if (v?.color) set.add(normalizeColor(v.color));
      }
    }
    return Array.from(set)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [products]);

  const toggleColor = (c) => {
    const key = normalizeColor(c);
    setSelectedColors((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  return (
    <div className={clsx(compact ? "" : "sticky top-[96px]")}>
      <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-800" />
            <h3 className="text-sm font-semibold text-neutral-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition"
              title="Reset all filters">
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-neutral-700">Colors</label>
              {selectedColors?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedColors([])}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900">
                  Clear
                </button>
              )}
            </div>

            {availableColors.length === 0 ? (
              <p className="text-xs text-neutral-500">No colors found.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                {availableColors.map((c) => {
                  const active = selectedColors.includes(c);
                  const cssColor = colorToCss(c);
                  const isWhiteLike = ["#fff", "#ffffff", "white"].includes(
                    String(cssColor).toLowerCase(),
                  );

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleColor(c)}
                      title={c}
                      aria-label={`Filter color ${c}`}
                      className={clsx(
                        "h-10 w-10 rounded-full border transition grid place-items-center flex-none",
                        active
                          ? "border-neutral-900 shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300",
                      )}>
                      <span
                        className={clsx(
                          "h-7 w-7 rounded-full",
                          isWhiteLike ? "ring-1 ring-neutral-200" : "",
                        )}
                        style={{ backgroundColor: cssColor }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="grid gap-2">
            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 hover:bg-neutral-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={(e) => setOnlyDiscount(e.target.checked)}
                className="h-4 w-4"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">Discount only</span>
                <span className="text-xs text-neutral-500">Show products with discount</span>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 hover:bg-neutral-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="h-4 w-4"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">In stock only</span>
                <span className="text-xs text-neutral-500">Hide sold out items</span>
              </div>
            </label>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">Sort</label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/10">
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
                <option value="nameAsc">Name: A → Z</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">Price (KD)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                inputMode="decimal"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500">Leave empty to ignore</p>
          </div>

          {/* Subcategories */}
          {allSubCategories?.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Subcategories
              </label>
              <div className="max-h-[340px] overflow-auto pr-1">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory("all")}
                    className={clsx(
                      "w-full text-left rounded-2xl px-3 py-2 text-sm border transition",
                      selectedSubCategory === "all"
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
                    )}>
                    All
                  </button>

                  {allSubCategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub.id)}
                      title={sub.displayName}
                      className={clsx(
                        "w-full text-left rounded-2xl px-3 py-2 text-sm border transition",
                        selectedSubCategory === sub.id
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
                      )}>
                      {sub.displayName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {compact ? (
            <button
              type="button"
              onClick={() => onClose?.()}
              className="w-full rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
              Show results
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRefresh?.()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FiltersPanel;
