import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../Layout";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetRelatedProductsQuery,
} from "../../redux/queries/productApi";
import Loader from "../../components/Loader";
import { Check, Minus, Plus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** ✅ Success SVG animation (no toast) */
function AddedAnimation() {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18 }}>
      <div className="flex items-center gap-2">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="drop-shadow">
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          <motion.path
            d="M7.5 12.5L10.5 15.2L16.8 9.2"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
          />
        </svg>

        <motion.span
          className="text-sm font-semibold text-white"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}>
          Added
        </motion.span>
      </div>
    </motion.div>
  );
}
function RelatedProductsSection({ title = "Related Products", products, isLoading }) {
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Loading suggestions…</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border bg-background">
              <div className="aspect-[4/5] bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted animate-pulse w-3/4" />
                <div className="h-3 bg-muted animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const list = Array.isArray(products) ? products : [];
  if (!list.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">You might also like these products</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {list.slice(0, 8).map((p) => {
          const img =
            p?.image?.[0]?.url ||
            (typeof p?.image?.[0] === "string" ? p.image[0] : null) ||
            "/placeholder.svg";

          const oldPrice = Number(p?.price ?? 0);
          const finalPrice = p?.hasDiscount ? Number(p?.discountedPrice ?? oldPrice) : oldPrice;

          return (
            <Link
              to={`/product/${p?._id}`}
              key={p?._id}
              className={clsx(
                "group border border-border bg-background overflow-hidden transition",
                "hover:border-foreground/30",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
              )}>
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={img}
                  alt={p?.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* Discount badge */}
                {p?.hasDiscount ? (
                  <div className="absolute top-3 left-3 bg-black text-white text-[11px] tracking-widest uppercase px-2 py-1">
                    Sale
                  </div>
                ) : null}
              </div>

              {/* Info */}
              <div className="p-3 md:p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2">
                    {p?.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-sm">
                  {p?.hasDiscount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">
                        {oldPrice.toFixed(3)} KD
                      </span>
                      <span className="text-foreground font-semibold">
                        {finalPrice.toFixed(3)} KD
                      </span>
                    </div>
                  ) : (
                    <span className="text-foreground font-semibold">
                      {finalPrice.toFixed(3)} KD
                    </span>
                  )}
                </div>

                {/* Stock hint (optional) */}
                <p className="text-xs text-muted-foreground">
                  {Number(p?.countInStock || 0) > 0 ? "In stock" : "Out of stock"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** ✅ Simple error hint */
function InlineHint({ show, text }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          className="mt-3 text-sm text-rose-600"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}>
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function Product() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { data: related, isLoading: loadingRelatedProducts } = useGetRelatedProductsQuery({
    productId,
    limit: 8,
  });
  const { data: product, isLoading, refetch } = useGetProductByIdQuery(productId);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [counter, setCounter] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [uiError, setUiError] = useState("");
  const [addedPulse, setAddedPulse] = useState(false);

  const thumbsRef = useRef(null);

  const categoryId = useMemo(() => {
    if (!product?.category) return "";
    if (typeof product.category === "string") return String(product.category);
    return product.category?._id ? String(product.category._id) : "";
  }, [product]);

  const { data: sameCategoryProducts, isLoading: loadingRelated } = useGetProductsByCategoryQuery(
    categoryId,
    { skip: !categoryId },
  );

  const relatedProducts = useMemo(() => {
    const list = Array.isArray(sameCategoryProducts) ? sameCategoryProducts : [];
    return list.filter((p) => String(p?._id) !== String(product?._id)).slice(0, 4);
  }, [sameCategoryProducts, product?._id]);

  useEffect(() => {
    if (!product) return;

    refetch();

    if (product.variants?.length > 0) {
      const first = product.variants[0];
      setActiveVariant(first);
      setActiveImage(first.images?.[0]?.url || product.image?.[0]?.url || "/placeholder.svg");
      setSelectedSize(first.sizes?.[0] || null);
    } else {
      setActiveVariant(null);
      setActiveImage(product.image?.[0]?.url || "/placeholder.svg");
      setSelectedSize(null);
    }

    setCounter(1);
    setUiError("");
    setAddedPulse(false);
  }, [product, refetch]);

  const stock = activeVariant ? selectedSize?.stock || 0 : product?.countInStock || 0;

  const oldPrice = Number(product?.price ?? 0);
  const finalPrice = product?.hasDiscount ? Number(product?.discountedPrice ?? oldPrice) : oldPrice;

  const handleIncrement = () => {
    if (counter < stock) setCounter((c) => c + 1);
  };

  const handleDecrement = () => {
    if (counter > 1) setCounter((c) => c - 1);
  };

  const triggerAdded = () => {
    setAddedPulse(true);
    window.clearTimeout(triggerAdded._t);
    triggerAdded._t = window.setTimeout(() => setAddedPulse(false), 900);
  };
  // eslint-disable-next-line
  triggerAdded._t = triggerAdded._t || null;

  const handleAddToCart = () => {
    setUiError("");

    if (activeVariant && !selectedSize) {
      setUiError("Please select a size.");
      return;
    }
    if (stock === 0) {
      setUiError("Out of stock.");
      return;
    }

    const productInCart = cartItems.find(
      (p) =>
        p._id === product._id &&
        (activeVariant
          ? p.variantId === activeVariant._id && p.variantSize === selectedSize?.size
          : true),
    );

    if (productInCart && productInCart.qty >= stock) {
      setUiError("You can't add more than available stock.");
      return;
    }

    dispatch(
      addToCart({
        ...product,
        variantId: activeVariant?._id || null,
        variantColor: activeVariant?.color || null,
        variantSize: selectedSize?.size || null,
        variantImage: activeVariant?.images || null,
        stock,
        qty: counter,
      }),
    );

    triggerAdded();
  };

  const galleryImages = useMemo(() => {
    const vImgs = product?.variants?.flatMap((v) => v.images || []) || [];
    const pImgs = product?.image || [];
    const list = vImgs.length ? vImgs : pImgs;
    return list.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
  }, [product]);

  const categoryLabel = useMemo(() => {
    if (!product?.category) return "Collection";
    if (typeof product.category === "string") return "Category";
    return product?.category?.name || "Collection";
  }, [product]);

  const selectThumb = (url) => {
    setActiveImage(url);

    // keep selected thumb visible (desktop column)
    const el = thumbsRef.current;
    if (!el) return;

    // CSS.escape may not exist in older browsers; guard
    const esc = window?.CSS?.escape ? window.CSS.escape(url) : url.replace(/"/g, '\\"');
    const btn = el.querySelector(`[data-thumb="${esc}"]`);
    if (btn?.scrollIntoView) btn.scrollIntoView({ block: "nearest" });
  };

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <main className="min-h-screen bg-background text-foreground">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/all-products" className="hover:text-foreground transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                to={categoryId ? `/category/${categoryId}` : "/all-products"}
                className="hover:text-foreground transition-colors">
                {categoryLabel}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{product?.name}</span>
            </nav>
          </div>

          {/* Product Section */}
          <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                {/* ✅ thumbs LEFT of big image on desktop */}
                <div className="flex gap-4">
                  {/* Thumbnails column */}
                  {galleryImages.length > 1 && (
                    <div
                      ref={thumbsRef}
                      className={clsx(
                        "hidden md:flex flex-col gap-3",
                        "w-[76px] shrink-0",
                        "max-h-[560px] overflow-auto pr-1",
                        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                      )}>
                      {galleryImages.slice(0, 10).map((url, idx) => {
                        const isActive = url === activeImage || (!activeImage && idx === 0);

                        return (
                          <button
                            key={idx}
                            type="button"
                            data-thumb={url}
                            onClick={() => selectThumb(url)}
                            className={clsx(
                              "relative h-24 w-[76px] overflow-hidden border bg-muted transition",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
                              isActive
                                ? "border-foreground opacity-100"
                                : "border-border hover:border-foreground/40 opacity-55 hover:opacity-85",
                            )}
                            aria-label={`Select image ${idx + 1}`}>
                            <img
                              src={url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="h-full w-full object-cover"
                              draggable={false}
                            />
                            {isActive ? (
                              <div className="pointer-events-none absolute inset-0 ring-1 ring-foreground/20" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Main image */}
                  <div className="flex-1">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeImage || "main"}
                          src={activeImage || galleryImages[0] || "/placeholder.svg"}
                          alt={product?.name}
                          loading="lazy"
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 w-full h-full object-cover"
                          draggable="false"
                        />
                      </AnimatePresence>
                    </div>

                    {/* ✅ mobile thumbs BELOW main image */}
                    {galleryImages.length > 1 && (
                      <div className="mt-4 flex md:hidden gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {galleryImages.slice(0, 10).map((url, idx) => {
                          const isActive = url === activeImage || (!activeImage && idx === 0);

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveImage(url)}
                              className={clsx(
                                "relative shrink-0 h-20 w-16 overflow-hidden bg-muted border transition",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
                                isActive
                                  ? "border-foreground opacity-100"
                                  : "border-border hover:border-foreground/40 opacity-55 hover:opacity-85",
                              )}
                              aria-label={`Select image ${idx + 1}`}>
                              <img
                                src={url}
                                alt={`Thumbnail ${idx + 1}`}
                                className="h-full w-full object-cover"
                                draggable={false}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="lg:sticky lg:top-32 lg:self-start space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {categoryLabel}
                  </p>
                  <h1 className="font-serif text-3xl md:text-4xl">{product?.name}</h1>

                  <div className="text-xl">
                    {product?.hasDiscount ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm text-muted-foreground line-through">
                          {oldPrice.toFixed(3)} KD
                        </span>
                        <span className="text-foreground">{finalPrice.toFixed(3)} KD</span>
                      </div>
                    ) : (
                      <span className="text-foreground">{finalPrice.toFixed(3)} KD</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {product?.description || "—"}
                </p>

                {/* Color Selector */}
                {product?.variants?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm tracking-widest uppercase text-muted-foreground">
                        Color
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {activeVariant?.color ? String(activeVariant.color) : ""}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => {
                        const isActive = activeVariant?._id === variant._id;
                        return (
                          <button
                            key={variant._id}
                            type="button"
                            onClick={() => {
                              setActiveVariant(variant);
                              setActiveImage(variant.images?.[0]?.url || product.image?.[0]?.url);
                              setSelectedSize(variant.sizes?.[0] || null);
                              setCounter(1);
                              setUiError("");
                            }}
                            className={clsx(
                              "relative h-10 w-10 rounded-full border transition",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
                              isActive
                                ? "border-foreground"
                                : "border-border hover:border-foreground/40",
                            )}
                            style={{ backgroundColor: String(variant?.color || "").toLowerCase() }}
                            aria-label={`Select color ${variant.color}`}>
                            {isActive && (
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

                {/* ✅ Size Selector (BACK TO OLD ONE) */}
                {activeVariant?.sizes?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm tracking-widest uppercase text-muted-foreground">
                        Size
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedSize?.size ? `Selected: ${selectedSize.size}` : "Select a size"}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-3">
                      {activeVariant.sizes.map((s) => {
                        const isSelected = selectedSize?.size === s.size;
                        const disabled = (s?.stock || 0) === 0;

                        return (
                          <button
                            key={s.size}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setSelectedSize(s);
                              setCounter(1);
                              setUiError("");
                            }}
                            className={clsx(
                              "h-11 border text-sm font-medium transition",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/25",
                              disabled
                                ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                                : isSelected
                                  ? "border-foreground bg-black text-white"
                                  : "border-border bg-background hover:border-foreground/40",
                            )}>
                            {s.size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-3">
                  <span className="text-sm tracking-widest uppercase text-muted-foreground">
                    Quantity
                  </span>

                  <div className="inline-flex items-center border border-border bg-background">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={counter === 1}
                      className={clsx(
                        "h-11 w-11 grid place-items-center transition",
                        counter === 1
                          ? "text-muted-foreground cursor-not-allowed opacity-60"
                          : "text-foreground hover:bg-muted",
                      )}
                      aria-label="Decrease quantity">
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="w-12 text-center text-sm font-semibold text-foreground">
                      {counter}
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={counter >= stock}
                      className={clsx(
                        "h-11 w-11 grid place-items-center transition",
                        counter >= stock || stock === 0
                          ? "text-muted-foreground cursor-not-allowed opacity-60"
                          : "text-foreground hover:bg-muted",
                      )}
                      aria-label="Increase quantity">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {stock > 0 ? (
                    <p className="text-xs text-muted-foreground tracking-wide">
                      Max available: {stock}
                    </p>
                  ) : null}
                </div>

                {/* Add to Bag */}
                <motion.button
                  className={clsx(
                    "relative w-full py-4 text-sm tracking-widest uppercase transition-colors",
                    stock === 0
                      ? "bg-gray-200 text-muted-foreground cursor-not-allowed"
                      : addedPulse
                        ? "bg-emerald-600 text-white"
                        : "bg-black text-white hover:bg-foreground/90",
                  )}
                  whileTap={stock === 0 ? {} : { scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={stock === 0}>
                  <span
                    className={clsx(
                      "transition-opacity",
                      addedPulse ? "opacity-0" : "opacity-100",
                    )}>
                    {stock === 0 ? "Out of stock" : "Add to Bag"}
                  </span>
                  <AnimatePresence>{addedPulse && <AddedAnimation />}</AnimatePresence>
                </motion.button>

                <InlineHint show={!!uiError} text={uiError} />
              </motion.div>
            </div>
          </section>
          {/* ✅ Related Products */}
          <RelatedProductsSection
            title="Related Products"
            products={related}
            isLoading={loadingRelatedProducts}
          />
        </main>
      )}
    </Layout>
  );
}
