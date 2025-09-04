import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetProductsByCategoryQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Layout from "../../Layout";
import Product from "../../components/Product";
import Loader from "../../components/Loader";

function ProductByCategory() {
  const { id } = useParams(); // category ID
  const { data: products, isLoading } = useGetProductsByCategoryQuery(id);
  const { data: categoryTree } = useGetCategoriesTreeQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false); // toggle for small screens

  // ----------------------------
  // Helper functions
  // ----------------------------

  const findCategoryById = (catId, nodes) => {
    if (!Array.isArray(nodes)) return null;
    for (const node of nodes) {
      if (String(node._id) === catId) return node;
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
      if (String(node._id) === catId) return newPath;
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
  // Computed values
  // ----------------------------

  const categoryNode = useMemo(() => findCategoryById(id, categoryTree), [id, categoryTree]);
  const breadcrumbPath = useMemo(
    () => findCategoryPath(id, categoryTree) || [],
    [id, categoryTree]
  );
  const allSubCategories = useMemo(
    () => (categoryNode ? flattenCategories(categoryNode.children || []) : []),
    [categoryNode]
  );

  const filteredProducts = useMemo(() => {
    if (!products || !categoryNode) return [];

    let categoryIds = [];
    if (selectedSubCategory === "all") {
      categoryIds = collectCategoryIds(categoryNode);
    } else {
      const subCatNode = findCategoryById(selectedSubCategory, categoryNode.children || []);
      if (subCatNode) categoryIds = collectCategoryIds(subCatNode);
    }

    return products
      .filter((p) => categoryIds.includes(String(p.category)))
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => {
        const minCheck = priceRange.min ? p.price >= parseFloat(priceRange.min) : true;
        const maxCheck = priceRange.max ? p.price <= parseFloat(priceRange.max) : true;
        return minCheck && maxCheck;
      });
  }, [products, categoryNode, selectedSubCategory, searchTerm, priceRange]);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Layout>
      <div className="min-h-screen mt-[70px] py-5 lg:px-28">
        {/* Breadcrumb */}
        <nav className="mb-4 px-2 text-gray-600 text-sm">
          <ol className="flex items-center flex-wrap">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            {breadcrumbPath.map((node, idx) => (
              <li key={node._id} className="flex items-center">
                <span className="mx-2">{">"}</span>
                {idx === breadcrumbPath.length - 1 ? (
                  <span className="capitalize text-gray-800 font-medium">{node.name}</span>
                ) : (
                  <Link to={`/category/${node._id}`} className="hover:underline capitalize">
                    {node.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="text-4xl px-2 font-semibold mb-6 capitalize">
          {categoryNode?.name || "Category"}
        </h1>

        {/* Toggle filter button on small screens */}
        <div className="lg:hidden mb-4 px-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-rose-500 text-white rounded-md">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          {(showFilters || window.innerWidth >= 1024) && (
            <aside className="w-full lg:w-1/4 p-4 border border-gray-200 rounded-lg bg-white">
              {/* Search */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Price</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-1/2"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2 w-1/2"
                  />
                </div>
              </div>

              {/* Subcategories */}
              {allSubCategories.length > 0 && (
                <div>
                  <label className="block font-medium mb-2">Subcategories</label>
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setSelectedSubCategory("all")}
                        className={`w-full text-left px-2 py-1 rounded ${
                          selectedSubCategory === "all"
                            ? "bg-rose-500 text-white"
                            : "hover:bg-gray-100"
                        }`}>
                        All
                      </button>
                    </li>
                    {allSubCategories.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => setSelectedSubCategory(sub.id)}
                          className={`w-full text-left px-2 py-1 rounded ${
                            selectedSubCategory === sub.id
                              ? "bg-rose-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                          title={sub.displayName}>
                          {sub.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}

          {/* Products Grid */}
          <main className="flex-1 px-2">
            {isLoading ? (
              <Loader />
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="mb-6 text-gray-700">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                <div className="grid grid-cols-2 sm:flex md:flex-wrap gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="w-[210px] md:min-w-[250px] rounded-lg">
                      <Product product={product} categoryTree={categoryTree || []} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">No products found matching your criteria.</p>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default ProductByCategory;
