import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickLook }) {
  const isNew = () => {
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // product is new if within 3 days
  };

  const isLimited = () => {
    return product.countInStock < 5;
  };

  const oldPrice = product.price;
  const newPrice = product.hasDiscount ? product.discountedPrice : oldPrice;

  return (
    <Link to={`/products/${product._id}`}>
      <motion.div
        className="group relative bg-white overflow-hidden cursor-pointer"
        style={{ borderRadius: "24px", boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px" }}
        layout>
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20">
          {isLimited() && (
            <span className="px-3 py-1 text-xs mr-2 bg-amber-500/90 text-white font-medium rounded-full backdrop-blur-sm">
              Limited
            </span>
          )}
          {isNew() && (
            <span className="px-3 py-1 text-xs bg-green-500/90 text-white font-medium rounded-full backdrop-blur-sm">
              New
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "25/36" }}>
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <img
              src={product.image[0]?.url || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-sm lg:text-xl font-semibold text-white mb-1">{product.name}</h3>
            <div className="text-sm sm:text-lg">
              {product.hasDiscount ? (
                <div className="flex flex-col">
                  <span className="text-gray-300 line-through text-sm">
                    {oldPrice.toFixed(3)} KD
                  </span>
                  <span className="text-white font-bold">{newPrice.toFixed(3)} KD</span>
                </div>
              ) : (
                <span className="text-white font-bold">{oldPrice.toFixed(3)} KD</span>
              )}
            </div>
            {/* Quick Look button */}
            {/*   <button
              onClick={(e) => {
                e.preventDefault(); // prevent navigating to product page
                onQuickLook(product);
              }}
              className="mt-3 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-200 transition">
              Quick Look
            </button> */}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
