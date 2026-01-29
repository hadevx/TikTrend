import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickLook }) {
  const isNew = () => {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const isLimited = () => product.countInStock < 5;

  const oldPrice = product.price;
  const newPrice = product.hasDiscount ? product.discountedPrice : oldPrice;

  return (
    <Link to={`/products/${product._id}`} className="block">
      <motion.div
        layout
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        className="group relative overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-sm
                   transition-all duration-300 hover:shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
          {isLimited() && (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              Limited
            </span>
          )}
          {isNew() && (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              New
            </span>
          )}
          {product.hasDiscount && (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              Sale
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "25/36" }}>
          {/* subtle shine */}
          <div className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_55%)]" />

          <motion.img
            src={product.image?.[0]?.url || "/placeholder.svg"}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out
                       group-hover:scale-[1.06] group-hover:rotate-[0.2deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Bottom overlay — price only */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="text-white">
              {product.hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-white/70 line-through">
                    {oldPrice.toFixed(3)} KD
                  </span>
                  <span className="text-sm sm:text-base font-bold">{newPrice.toFixed(3)} KD</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base font-bold">{oldPrice.toFixed(3)} KD</span>
              )}
            </div>

            {/* small chip */}
            <span className="hidden sm:inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-md">
              View
            </span>
          </div>
        </div>

        {/* bottom accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Link>
  );
}
