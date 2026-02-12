// src/pages/SaleProducts/SaleProducts.jsx
import Layout from "../../Layout";
import { motion } from "framer-motion";
import { useGetSaleProductsQuery, useGetCategoriesTreeQuery } from "../../redux/queries/productApi";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import Pagination from "../../components/Paginations";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, RefreshCcw, Tag } from "lucide-react";
import FiltersPanel from "../../components/FiltersPanel";

function SaleProducts() {
  // ----------------------------
  // UI state
  // ----------------------------
  const [page, setPage] = useState(1);
  const [limit] = useState(30);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDraft, setSearchDraft] = useState("");

  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedColors, setSelectedColors] = useState([]); // normalized e.g. ["black","red"]

  const [showFilters, setShowFilters] = useState(false);

  const [sort, setSort] = useState("newest"); // newest | priceAsc | priceDesc | nameAsc
  const [onlyInStock, setOnlyInStock] = useState(false);

  // ----------------------------
  // Debounce search
  // ----------------------------
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchDraft.trim()), 300);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, priceRange.min, priceRange.max, onlyInStock, sort, selectedColors]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // ----------------------------
  // Map UI sort -> API sort/order
  // ----------------------------
  const { apiSort, apiOrder } = useMemo(() => {
    switch (sort) {
      case "priceAsc":
        return { apiSort: "price", apiOrder: "asc" };
      case "priceDesc":
        return { apiSort: "price", apiOrder: "desc" };
      case "nameAsc":
        return { apiSort: "name", apiOrder: "asc" };
      case "newest":
      default:
        return { apiSort: "createdAt", apiOrder: "desc" };
    }
  }, [sort]);

  // ----------------------------
  // Queries
  // ----------------------------
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  // IMPORTANT:
  // If your sale endpoint supports these params, great.
  // If not, the UI still works via local fallback filters below.
  const queryArgs = useMemo(
    () => ({
      pageNumber: page,
      keyword: searchTerm,
      limit,

      sort: apiSort,
      order: apiOrder,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,

      // backend expects "true"
      inStock: onlyInStock ? "true" : undefined,

      // "red,black"
      color: selectedColors.length ? selectedColors.join(",") : undefined,
    }),
    [
      page,
      searchTerm,
      limit,
      apiSort,
      apiOrder,
      priceRange.min,
      priceRange.max,
      onlyInStock,
      selectedColors,
    ],
  );

  const {
    data: saleData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSaleProductsQuery(queryArgs);

  const products = saleData?.products || [];
  const pages = saleData?.pages || 1;

  // ----------------------------
  // Color normalize (shared logic)
  // ----------------------------
  const normalizeColor = (c) =>
    String(c || "")
      .trim()
      .toLowerCase();

  // ----------------------------
  // Local fallback filtering/sorting
  // ----------------------------
  const viewProducts = useMemo(() => {
    let list = [...products];

    // Sale is already discounted by endpoint, so no "onlyDiscount" toggle here.

    if (onlyInStock) {
      list = list.filter((p) => {
        if (p?.variants?.length) {
          return p.variants.some((v) => (v?.sizes || []).some((s) => (s?.stock || 0) > 0));
        }
        return (p?.countInStock || 0) > 0;
      });
    }

    if (selectedColors.length > 0) {
      list = list.filter((p) => {
        if (p?.variants?.length) {
          return p.variants.some((v) => selectedColors.includes(normalizeColor(v?.color)));
        }
        return selectedColors.includes(normalizeColor(p?.color));
      });
    }

    if (priceRange.min || priceRange.max) {
      const min = priceRange.min ? Number(priceRange.min) : null;
      const max = priceRange.max ? Number(priceRange.max) : null;

      list = list.filter((p) => {
        const price = (p?.hasDiscount ? p?.discountedPrice : p?.price) ?? 0;
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
      });
    }

    const getPrice = (p) => (p?.hasDiscount ? p?.discountedPrice : p?.price) ?? 0;

    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "priceDesc":
        list.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "nameAsc":
        list.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
        break;
      case "newest":
      default:
        break;
    }

    return list;
  }, [products, onlyInStock, selectedColors, sort, priceRange.min, priceRange.max]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (sort !== "newest" ? 1 : 0) +
    (selectedColors.length ? 1 : 0);

  const clearFilters = () => {
    setSearchDraft("");
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setOnlyInStock(false);
    setSort("newest");
    setSelectedColors([]);
    setPage(1);
  };

  // ----------------------------
  // Motion variants
  // ----------------------------
  const containerVariants = { visible: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Layout>
      <div className="relative min-h-screen mt-[70px] overflow-x-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-x-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[92vw] max-w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
        </div>

        <div className="lg:container lg:mx-auto px-3 lg:px-10 py-8 overflow-x-hidden">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 flex items-center gap-3">
              <Tag className="h-7 w-7 text-red-600" />
              Sale Products
            </h2>
            <p className="mt-2 text-neutral-600">
              {isLoading ? "Loading products…" : `${viewProducts.length} items`}
              {isFetching ? " (Updating…)" : ""}
            </p>
          </div>

          {/* ✅ Mobile: search beside filter btn */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center gap-2 w-full min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search sale products…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-neutral-200 bg-white pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
                {searchDraft?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchDraft("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl grid place-items-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50"
                    aria-label="Clear search">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="shrink-0 inline-flex items-center gap-2 h-11 rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 transition"
                aria-label="Open filters">
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {isFetching ? "Searching…" : searchTerm ? `Searching for “${searchTerm}”` : " "}
            </p>
          </div>

          {/* Layout */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Desktop: search + filters left */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[96px] space-y-4">
                {/* Search card */}
                <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5">
                  <label className="block text-xs font-medium text-neutral-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search sale products…"
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900/10"
                    />
                    {searchDraft?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchDraft("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        aria-label="Clear search">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {isFetching ? "Searching…" : searchTerm ? `Searching for “${searchTerm}”` : " "}
                  </p>
                </div>

                {/* Filters panel (component) */}
                <FiltersPanel
                  compact={false}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSubCategory="all"
                  setSelectedSubCategory={() => {}}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sort={sort}
                  setSort={setSort}
                  onlyDiscount={false}
                  setOnlyDiscount={() => {}}
                  onlyInStock={onlyInStock}
                  setOnlyInStock={setOnlyInStock}
                  products={products}
                  allSubCategories={[]}
                  activeFilterCount={activeFilterCount}
                  clearFilters={clearFilters}
                  onRefresh={refetch}
                />
              </div>
            </aside>

            {/* Products */}
            <main className="lg:col-span-9 min-w-0">
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                  {error?.data?.message || error?.error || "Failed to load sale products"}
                </div>
              ) : viewProducts.length === 0 ? (
                <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-10 text-center">
                  <p className="text-neutral-900 font-semibold">No sale products found</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Try changing your search or resetting filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                    <RefreshCcw className="h-4 w-4" />
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
                    {viewProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={itemVariants}
                        className="bg-white rounded-xl overflow-hidden">
                        <Product product={product} categoryTree={categoryTree} />
                      </motion.div>
                    ))}
                  </motion.div>

                  <Pagination page={page} setPage={setPage} pages={pages} />
                </>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-[92%] max-w-sm bg-white shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="font-semibold text-neutral-900">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex items-center rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white grid place-items-center"
                  aria-label="Close filters">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                <FiltersPanel
                  compact
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSubCategory="all"
                  setSelectedSubCategory={() => {}}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sort={sort}
                  setSort={setSort}
                  onlyDiscount={false}
                  setOnlyDiscount={() => {}}
                  onlyInStock={onlyInStock}
                  setOnlyInStock={setOnlyInStock}
                  products={products}
                  allSubCategories={[]}
                  activeFilterCount={activeFilterCount}
                  clearFilters={clearFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SaleProducts;
