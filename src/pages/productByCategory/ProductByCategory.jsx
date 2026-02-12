// src/pages/ProductByCategory/ProductByCategory.jsx
import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import Loader from "../../components/Loader";
import { Search, SlidersHorizontal, X, ChevronRight, RefreshCcw } from "lucide-react";
import FiltersPanel from "../../components/FiltersPanel";

function ProductByCategory() {
  const { id } = useParams();

  // ----------------------------
  // UI state
  // ----------------------------
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDraft, setSearchDraft] = useState("");

  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [selectedColors, setSelectedColors] = useState([]); // ["black","red"]

  const [showFilters, setShowFilters] = useState(false);

  const [sort, setSort] = useState("newest");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchDraft.trim()), 300);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    id,
    searchTerm,
    selectedSubCategory,
    priceRange.min,
    priceRange.max,
    onlyDiscount,
    onlyInStock,
    sort,
    selectedColors,
  ]);

  // ----------------------------
  // Sort mapping
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

  const queryArgs = useMemo(
    () => ({
      id,
      page,
      limit,
      search: searchTerm,
      sort: apiSort,
      order: apiOrder,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
      inStock: onlyInStock ? true : undefined,
      color: selectedColors.length ? selectedColors.join(",") : undefined, // if backend supports
    }),
    [
      id,
      page,
      limit,
      searchTerm,
      apiSort,
      apiOrder,
      priceRange.min,
      priceRange.max,
      onlyInStock,
      selectedColors,
    ],
  );

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetProductsByCategoryQuery(queryArgs, { skip: !id });

  const products = useMemo(() => {
    if (!productsResponse) return [];
    if (Array.isArray(productsResponse)) return productsResponse;
    return productsResponse.products || [];
  }, [productsResponse]);

  const pagination = useMemo(() => {
    return (
      productsResponse?.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 1,
        hasPrev: page > 1,
        hasNext: false,
      }
    );
  }, [productsResponse, page, limit]);

  // ----------------------------
  // Category helpers
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

  const categoryNode = useMemo(() => findCategoryById(id, categoryTree), [id, categoryTree]);

  const breadcrumbPath = useMemo(
    () => findCategoryPath(id, categoryTree) || [],
    [id, categoryTree],
  );

  const allSubCategories = useMemo(
    () => (categoryNode ? flattenCategories(categoryNode.children || []) : []),
    [categoryNode],
  );

  const categoryIdsToInclude = useMemo(() => {
    if (!categoryNode) return [];
    if (selectedSubCategory === "all") return collectCategoryIds(categoryNode);
    const subCatNode = findCategoryById(selectedSubCategory, categoryNode.children || []);
    return subCatNode ? collectCategoryIds(subCatNode) : collectCategoryIds(categoryNode);
  }, [categoryNode, selectedSubCategory]);

  // ----------------------------
  // Local filtering
  // ----------------------------
  const normalizeColor = (c) =>
    String(c || "")
      .trim()
      .toLowerCase();

  const filteredProducts = useMemo(() => {
    let list = products;

    if (categoryIdsToInclude.length > 0) {
      list = list.filter((p) => categoryIdsToInclude.includes(String(p.category)));
    }

    if (onlyDiscount) list = list.filter((p) => p?.hasDiscount);

    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        (p?.variants || []).some((v) => selectedColors.includes(normalizeColor(v?.color))),
      );
    }

    return list;
  }, [products, categoryIdsToInclude, onlyDiscount, selectedColors]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedSubCategory !== "all" ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0) +
    (onlyDiscount ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (sort !== "newest" ? 1 : 0) +
    (selectedColors.length ? 1 : 0);

  const clearFilters = () => {
    setSearchDraft("");
    setSearchTerm("");
    setSelectedSubCategory("all");
    setPriceRange({ min: "", max: "" });
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setSort("newest");
    setSelectedColors([]);
    setPage(1);
  };

  return (
    <Layout>
      <div className="relative min-h-screen mt-[70px] overflow-x-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-x-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-white" />
          <div className="absolute left-1/2 top-24 h-72 w-[92vw] max-w-[46rem] -translate-x-1/2 rounded-full bg-neutral-200/45 blur-3xl" />
        </div>

        <div className="lg:container lg:mx-auto px-3 lg:px-10 py-8 overflow-x-hidden">
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 capitalize">
                  {categoryNode?.name || "Category"}
                </h1>
                <p className="mt-2 text-neutral-600">
                  {isLoading ? "Loading products…" : `${filteredProducts.length} items`}
                  {isFetching ? " (Updating…)" : ""}
                </p>
              </div>
            </div>

            {/* MOBILE: search beside filters button */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 w-full min-w-0">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search products…"
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
          </div>

          {/* Layout */}
          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[96px] space-y-4">
                {/* Desktop search */}
                <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-5">
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
                  <p className="mt-2 text-xs text-neutral-500">
                    {isFetching ? "Searching…" : searchTerm ? `Searching for “${searchTerm}”` : " "}
                  </p>
                </div>

                <FiltersPanel
                  // state
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSubCategory={selectedSubCategory}
                  setSelectedSubCategory={setSelectedSubCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sort={sort}
                  setSort={setSort}
                  onlyDiscount={onlyDiscount}
                  setOnlyDiscount={setOnlyDiscount}
                  onlyInStock={onlyInStock}
                  setOnlyInStock={setOnlyInStock}
                  // data
                  products={products}
                  allSubCategories={allSubCategories}
                  // helpers
                  activeFilterCount={activeFilterCount}
                  clearFilters={clearFilters}
                  onRefresh={refetch}
                  compact={false}
                />
              </div>
            </aside>

            {/* Products */}
            <main className="lg:col-span-9 min-w-0">
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                  {error?.data?.message || error?.error || "Failed to load products"}
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredProducts.map((p) => (
                      <div key={p._id} className="rounded-3xl min-w-0">
                        <Product product={p} categoryTree={categoryTree || []} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev || isFetching}
                      className="h-11 px-5 rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Prev
                    </button>

                    <span className="text-sm font-semibold text-neutral-900">
                      Page {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNext || isFetching}
                      className="h-11 px-5 rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-sm p-10 text-center">
                  <p className="text-neutral-900 font-semibold">No products found</p>
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
                  // state
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  selectedSubCategory={selectedSubCategory}
                  setSelectedSubCategory={setSelectedSubCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sort={sort}
                  setSort={setSort}
                  onlyDiscount={onlyDiscount}
                  setOnlyDiscount={setOnlyDiscount}
                  onlyInStock={onlyInStock}
                  setOnlyInStock={setOnlyInStock}
                  // data
                  products={products}
                  allSubCategories={allSubCategories}
                  // helpers
                  activeFilterCount={activeFilterCount}
                  clearFilters={clearFilters}
                  onRefresh={refetch}
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

export default ProductByCategory;
