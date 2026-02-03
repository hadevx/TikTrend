import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

export default function ProductCard({ product }) {
  const createdDate = product?.createdAt ? new Date(product.createdAt) : null;
  const now = new Date();
  const diffDays = createdDate ? (now - createdDate) / (1000 * 60 * 60 * 24) : 999;
  const isNew = diffDays <= 3;

  const isLimited = (product?.countInStock ?? 999) < 5;

  const oldPrice = Number(product?.price ?? 0);
  const newPrice = product?.hasDiscount ? Number(product?.discountedPrice ?? oldPrice) : oldPrice;

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="relative">
        {/* Outer glow */}
        <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 blur transition duration-300 group-hover:opacity-100" />

        <motion.div
          layout
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.99 }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-sm backdrop-blur
                     transition group-hover:shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
          {/* Discount ribbon */}
          {product?.hasDiscount && (
            <div className="absolute right-0 top-0 z-20">
              <div className="relative">
                <div className="h-12 w-28 origin-top-right rotate-45 bg-white/90 shadow-sm" />
                <div className="absolute right-2 top-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-950">
                  <Tag className="h-3.5 w-3.5" />
                  SALE
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
            {isLimited && (
              <span className="rounded-full border border-white/15 bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                LIMITED
              </span>
            )}
            {isNew && (
              <span className="rounded-full border border-white/15 bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                NEW
              </span>
            )}
          </div>

          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "25 / 36" }}>
            {/* subtle highlight */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-300 group-hover:opacity-100
                            bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]"
            />
            {/* vignette */}
            <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            <motion.img
              src={product?.image?.[0]?.url || "/placeholder.svg"}
              alt={product?.name || "Product"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out
                         group-hover:scale-[1.08] group-hover:rotate-[0.25deg]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Bottom info glass */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4">
            <div className="rounded-2xl border border-white/10 bg-black/55 p-3 backdrop-blur-md">
              <p
                title={product?.name}
                className="text-sm font-semibold text-white line-clamp-1 sm:text-base">
                {product?.name}
              </p>

              <div className="mt-1 flex items-center gap-2">
                {product?.hasDiscount ? (
                  <>
                    <span className="text-xs text-white/60 line-through sm:text-sm">
                      {oldPrice.toFixed(3)} KD
                    </span>
                    <span className="text-sm font-bold text-white sm:text-base">
                      {newPrice.toFixed(3)} KD
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-white sm:text-base">
                    {oldPrice.toFixed(3)} KD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />
        </motion.div>
      </div>
    </Link>
  );
}
