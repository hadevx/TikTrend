import { useState } from "react";
import Layout from "../../Layout";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { HandCoins, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAddressQuery } from "../../redux/queries/userApi";
import { useGetDeliveryStatusQuery } from "../../redux/queries/productApi";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { usePayment } from "../../hooks/usePayment";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const userInfo = useSelector((state) => state.auth.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const { data: userAddress, refetch, isLoading } = useGetAddressQuery(userInfo?._id);
  const { data: deliveryStatus } = useGetDeliveryStatusQuery();

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const {
    totalAmount,
    amountInUSD,
    loadingCreateOrder,
    loadingCheck,
    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  } = usePayment(cartItems, userAddress, paymentMethod, deliveryStatus);

  console.log(cartItems);
  return (
    <Layout>
      <div className="min-h-screen lg:mt-[100px]">
        <div className="flex mt-[70px] flex-col-reverse py-10 lg:flex-row gap-5 lg:gap-10 px-5 lg:px-60 lg:mt-5">
          <div className="flex lg:w-[50%] gap-5 flex-col">
            <div className="flex bg-white shadow transition-all duration-300 flex-col gap-5 border  p-7   rounded-lg">
              <h1 className="font-extrabold text-lg ">Shipping Address</h1>
              <hr />

              <div className="flex gap-10 ">
                <div className="flex   flex-col gap-2 ">
                  <h1 className="text-gray-700">Governorate:</h1>
                  <h1 className="text-gray-700">City:</h1>
                  <h1 className="text-gray-700">Block:</h1>
                  <h1 className="text-gray-700">Street:</h1>
                  <h1 className="text-gray-700">House:</h1>
                </div>
                {isLoading ? (
                  <Spinner className="border-t-black" />
                ) : (
                  <div className="flex flex-col   gap-2 ">
                    <h1 className="font-bold">{userAddress?.governorate}</h1>
                    <h1 className="font-bold">{userAddress?.city}</h1>
                    <h1 className="font-bold">{userAddress?.block}</h1>
                    <h1 className="font-bold">{userAddress?.street}</h1>
                    <h1 className="font-bold">{userAddress?.house}</h1>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h2 className="font-bold text-lg mb-4">Payment Method</h2>
              <div className="space-y-4">
                {/* Cash Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "cash"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <HandCoins className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Cash on Delivery</span>
                </label>

                {/* PayPal Option */}
                <label
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    paymentMethod === "paypal"
                      ? "border-indigo-600 bg-indigo-50 shadow"
                      : "border-gray-300 hover:border-gray-400"
                  )}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentChange}
                    className="form-radio text-indigo-600 focus:ring-indigo-500"
                  />
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-800">Credit Card</span>
                </label>

                {/* PayPal Button */}
                {paymentMethod === "paypal" && (
                  <div className="mt-5">
                    <PayPalButtons
                      disabled={loadingCheck || loadingCreateOrder}
                      fundingSource={FUNDING.CARD} // Show only card funding option
                      createOrder={createPayPalOrder(userInfo, amountInUSD)}
                      onApprove={handlePayPalApprove}
                      onError={(err) => {
                        toast.error("PayPal payment failed");
                        console.error(err);
                      }}
                    />
                  </div>
                )}
              </div>

              {paymentMethod === "cash" && (
                <button
                  disabled={loadingCreateOrder || loadingCheck}
                  onClick={handleCashPayment}
                  className={clsx(
                    "w-full mt-5 py-4 flex justify-center  font-bold transition-all duration-300 shadow",
                    loadingCreateOrder || loadingCheck
                      ? "bg-gray-300 text-black"
                      : "bg-zinc-900 hover:bg-zinc-700 text-white  transition-all duration-300"
                  )}>
                  {loadingCheck
                    ? "Checking stock..."
                    : loadingCreateOrder
                    ? "Placing order..."
                    : "Place Order"}
                </button>
              )}
            </div>
          </div>
          {/* ------ */}
          <div className="flex shadow transition-all duration-300  lg:w-[50%] flex-col  gap-2 border bg-white p-7  rounded-lg">
            <h1 className="font-extrabold text-lg  ">Your Cart</h1>
            <hr />
            <div className="flex gap-20 ">
              <div className="flex flex-col gap-2 ">
                <h1 className="text-gray-700">Subtotal:</h1>
                <h1 className="text-gray-700">Shipping:</h1>
                <hr />
                <h1 className="text-gray-700">Total:</h1>
              </div>
              <div className="flex flex-col gap-2 mb-5">
                <h1 className="font-bold">
                  {cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(3)} KD
                </h1>
                <h1 className="font-bold">{deliveryStatus?.[0].shippingFee.toFixed(3)} KD</h1>
                <hr />
                <h1 className="font-bold">{totalAmount.toFixed(3)} KD</h1>
              </div>
            </div>
            {cartItems.map((item) => (
              <>
                <div key={item._id} className="flex items-center   justify-between">
                  <div className="flex items-center">
                    <img
                      src={item?.variantImage?.[0].url || item.image?.[0].url}
                      alt="product image"
                      className="w-11 h-11 bg-white rounded-lg   object-cover"
                    />
                    <p className="px-4 truncate max-w-[100px] sm:max-w-[200px]  text-sm text-gray-800">
                      {item.name}
                    </p>
                    {item.variants.length > 0 && (
                      <p className="px-4   text-sm text-gray-800">
                        {item.variantColor + "/" + item.variantSize}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="px-4   text-sm text-gray-800">
                      {item.qty} x {item.price.toFixed(3)} KD
                    </p>
                    <p className="px-4   text-sm text-gray-800">
                      {(item.qty * item.price).toFixed(3)} KD
                    </p>
                  </div>
                </div>
                <hr />
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Payment;
