import { useState, useEffect } from "react";
import Layout from "../../Layout";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Truck } from "lucide-react";
import { removeFromCart, updateCart } from "../../redux/slices/cartSlice";
import Message from "../../components/Message";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery, useGetAllProductsQuery } from "../../redux/queries/productApi";
import Lottie from "lottie-react";
import empty from "./empty.json";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { data: deliveryStatus } = useGetDeliveryStatusQuery();
  const { data: products } = useGetAllProductsQuery();
  const { data: userAddress } = useGetAddressQuery(userInfo?._id);

  // Remove non-existing products from cart
  useEffect(() => {
    if (products && cartItems.length > 0) {
      const validKeys = new Set([
        // Variant products
        ...products.flatMap((p) =>
          p.variants.flatMap((v) => v.sizes.map((s) => `${p._id}-${v._id}-${s.size}`))
        ),
        // Non-variant products
        ...products.filter((p) => !p.variants?.length).map((p) => `${p._id}-null-null`),
      ]);

      cartItems.forEach((item) => {
        const key = `${item._id}-${item.variantId ?? "null"}-${item.variantSize ?? "null"}`;
        if (!validKeys.has(key)) {
          dispatch(removeFromCart(item));
        }
      });
    }
  }, [products, cartItems, dispatch]);

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleChange = (e, item) => {
    const newQty = Number(e.target.value);
    dispatch(updateCart({ ...item, qty: newQty }));
  };

  const handleGoToPayment = () => {
    if (!userInfo) {
      navigate("/login");
      toast.info("You need to login first", { position: "top-center" });
      return;
    }
    if (!userAddress) {
      navigate("/profile");
      toast.info("Add your address", { position: "top-center" });
      return;
    }
    navigate("/payment");
  };

  const subTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.hasDiscount ? item.discountedPrice : item.price) * item.qty,
      0
    );
  };

  const totalCost = () => {
    const itemsTotal = cartItems.reduce((acc, item) => {
      const itemPrice = item.hasDiscount ? item.discountedPrice : item.price; // Use discountedPrice only if hasDiscount is true
      return acc + itemPrice * item.qty;
    }, 0);

    const deliveryFee = Number(deliveryStatus?.[0]?.shippingFee ?? 0);
    return itemsTotal + deliveryFee;
  };

  return (
    <Layout>
      <div className="px-4 lg:px-52 mt-[100px] lg:mt-32 min-h-screen flex gap-5 lg:gap-10 flex-col lg:flex-row lg:justify-between">
        {/* Cart Table */}
        <div className="w-full lg:w-[1000px]">
          <h1 className="font-bold text-3xl mb-5">Cart</h1>

          {cartItems?.length === 0 ? (
            <>
              <Message dismiss={false}>Your cart is empty</Message>
              <div className="w-96 mx-auto">
                <Lottie animationData={empty} loop={true} />
              </div>
            </>
          ) : (
            <table className="min-w-full overflow-x-scroll">
              <thead>
                <tr>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Product
                  </th>

                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Variant
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Price
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Quantity
                  </th>
                  <th className="px-2 lg:px-4 py-2 border-b border-gray-300 text-left text-sm font-extrabold text-gray-600">
                    Total
                  </th>
                  <th className="px-2 lg:px-4 py-2 lg:border-b lg:border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => {
                  const stock = item.stock ?? 0; // Always use stock if available
                  return (
                    <tr
                      key={`${item._id}-${item.variantId ?? "null"}-${
                        item.variantSize ?? "null"
                      }-${idx}`}
                      className="hover:bg-zinc-100/40">
                      {/* Product Image */}
                      <td className="px-0 lg:px-4 py-10 border-b border-gray-300 ">
                        <Link to={`/products/${item._id}`} className="flex items-center gap-2">
                          <img
                            src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                            alt={item.name}
                            className="w-16 h-16 lg:w-24 lg:h-24 bg-zinc-100/50 border-2 object-cover rounded-xl"
                          />
                          <p className="truncate max-w-[100px] md:max-w-[200px]"> {item.name}</p>
                        </Link>
                      </td>

                      <td className="px-2 lg:px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                        {item.variantColor ?? "-"} / {item.variantSize ?? "-"}
                      </td>

                      {item.hasDiscount ? (
                        <td className=" lg:px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                          {item.discountedPrice.toFixed(3)} KD
                        </td>
                      ) : (
                        <td className=" lg:px-4 py-2 border-b border-gray-300 text-sm text-gray-800">
                          {item.price.toFixed(3)} KD
                        </td>
                      )}

                      <td className="lg:px-4 py-2 border-b border-gray-300">
                        <select
                          value={item.qty}
                          onChange={(e) => handleChange(e, item)}
                          disabled={stock === 0}
                          className="border bg-zinc-100/50 lg:w-[100px] p-2 rounded focus:border-blue-500">
                          {[...Array(stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      {item.hasDiscount ? (
                        <td className=" py-2 border-b border-gray-300 text-sm text-gray-800">
                          {(item.discountedPrice * item.qty).toFixed(3)} KD
                        </td>
                      ) : (
                        <td className=" py-2 border-b border-gray-300 text-sm text-gray-800">
                          {(item.price * item.qty).toFixed(3)} KD
                        </td>
                      )}

                      <td className="lg:px-4 py-2 lg:border-b lg:border-gray-300">
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-black transition-all duration-300 hover:bg-zinc-200 hover:text-red-500  rounded-lg">
                          <Trash2 strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Cart Summary */}
        <div className="rounded-3xl lg:w-[600px] px-2 lg:px-20">
          <h1 className="font-bold text-3xl mb-5">Summary</h1>
          <div className="w-full border border-gray-500/20 mb-5"></div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>{subTotal().toFixed(3)} KD</p>
            </div>

            <div className="flex justify-between">
              <p className="flex gap-2">
                Delivery: <Truck strokeWidth={1} />
              </p>
              <p>{deliveryStatus?.[0].shippingFee?.toFixed(3) ?? "Free"} KD</p>
            </div>

            <div className="flex justify-between">
              <p>Expected delivery:</p>
              <p className="uppercase">{deliveryStatus?.[0].timeToDeliver}</p>
            </div>

            <div className="w-full border border-gray-500/20 mb-5"></div>

            <div className="flex justify-between">
              <p>Total:</p>
              <p>{totalCost().toFixed(3)} KD</p>
            </div>

            {cartItems.length > 0 && totalCost() < deliveryStatus?.[0].minDeliveryCost && (
              <div className="p-3 bg-rose-50 rounded-lg text-rose-500 font-bold">
                Minimum order: {deliveryStatus?.[0].minDeliveryCost.toFixed(3)} KD
              </div>
            )}

            <button
              onClick={handleGoToPayment}
              disabled={cartItems.length === 0 || totalCost() < deliveryStatus?.[0].minDeliveryCost}
              className={clsx(
                "bg-gradient-to-t mt-5 mb-10 text-white p-3 rounded-lg w-full font-bold",
                cartItems.length === 0 || totalCost() < deliveryStatus?.[0].minDeliveryCost
                  ? "from-zinc-300 to-zinc-200 border"
                  : "from-zinc-900 to-zinc-700 hover:bg-gradient-to-b"
              )}>
              Go to payment
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
