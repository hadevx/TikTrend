import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import {
  useCreateOrderMutation,
  usePayOrderMutation,
  useCheckStockMutation,
} from "../redux/queries/orderApi";
import { useUpdateStockMutation } from "../redux/queries/productApi";

export function usePayment(cartItems, userAddress, paymentMethod, deliveryStatus) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();
  const [checkStock] = useCheckStockMutation(); // backend stock check
  const [updateStock] = useUpdateStockMutation(); // update stock after order
  const [exchangeRate, setExchangeRate] = useState(3.25); // fallback rate

  const calculateTotalCost = () => {
    const items = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const deliveryFee = Number(Number(deliveryStatus?.[0]?.shippingFee || 0).toFixed(3));
    return items + deliveryFee;
  };

  const totalAmount = calculateTotalCost();

  // ✅ Cash payment
  const handleCashPayment = async () => {
    try {
      // Prepare minimal payload
      const stockPayload = cartItems.map((item) => ({
        productId: item._id,
        variantId: item.variantId || null,
        size: item.variantSize || null,
        qty: item.qty,
      }));

      // Check stock from backend
      const stockResult = await checkStock(stockPayload).unwrap();

      if (stockResult.outOfStockItems?.length > 0) {
        toast.error(
          `Out of stock: ${stockResult.outOfStockItems
            .map((i) => i.productName || i.productId)
            .join(", ")}`
        );
        return;
      }

      // Map full order items for order creation
      const orderItemsMapped = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
        variantId: item.variantId,
        variantColor: item.variantColor,
        variantSize: item.variantSize,
        variantImage: item.variantImage,
      }));

      const res = await createOrder({
        orderItems: orderItemsMapped,
        shippingAddress: userAddress,
        paymentMethod,
        itemsPrice: orderItemsMapped.reduce((a, c) => a + c.price * c.qty, 0),
        shippingPrice: deliveryStatus?.[0]?.shippingFee,
        totalPrice: totalAmount,
      }).unwrap();

      await updateStock({ orderItems: orderItemsMapped }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  // ✅ PayPal payment
  const handlePayPalApprove = async (data, actions) => {
    try {
      const stockResult = await checkStock({ cartItems }).unwrap();

      if (stockResult.outOfStockItems?.length > 0) {
        toast.error(
          `Out of stock: ${stockResult.outOfStockItems
            .map((i) => i.name || i.productId)
            .join(", ")}`
        );
        return;
      }

      const pendingOrder = await createOrder({
        orderItems: cartItems,
        shippingAddress: userAddress,
        paymentMethod,
        itemsPrice: cartItems.reduce((a, c) => a + c.price * c.qty, 0),
        shippingPrice: deliveryStatus?.[0]?.shippingFee,
        totalPrice: totalAmount,
        isPaid: false,
      }).unwrap();

      const details = await actions.order.capture();
      const transaction = details.purchase_units[0].payments.captures[0];

      await payOrder({
        orderId: pendingOrder._id,
        paymentResult: {
          id: transaction.id,
          status: transaction.status,
          update_time: transaction.update_time,
          email_address: details.payer.email_address,
        },
      }).unwrap();

      dispatch(clearCart());
      toast.success("Order created successfully");
      navigate(`/order/${pendingOrder._id}`);
    } catch (error) {
      toast.error("Something went wrong. Please contact support.");
    }
  };

  // Fetch exchange rate (KWD → USD)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("kwdToUsdRate"));
        const now = Date.now();

        if (storedData && now - storedData.timestamp < 24 * 60 * 60 * 1000) {
          setExchangeRate(storedData.rate);
          return;
        }

        const res = await fetch("https://open.er-api.com/v6/latest/KWD");
        const data = await res.json();

        if (data?.result === "success") {
          setExchangeRate(data.rates.USD);
          localStorage.setItem(
            "kwdToUsdRate",
            JSON.stringify({ rate: data.rates.USD, timestamp: now })
          );
        } else {
          toast.error("Failed to fetch exchange rate");
        }
      } catch {
        toast.error("Using fallback exchange rate");
      }
    };
    fetchRate();
  }, []);

  const amountInUSD = (totalAmount * exchangeRate).toFixed(2);
  // ✅ PayPal create order function
  const createPayPalOrder = (userInfo, amountInUSD) => async (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `Order for ${userInfo?.name || "Customer"}`,
          amount: {
            currency_code: "USD",
            value: amountInUSD,
          },
        },
      ],
    });
  };

  return {
    totalAmount,
    amountInUSD,
    loadingCreateOrder,
    handleCashPayment,
    handlePayPalApprove,
    createPayPalOrder,
  };
}
