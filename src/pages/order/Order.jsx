import Layout from "../../Layout";
import { useGetOrderQuery } from "../../redux/queries/orderApi";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Package, Truck, CreditCard, Mail, CheckCircle2, XCircle } from "lucide-react";
import { usePDF } from "react-to-pdf";
import Invoice from "../../components/Invoise";
import Badge from "../../components/Badge";
import { Copy } from "@medusajs/ui";
import { motion } from "framer-motion";

// Small helper UI
const ShippingProgress = ({ order }) => {
  const isCanceled = !!order?.isCanceled;
  const isDelivered = !!order?.isDelivered;

  // 0 = placed, 1 = processing, 2 = shipped, 3 = delivered
  const step = isCanceled ? 0 : isDelivered ? 3 : 1;

  const label = isCanceled
    ? "Order canceled"
    : isDelivered
      ? `Delivered on ${order?.deliveredAt?.substring(0, 10)}`
      : "On the way to you";

  // Truck position along the track
  const truckX = step === 0 ? "0%" : step === 1 ? "35%" : step === 2 ? "70%" : "100%";

  return (
    <div className="rounded-xl border bg-white p-4 lg:p-6 shadow mb-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Shipping status</p>
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        </div>

        {isCanceled ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
            <XCircle className="w-4 h-4" /> Canceled
          </span>
        ) : isDelivered ? (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4" /> Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <Truck className="w-4 h-4" /> In transit
          </span>
        )}
      </div>

      {/* Track */}
      <div className="mt-5 relative">
        {/* background line */}
        <div className="h-2 rounded-full bg-gray-100 border" />

        {/* animated fill */}
        {!isCanceled && (
          <motion.div
            className="absolute left-0 top-0 h-2 rounded-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: step === 1 ? "35%" : step === 2 ? "70%" : "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
        )}

        {/* animated truck */}
        <motion.div
          className="absolute -top-4"
          initial={{ left: "0%" }}
          animate={{ left: truckX }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          style={{ transform: "translateX(-50%)" }}>
          <motion.div
            className={`w-10 h-10 rounded-xl border shadow-sm flex items-center justify-center ${
              isCanceled ? "bg-red-50 border-red-100" : "bg-white"
            }`}
            animate={
              isCanceled ? { rotate: 0 } : { y: [0, -2, 0] } // subtle bounce
            }
            transition={
              isCanceled
                ? { duration: 0.2 }
                : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            }>
            <Truck className={`w-5 h-5 ${isCanceled ? "text-red-500" : "text-blue-600"}`} />
          </motion.div>
        </motion.div>

        {/* step markers */}
        <div className="mt-6 grid grid-cols-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className={step >= 0 && !isCanceled ? "text-gray-700 font-medium" : ""}>
              Placed
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className={step >= 1 && !isCanceled ? "text-gray-700 font-medium" : ""}>
              Processing
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            <span className={step >= 2 && !isCanceled ? "text-gray-700 font-medium" : ""}>
              Shipped
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className={step >= 3 && !isCanceled ? "text-gray-700 font-medium" : ""}>
              Delivered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { orderId } = useParams();
  const { data: order } = useGetOrderQuery(orderId);

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${order?.createdAt?.substring(0, 10)}.pdf`,
  });

  const calculateSubtotal = () => {
    return order?.orderItems?.reduce((total, item) => total + item.qty * item.price, 0).toFixed(3);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return (Number(subtotal) + Number(order?.shippingPrice)).toFixed(3);
  };

  const handlePdf = () => toPDF();

  return (
    <Layout>
      <div className="container mt-[70px] mx-auto p-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Order placed, Thank you &hearts;</h1>
            <p className="text-sm text-gray-500 mt-1">
              We’ll keep you updated as your order moves through delivery.
            </p>
          </div>

          {/* NEW: animated truck progress */}
          <ShippingProgress order={order} />

          <div className="bg-white rounded-lg shadow border p-3 lg:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm lg:text-xl lg:flex lg:items-center lg:gap-2 font-semibold text-gray-800">
                  Id #{order?._id} <Copy content={order?._id} />
                </h2>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium">
                {order?.isDelivered ? (
                  <Badge variant="success">
                    Delivered on {order?.deliveredAt?.substring(0, 10)}
                  </Badge>
                ) : order?.isCanceled ? (
                  <Badge variant="danger">Canceled</Badge>
                ) : (
                  <Badge variant="pending">Processing</Badge>
                )}
              </span>
            </div>

            <div className="mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Color/Size</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderItems?.map((item) => (
                    <tr key={item._id} className="border-b text-sm">
                      <td className="py-2 truncate flex items-center gap-2 max-w-[120px] sm:max-w-[200px]">
                        <img
                          src={item?.variantImage?.[0]?.url || item.image?.[0]?.url}
                          alt={item.name}
                          className="w-12 h-12 lg:w-14 lg:h-14 bg-zinc-100/50 border-2 object-cover rounded-xl"
                        />
                        <p className="truncate">{item.name}</p>
                      </td>

                      {item.variantColor || item.size ? (
                        <td className="py-2">
                          {item.variantColor} / {item.variantSize}
                        </td>
                      ) : (
                        <td className="py-2">-</td>
                      )}

                      <td className="text-center py-2">{item.qty}</td>
                      <td className="text-right py-2">{item.price.toFixed(3)} KD</td>
                      <td className="text-right py-2">{(item.qty * item.price).toFixed(3)} KD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-3">Subtotal: {calculateSubtotal()} KD</p>
                <p className="text-sm text-gray-600 mb-3">
                  Shipping: {order?.shippingPrice?.toFixed(3)} KD
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-2">
                  Total: {calculateTotal()} KD
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-3 lg:p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2">
                  <p className="font-medium">Name:</p>
                  <p className="text-gray-700">{userInfo?.name}</p>
                </div>
                <div className="mb-2">
                  <p className="font-medium">Email:</p>
                  <p className="text-gray-700 break-words">{userInfo?.email}</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">Shipping Address:</p>
                <p className="text-gray-700">Governorate: {order?.shippingAddress?.governorate}</p>
                <p className="text-gray-700">City: {order?.shippingAddress?.city}</p>
                <p className="text-gray-700">Block: {order?.shippingAddress?.block}</p>
                <p className="text-gray-700">Street: {order?.shippingAddress?.street}</p>
                <p className="text-gray-700">House: {order?.shippingAddress?.house}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePdf}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Download Invoice
            </button>

            <Link
              to="mailto:hn98q8@hotmail.com"
              className="bg-gray-300 flex gap-3 hover:bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded transition duration-300">
              Contact us <Mail />
            </Link>
          </div>
        </div>

        {/* Hidden invoice template for PDF generation */}
        <div
          ref={targetRef}
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            height: "auto",
            width: "auto",
          }}>
          <Invoice order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default Order;
