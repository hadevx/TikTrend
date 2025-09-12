import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import clsx from "clsx";
import { ShoppingCart, Check } from "lucide-react";
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
    ? selectedVariant.sizes?.find((s) => s.size === selectedSize)?.stock
    : product?.countInStock;

  console.log(stock);
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

    toast.success(
      `${product.name}${
        selectedVariant && selectedSize ? ` (${selectedVariant.color}, ${selectedSize})` : ""
      } added to cart`,
      { position: "top-center" }
    );
  };

  return (
    <div className="flex flex-col rounded-2xl duration-300 overflow-hidden">
      <Link to={`/products/${product._id}`} className="relative group">
        <img
          src={selectedVariant?.images?.[0]?.url || product?.image?.[0]?.url || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="w-full h-60 sm:h-64 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {stock < 5 && (
          <span className="absolute top-2 left-2 bg-orange-100 border-orange-500 border text-orange-500 text-xs font-semibold px-2 py-1 rounded-full ">
            Low stock
          </span>
        )}
        {product.hasDiscount && (
          <span className="absolute top-2 left-24 bg-blue-500   text-white text-xs font-semibold px-2 py-1 rounded-full ">
            {product.discountBy * 100}% off
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <p className="text-gray-500 text-sm mb-1 truncate">{product?.category?.name}</p>
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 font-semibold max-w-[100px]  lg:text-lg truncate ">
              {product?.name}
            </h2>
            <div className="text-sm sm:text-base">
              {product.hasDiscount ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-gray-400 line-through text-sm">
                    {oldPrice.toFixed(3)} KD
                  </span>
                  <span className="text-green-600 font-bold">{newPrice.toFixed(3)} KD</span>
                </div>
              ) : (
                <span className="text-black font-bold">{oldPrice.toFixed(3)} KD</span>
              )}
            </div>
          </div>

          {/* Variant Colors */}
          <div className="mt-2 flex gap-1">
            {product?.variants?.map((variant) => (
              <button
                key={variant._id}
                className={clsx(
                  "relative w-6 h-6  rounded-full  flex items-center justify-center transition-all"
                )}
                style={{ backgroundColor: variant?.color?.toLowerCase() }}
                onClick={() => {
                  setSelectedVariant(variant);
                  setSelectedSize(variant.sizes?.[0]?.size || "");
                }}>
                {selectedVariant?._id === variant._id && (
                  <Check className="w-4 h-4 text-white drop-shadow" />
                )}
              </button>
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
                    "w-6 h-6 border-2 rounded-full text-sm font-medium flex items-center justify-center transition-colors",
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

        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={clsx(
              "w-full px-3 py-3 rounded-lg font-semibold text-white text-sm lg:text-base transition-colors duration-300 flex items-center justify-center gap-2",
              stock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600"
            )}>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
