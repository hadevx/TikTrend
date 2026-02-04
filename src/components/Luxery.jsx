import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex">
      {/* Left content - 20% */}
      <div className="hidden lg:flex bg-black items-center justify-center w-[22%]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-background -rotate-90 whitespace-nowrap">
          <span className="text-xs text-white tracking-[0.3em] uppercase">
            Autumn / Winter 2026
          </span>
        </motion.div>
      </div>

      {/* Right content - 80% */}
      <div className="flex-1 relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/shop-hero-luxury-fashion-collection.jpg"
            alt="Elegant fashion model in dark clothing"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content overlay */}
        <div className="relative text-white z-10 h-full flex flex-col justify-end p-8 lg:p-16 pb-24 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-2xl">
            <h1 className="font-playfair text-white text-4xl md:text-5xl lg:text-7xl text-background leading-[1.1] mb-6 text-balance">
              The Art of
              <br />
              Quiet Luxury
            </h1>

            <p className="text-background/80 text-base font-inter lg:text-lg tracking-wide mb-10 max-w-md leading-relaxed">
              Timeless pieces crafted with intention. Where heritage meets modern refinement.
            </p>

            <motion.a
              href="/all-products"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex">
              <button
                type="button"
                className="inline-flex font-inter text-black bg-white items-center justify-center  bg-background font-bold  hover:bg-background/90 px-5 py-4 text-sm tracking-[0.2em] uppercase group">
                Discover Collection
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-[1px] h-12 bg-background/50"
          />
        </motion.div>
      </div>
    </section>
  );
}
