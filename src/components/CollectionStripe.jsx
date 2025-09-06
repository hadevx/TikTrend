import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";

// Helper to capitalize multi-word names
const capitalizeLabel = (name) =>
  name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Helper to find category name by ID (nested)
const findCategoryNameById = (id, nodes) => {
  if (!id || !Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (String(node._id) === String(id)) return node.name;
    if (node.children) {
      const result = findCategoryNameById(id, node.children);
      if (result) return result;
    }
  }
  return null;
};

export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Prepare main categories with image & counts
  const categories = (categoryTree || []).map((category) => {
    const name = category.name || "Unknown";
    const label = capitalizeLabel(name);

    // Use backend count (includes subcategories)
    const count =
      mainCategoriesWithCounts?.find((c) => String(c._id) === String(category._id))?.count || 0;

    // Choose image: category image > first product image > placeholder
    const firstProduct = products?.find((p) => String(p.category) === String(category._id));
    const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

    return { id: category._id, label, count, image };
  });

  const itemWidth = 320; // w-80 + gap
  const totalWidth = categories.length * (itemWidth + 32) - 32;
  const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const maxDrag = Math.max(0, totalWidth - containerWidth + 48);

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="mb-12">
        <Reveal>
          <div className="container-custom text-center">
            <h2 className="text-neutral-900 mb-4 text-6xl font-normal">Collections</h2>
            <p className="text-lg px-5 text-neutral-600 max-w-2xl mx-auto">
              Explore our curated collections, each telling a unique story of craftsmanship and
              design philosophy.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-8 px-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.1}>
          {categories?.map((collection) => (
            <motion.div
              onClick={() => navigate(`/category/${collection.id}`)} // Navigate by ID
              key={collection.id}
              className="flex-shrink-0 w-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ filter: "blur(1px)" }}
                  transition={{ duration: 0.3 }}>
                  <img
                    src={collection.image}
                    alt={collection.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center text-white"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.3 }}>
                    <h3 className="text-3xl font-bold tracking-wider mb-2">{collection.label}</h3>
                    <p className="text-sm opacity-90">{collection.count} items</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-neutral-500">← Drag to explore collections →</p>
      </div>
    </section>
  );
}
