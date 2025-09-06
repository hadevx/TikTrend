import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import QuickLookModal from "./QuickLookModal";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function FeaturedProducts({ products, isLoading }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickLook = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <section className="py-20 lg:py-32" id="featured-products">
      <div className="container-custom">
        <Reveal>
          <div className="text-left mb-16 px-3">
            <h2 className="text-4xl text-neutral-900 mb-4 lg:text-6xl">
              Latest <span className="italic font-light">Products</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Discover our most beloved pieces, each crafted with meticulous attention to detail and
              timeless design principles.
            </p>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-2 px-3 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}>
          {products?.map((product, index) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}>
              <Reveal delay={index * 0.1}>
                <ProductCard product={product} onQuickLook={handleQuickLook} />
              </Reveal>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-5 items-center">
        <Link to="/all-products" className="bg-black text-white px-3 py-2 ">
          Show All
        </Link>
      </div>
      <QuickLookModal product={selectedProduct} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
