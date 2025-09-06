import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

function Product({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const oldPrice = product.price;
  const newPrice = product.hasDiscount ? product.discountedPrice : oldPrice;

  // Track selected variant & size
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.sizes?.[0]?.size || "");

  // Stock handling
  const stock = selectedVariant
    ? selectedVariant.sizes?.find((s) => s.size === selectedSize)?.stock || 0
    : product?.countInStock || 0;

  const handleAddToCart = () => {
    if (selectedVariant && !selectedSize) {
      return toast.error("Please select a size", { position: "top-center" });
    }

    if (stock === 0) {
      return toast.error("Out of stock", { position: "top-center" });
    }

    const productInCart = cartItems.find(
      (p) =>
        p._id === product._id &&
        (selectedVariant
          ? p.variantId === selectedVariant._id && p.variantSize === selectedSize
          : true)
    );

    if (productInCart && productInCart.qty >= stock) {
      return toast.error("You can't add more", { position: "top-center" });
    }

    dispatch(
      addToCart({
        ...product,
        variantId: selectedVariant?._id || null,
        variantColor: selectedVariant?.color || null,
        variantSize: selectedSize || null,
        variantImage: selectedVariant?.images || null,
        stock,
        qty: 1, // default add 1 item
      })
    );

    toast.success(`${product.name} (${selectedVariant?.color}, ${selectedSize}) added to cart`, {
      position: "top-center",
    });
  };

  return (
    <div className="flex flex-col rounded-2xl duration-300 overflow-hidden">
      <Link to={`/products/${product._id}`} className="relative group">
        <img
          src={selectedVariant?.images?.[0]?.url || product?.image?.[0]?.url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-60 sm:h-64 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm mb-1 truncate">{product?.category?.name}</p>
          <h2 className="text-gray-900 font-semibold text-lg truncate">{product?.name}</h2>

          {/* Variant Colors */}
          <div className="mt-2 flex gap-1">
            {product?.variants?.map((variant) => (
              <button
                key={variant._id}
                className={clsx(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  selectedVariant?._id === variant._id ? "border-0 scale-110" : "border-gray-300"
                )}
                style={{ backgroundColor: variant?.color?.toLowerCase() }}
                onClick={() => {
                  setSelectedVariant(variant);
                  setSelectedSize(variant.sizes?.[0]?.size || "");
                }}
              />
            ))}
          </div>

          {/* Sizes */}
          {selectedVariant && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {selectedVariant?.sizes?.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={clsx(
                    "w-8 h-8 border-2 rounded-full text-sm font-medium flex items-center justify-center transition-colors",
                    selectedSize === s.size
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300",
                    s.stock === 0 && "opacity-50 cursor-not-allowed"
                  )}>
                  {s.size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price + Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm sm:text-base">
            {product.hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-sm">{oldPrice.toFixed(3)} KD</span>
                <span className="text-green-600 font-bold">{newPrice.toFixed(3)} KD</span>
              </div>
            ) : (
              <span className="text-black font-bold">{oldPrice.toFixed(3)} KD</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || stock === 0}
            className={clsx(
              "ml-2 px-3 py-2 rounded-lg font-semibold text-white text-xs lg:text-sm transition-colors duration-300",
              !selectedSize || stock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600"
            )}>
            <span className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden md:inline">Add to Cart</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
