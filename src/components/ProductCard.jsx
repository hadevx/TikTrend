import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * ProductCard (React.js) – editorial / minimal like your reference:
 * - clean image block (no glass, no neon glow)
 * - crossfade to hover image
 * - category line (uppercase tracking)
 * - serif name + muted price
 *
 * Expects your product shape:
 * product._id
 * product.name
 * product.price
 * product.hasDiscount + discountedPrice
 * product.image[0].url (primary)
 * product.image[1].url (hover) OR product.hoverImage/url if you have it
 * product.category?.name OR product.category
 */
export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  console.log(product);
  const id = product?._id;

  const name = product?.name || "Product";
  const category = useMemo(() => {
    // try common shapes
    return (
      product?.category?.name ||
      product?.category?.title ||
      product?.category ||
      product?.brand ||
      "Collection"
    );
  }, [product]);

  const oldPrice = Number(product?.price ?? 0);
  const price = product?.hasDiscount ? Number(product?.discountedPrice ?? oldPrice) : oldPrice;

  const primaryImage =
    product?.image?.[0]?.url || product?.image?.url || product?.image || "/placeholder.svg";

  // best-effort hover image
  const hoverImage =
    product?.hoverImage?.url ||
    product?.hoverImage ||
    product?.image?.[1]?.url ||
    product?.image?.[0]?.url ||
    "/placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}>
      <Link
        to={`/product/${id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {/* Image block */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
          {/* Primary */}
          <img
            src={primaryImage}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Hover */}
          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hover shadow overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.10)]"
          />
        </div>

        {/* Text */}
        <div className="space-y-1">
          {/*   <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
            {product.category}
          </p> */}

          <h3 className="font-serif text-lg leading-snug">{name}</h3>

          <div className="text-sm text-muted-foreground tracking-wide">
            {product?.hasDiscount ? (
              <>
                <span className="line-through mr-2">{oldPrice.toFixed(3)} KD</span>
                <span className="text-foreground">{price.toFixed(3)} KD</span>
              </>
            ) : (
              <span>Starting at {price.toFixed(3)} KD</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
