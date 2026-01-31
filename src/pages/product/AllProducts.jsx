import Layout from "../../Layout";
import { motion } from "framer-motion";
import { useGetProductsQuery, useGetCategoriesTreeQuery } from "../../redux/queries/productApi";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import Pagination from "../../components/Paginations";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

function AllProducts() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW filters
  const [sort, setSort] = useState("newest"); // newest | priceAsc | priceDesc | nameAsc
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // ✅ NEW UI state
  const [showFilters, setShowFilters] = useState(false);

  // Fetch
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({
    pageNumber: page,
    keyword: searchQuery,
    // if your backend supports these, keep them; otherwise they are harmless
    sort,
    onlyDiscount,
    onlyInStock,
  });

  const products = productsData?.products || [];
  const pages = productsData?.pages || 1;

  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const containerVariants = { visible: { transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

  // ✅ NEW: debounce search (less API spam)
  const [searchDraft, setSearchDraft] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchQuery(searchDraft);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // ✅ Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleClear = () => {
    setSearchDraft("");
    setSearchQuery("");
    setSort("newest");
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setPage(1);
  };

  // ✅ If backend does NOT support sorting/filters, we still apply locally as a fallback
  const viewProducts = useMemo(() => {
    let list = [...products];

    if (onlyDiscount) list = list.filter((p) => p?.hasDiscount);
    if (onlyInStock) {
      list = list.filter((p) => {
        if (p?.variants?.length) {
          // any variant has any size with stock > 0
          return p.variants.some((v) => (v?.sizes || []).some((s) => (s?.stock || 0) > 0));
        }
        return (p?.countInStock || 0) > 0;
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
        // keep server order (usually newest)
        break;
    }

    return list;
  }, [products, onlyDiscount, onlyInStock, sort]);

  const activeFiltersCount =
    (onlyDiscount ? 1 : 0) + (onlyInStock ? 1 : 0) + (sort !== "newest" ? 1 : 0);

  return (
    <Layout>
      {loadingProducts ? (
        <Loader />
      ) : (
        <div className="container px-2 mx-auto py-24 lg:px-28 min-h-screen">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2 className="text-4xl font-semibold text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500 mt-1">
                Browse and filter products.{" "}
                <span className="font-medium text-gray-800">{viewProducts.length}</span> shown
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters((p) => !p)}
                className={clsx(
                  "inline-flex items-center gap-2 h-10 px-4 rounded-2xl border transition",
                  "bg-white text-gray-900 border-gray-200 hover:bg-gray-50",
                )}>
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-xs px-2">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 || searchQuery ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className={clsx(
                    "inline-flex items-center gap-2 h-10 px-4 rounded-2xl border transition",
                    "bg-black text-white border-black hover:bg-neutral-900",
                  )}>
                  <X className="h-4 w-4" />
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative w-full sm:w-[420px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                className="w-full h-11 pl-10 pr-10 border rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              {searchDraft?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchDraft("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort quick select (always visible) */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 inline-flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" /> Sort
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20">
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
                <option value="nameAsc">Name: A → Z</option>
              </select>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyDiscount}
                    onChange={(e) => {
                      setOnlyDiscount(e.target.checked);
                      setPage(1);
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-900">Discounts only</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => {
                      setOnlyInStock(e.target.checked);
                      setPage(1);
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-900">In-stock only</span>
                </label>
              </div>
            </div>
          )}

          {/* Empty state */}
          {viewProducts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-gray-900">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or clearing filters.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-black text-white font-semibold hover:bg-neutral-900">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-6">
                {viewProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    className="bg-white rounded-xl overflow-hidden">
                    <Product product={product} categoryTree={categoryTree} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              <Pagination page={page} setPage={setPage} pages={pages} />
            </>
          )}
        </div>
      )}
    </Layout>
  );
}

export default AllProducts;
