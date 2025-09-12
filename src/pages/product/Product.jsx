import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Layout";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useGetProductByIdQuery } from "../../redux/queries/productApi";
import Loader from "../../components/Loader";
import { Check } from "lucide-react";

function Product() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { data: product, isLoading, refetch } = useGetProductByIdQuery(productId);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [counter, setCounter] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product) {
      refetch();

      if (product.variants?.length > 0) {
        // Product with variants
        setActiveVariant(product.variants[0]);
        setActiveImage(product.variants[0].images?.[0]?.url || product.image?.[0]?.url);
        setSelectedSize(product.variants[0].sizes?.[0] || null);
      } else {
        // Product without variants
        setActiveVariant(null);
        setActiveImage(product.image?.[0]?.url || "/placeholder.svg");
        setSelectedSize(null);
      }
    }
  }, [product, refetch]);

  const stock = activeVariant ? selectedSize?.stock || 0 : product?.countInStock || 0;

  const handleIncrement = () => {
    if (counter < stock) setCounter(counter + 1);
  };

  const handleDecrement = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  const handleAddToCart = () => {
    if (activeVariant && !selectedSize) {
      return toast.error("Please select a size", { position: "top-center" });
    }

    if (stock === 0) {
      return toast.error("Out of stock", { position: "top-center" });
    }

    const productInCart = cartItems.find(
      (p) =>
        p._id === product._id &&
        (activeVariant
          ? p.variantId === activeVariant._id && p.variantSize === selectedSize?.size
          : true)
    );

    if (productInCart && productInCart.qty >= stock) {
      return toast.error("You can't add more", { position: "top-center" });
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
      })
    );

    toast.success(`${product.name} added to cart`, { position: "top-center" });
  };

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mt-[100px] justify-end px-4 mx-auto flex flex-col sm:flex-row gap-10 min-h-screen">
          {/* Left: Product Image */}
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-[500px] flex flex-col items-center">
            <div className="w-full h-[500px] overflow-hidden rounded-xl shadow-lg">
              <img
                src={activeImage}
                loading="lazy"
                alt={product?.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-5 justify-center flex-wrap">
              {(activeVariant?.images?.length > 0 ? activeVariant.images : product?.image).map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className={clsx(
                      "w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200",
                      img.url === activeImage
                        ? "border-2 border-blue-500 opacity-70 shadow-md"
                        : "border border-gray-300 hover:opacity-80"
                    )}
                    onClick={() => setActiveImage(img.url)}
                  />
                )
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="relative  flex flex-col rounded-2xl p-8 lg:p-12 w-full sm:w-1/2 md:w-1/2  ">
            <h1 className="text-3xl font-extrabold mb-4">{product?.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{product?.description}</p>
            {stock < 5 && (
              <p className="absolute top-0 px-2 py-1 text-orange-500 bg-orange-50 border border-orange-500 rounded-full">
                Only {stock} left in stock
              </p>
            )}
            {/* Color selection */}
            {product?.variants?.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold block mb-2">Color:</span>
                <div className="flex gap-3 flex-wrap">
                  {product?.variants?.map((variant) => (
                    <button
                      key={variant._id}
                      className={clsx(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform"
                      )}
                      style={{ backgroundColor: variant?.color?.toLowerCase() }}
                      onClick={() => {
                        setActiveVariant(variant);
                        setActiveImage(variant.images?.[0]?.url || product.image?.[0]?.url);
                        setSelectedSize(variant.sizes?.[0] || null);
                        setCounter(1);
                      }}>
                      {activeVariant?._id === variant._id && (
                        <Check className="w-6 h-6 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {activeVariant?.sizes?.length > 0 && (
              <div className="mb-6">
                <span className="font-semibold block mb-2">Sizes:</span>
                <div className="flex gap-3 flex-wrap">
                  {activeVariant?.sizes?.map((s) => (
                    <span
                      key={s.size}
                      className={clsx(
                        "w-10 h-10 border-2 flex items-center justify-center rounded-full cursor-pointer transition-all",
                        selectedSize?.size === s.size ? "bg-black text-white" : "hover:bg-gray-100"
                      )}
                      onClick={() => {
                        setSelectedSize(s);
                        setCounter(1);
                      }}>
                      {s.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {product.hasDiscount ? (
                <div className="flex flex-col">
                  <span className="line-through text-gray-500 text-lg">
                    {product?.price?.toFixed(3)} KD
                  </span>
                  <span className="text-green-600 font-bold text-3xl">
                    {product?.discountedPrice?.toFixed(3)} KD
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">{product?.price?.toFixed(3)} KD</span>
              )}
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handleDecrement}
                className={clsx(
                  "px-4 py-2 border rounded-md font-bold text-2xl transition-all",
                  counter === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                )}>
                -
              </button>
              <span className="text-2xl font-semibold">{counter}</span>
              <button
                onClick={handleIncrement}
                className={clsx(
                  "px-4 py-2 border rounded-md font-bold text-2xl transition-all",
                  counter >= stock
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                )}>
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              className={clsx(
                "px-6 py-4  rounded-xl font-bold uppercase transition-all shadow-md",
                stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black"
              )}
              onClick={handleAddToCart}
              disabled={stock === 0}>
              {stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Product;
