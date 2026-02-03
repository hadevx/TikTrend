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

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.sizes?.[0]?.size || "");

  // ✅ temporary UI state (shows "Added" then back to "Add to cart")
  const [justAdded, setJustAdded] = useState(false);

  const stock = selectedVariant
    ? selectedVariant.sizes?.find((s) => s.size === selectedSize)?.stock
    : product?.countInStock;

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
          : true),
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
        qty: 1,
      }),
    );

    // ✅ NO success toast — only change button text temporarily
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 ">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* shine */}
          <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_55%)]" />

          <img
            src={
              selectedVariant?.images?.[0]?.url || product?.image?.[0]?.url || "/placeholder.svg"
            }
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
            {stock < 5 && stock > 0 && (
              <span className="rounded-full border border-white/20 bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                Low stock
              </span>
            )}

            {stock === 0 && (
              <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                Sold out
              </span>
            )}

            {product.hasDiscount && (
              <span className="rounded-full border border-white/20 bg-blue-600/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                {product.discountBy * 100}% off
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Meta */}
        <p className="text-xs sm:text-sm text-neutral-500 truncate">{product?.category?.name}</p>

        {/* Title + Price */}
        <div className="mt-1 flex items-start justify-between gap-3">
          <h2 className="min-w-0 flex-1 text-sm sm:text-base truncate  font-semibold text-neutral-900 line-clamp-2">
            {product?.name}
          </h2>

          <div className="shrink-0 text-right">
            {product.hasDiscount ? (
              <div className="leading-tight">
                <div className="text-[11px] sm:text-xs text-neutral-400 line-through">
                  {oldPrice.toFixed(3)} KD
                </div>
                <div className="text-sm sm:text-base font-bold text-emerald-600">
                  {newPrice.toFixed(3)} KD
                </div>
              </div>
            ) : (
              <div className="text-sm sm:text-base font-bold text-neutral-900">
                {oldPrice.toFixed(3)} KD
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        {product?.variants?.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] sm:text-xs font-medium text-neutral-600 mb-2">Color</p>

            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const active = selectedVariant?._id === variant._id;

                return (
                  <button
                    key={variant._id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedSize(variant.sizes?.[0]?.size || "");
                    }}
                    className={clsx(
                      "relative h-7 w-7 rounded-full border transition",
                      active
                        ? "ring-2 ring-neutral-900 ring-offset-2 border-white"
                        : "border-neutral-200 hover:ring-2 hover:ring-neutral-400 hover:ring-offset-2",
                    )}
                    style={{ backgroundColor: variant?.color?.toLowerCase() }}
                    aria-label={`Select color ${variant.color}`}>
                    {active && (
                      <span className="absolute inset-0 grid place-items-center">
                        <Check className="h-4 w-4 text-white drop-shadow" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sizes */}
        {selectedVariant?.sizes?.length > 0 && (
          <div className="mt-3">
            <p className="text-[11px] sm:text-xs font-medium text-neutral-600 mb-2">Size</p>

            <div className="flex flex-wrap gap-2">
              {selectedVariant.sizes.map((s) => {
                const active = selectedSize === s.size;
                const disabled = s.stock === 0;

                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedSize(s.size)}
                    className={clsx(
                      "h-8 rounded-full px-3 text-xs font-semibold border transition",
                      active
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50",
                      disabled && "opacity-45 cursor-not-allowed line-through hover:bg-white",
                    )}>
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Button */}
        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={clsx(
              "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition flex items-center justify-center gap-2",
              stock === 0
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                : justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.99]",
            )}>
            {justAdded ? (
              <>
                <Check className="h-5 w-5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                <span>{stock === 0 ? "Out of stock" : "Add to cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
