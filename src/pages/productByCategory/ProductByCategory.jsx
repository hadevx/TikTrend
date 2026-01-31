import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import clsx from "clsx";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Filter,
  RefreshCcw,
  ArrowUpDown,
  BadgePercent,
  PackageCheck,
} from "lucide-react";

function ProductByCategory() {
  const { id } = useParams();
  const { data: products, isLoading } = useGetProductsByCategoryQuery(id);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // ✅ NEW features
  const [sort, setSort] = useState("newest"); // newest | priceAsc | priceDesc | nameAsc
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // ✅ NEW: debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchDraft), 300);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // ----------------------------
  // Helpers (same logic)
  // ----------------------------
  const findCategoryById = (catId, nodes) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (String(node._id) === String(catId)) return node;
      if (node.children?.length) {
        const found = findCategoryById(catId, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const collectCategoryIds = (node) => {
    let ids = [String(node?._id)];
    if (node?.children?.length) {
      node.children.forEach((child) => {
        ids = ids.concat(collectCategoryIds(child));
      });
    }
    return ids;
  };

  const findCategoryPath = (catId, nodes, path = []) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      const newPath = [...path, node];
      if (String(node._id) === String(catId)) return newPath;
      if (node.children?.length) {
        const found = findCategoryPath(catId, node.children, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const flattenCategories = (nodes, prefix = "") => {
    if (!Array.isArray(nodes)) return [];
    return nodes.flatMap((node) => {
      const displayName = prefix ? `${prefix} > ${node.name}` : node.name;
      return [
        { id: node._id, name: node.name, displayName },
        ...flattenCategories(node.children || [], displayName),
      ];
    });
  };

  // ----------------------------
  // Computed
  // ----------------------------
  const categoryNode = useMemo(() => findCategoryById(id, categoryTree), [id, categoryTree]);

  const breadcrumbPath = useMemo(
    () => findCategoryPath(id, categoryTree) || [],
    [id, categoryTree],
  );

  const allSubCategories = useMemo(
    () => (categoryNode ? flattenCategories(categoryNode.children || []) : []),
    [categoryNode],
  );

  // ✅ NEW: compute applicable category ids
  const categoryIdsToInclude = useMemo(() => {
    if (!categoryNode) return [];

    if (selectedSubCategory === "all") return collectCategoryIds(categoryNode);

    const subCatNode = findCategoryById(selectedSubCategory, categoryNode.children || []);
    return subCatNode ? collectCategoryIds(subCatNode) : collectCategoryIds(categoryNode);
  }, [categoryNode, selectedSubCategory]);

  // ✅ NEW: filtered + local sorting + extra filters
  const filteredProducts = useMemo(() => {
    if (!products || !categoryNode) return [];

    let list = products
      .filter((p) => categoryIdsToInclude.includes(String(p.category)))
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => {
        const price = p.hasDiscount ? p.discountedPrice : p.price;
        const minCheck = priceRange.min ? price >= parseFloat(priceRange.min) : true;
        const maxCheck = priceRange.max ? price <= parseFloat(priceRange.max) : true;
        return minCheck && maxCheck;
      });

    if (onlyDiscount) list = list.filter((p) => p.hasDiscount);

    if (onlyInStock) {
      list = list.filter((p) => {
        // if has variants -> any size has stock
        if (p?.variants?.length) {
          return p.variants.some((v) => (v?.sizes || []).some((s) => (s?.stock || 0) > 0));
        }
        return (p?.countInStock || 0) > 0;
      });
    }

    const getPrice = (p) => (p.hasDiscount ? p.discountedPrice : p.price) ?? 0;

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
        // keep server order
        break;
    }

    return list;
  }, [
    products,
    categoryNode,
    categoryIdsToInclude,
    searchTerm,
    priceRange,
    onlyDiscount,
    onlyInStock,
    sort,
  ]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedSubCategory !== "all" ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (onlyDiscount ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

  const clearFilters = () => {
    setSearchDraft("");
    setSearchTerm("");
    setSelectedSubCategory("all");
    setPriceRange({ min: "", max: "" });
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setSort("newest");
  };

  // ✅ NEW: quick chips
  const Chip = ({ active, onClick, icon: Icon, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 h-10 px-4 rounded-2xl border text-sm font-semibold transition",
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50",
      )}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );

  // ----------------------------
  // UI Pieces
  // ----------------------------
  const FiltersPanel = ({ compact = false }) => (
    <div className={clsx(compact ? "" : "sticky top-[96px]")}>
      <div className="rounded-3xl border border-neutral-200 bg-white/85 backdrop-blur shadow-sm overflow-hidden">
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
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition">
              <RefreshCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        <div className="px-5 pb-5 space-y-5">
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products…"
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
              <span className="text-sm font-medium text-neutral-900">Discount only</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 hover:bg-neutral-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-neutral-900">In stock only</span>
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
          </div>

          {/* Subcategories */}
          {allSubCategories.length > 0 && (
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
        </div>
      </div>
    </div>
  );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Layout>
      <div className="relative min-h-screen mt-[70px]">
        {/* Soft background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
        </div>

        <div className="lg:container lg:mx-auto px-3 lg:px-10 py-8">
          {/* Breadcrumb */}
          <nav className="mb-5 text-sm text-neutral-600">
            <ol className="flex items-center flex-wrap gap-1">
              <li>
                <Link to="/" className="hover:text-neutral-900 transition">
                  Home
                </Link>
              </li>
              {breadcrumbPath.map((node, idx) => (
                <li key={node._id} className="flex items-center gap-1">
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                  {idx === breadcrumbPath.length - 1 ? (
                    <span className="capitalize text-neutral-900 font-medium">{node.name}</span>
                  ) : (
                    <Link
                      to={`/category/${node._id}`}
                      className="hover:text-neutral-900 transition capitalize">
                      {node.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 capitalize">
                {categoryNode?.name || "Category"}
              </h1>
              <p className="mt-2 text-neutral-600">
                {isLoading ? "Loading products…" : `${filteredProducts.length} items`}
              </p>

              {/* ✅ NEW quick chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip
                  active={onlyDiscount}
                  onClick={() => setOnlyDiscount((p) => !p)}
                  icon={BadgePercent}>
                  Discounts
                </Chip>
                <Chip
                  active={onlyInStock}
                  onClick={() => setOnlyInStock((p) => !p)}
                  icon={PackageCheck}>
                  In stock
                </Chip>
              </div>
            </div>

            {/* Mobile filters button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50 transition">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <FiltersPanel />
            </aside>

            {/* Products */}
            <main className="lg:col-span-9">
              {/* ✅ NEW: compact sort bar (desktop + mobile) */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm text-neutral-600">
                  Showing{" "}
                  <span className="font-semibold text-neutral-900">{filteredProducts.length}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-neutral-400" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 rounded-2xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/10">
                    <option value="newest">Newest</option>
                    <option value="priceAsc">Price: Low → High</option>
                    <option value="priceDesc">Price: High → Low</option>
                    <option value="nameAsc">Name: A → Z</option>
                  </select>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-10 px-4 rounded-2xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <Loader />
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {filteredProducts.map((p) => (
                    <div key={p._id} className="rounded-3xl">
                      <Product product={p} categoryTree={categoryTree || []} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-10 text-center">
                  <p className="text-neutral-700 font-medium">No products found</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Try adjusting your search or resetting filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                    <RefreshCcw className="h-4 w-4" />
                    Reset filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-[92%] max-w-sm bg-white shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="font-semibold text-neutral-900">Filters</span>
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
                <FiltersPanel compact />
              </div>

              <div className="p-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="w-full rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition">
                  Show results ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ProductByCategory;
