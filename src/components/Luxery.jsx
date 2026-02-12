import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// --- helpers: word-by-word stagger animation ---
function splitWords(text = "") {
  return String(text).trim().split(/\s+/).filter(Boolean);
}

const wordContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const wordUp = {
  hidden: { y: 22, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedWords({ text, className }) {
  const reduce = useReducedMotion();
  const words = splitWords(text);

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span className={className} variants={wordContainer} initial="hidden" animate="show">
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} className="inline-block mr-[0.28em]" variants={wordUp}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

// --- hero container animation (stagger blocks) ---
const heroStack = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-screen flex">
      {/* Left content - 20% */}
      <div className="hidden lg:flex bg-black items-center justify-center w-[22%]">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
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
            variants={heroStack}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "show"}
            className="max-w-2xl">
            {/* NEW: staggered hero text animation */}
            <motion.h1
              variants={fadeUp}
              className="font-playfair text-white text-4xl md:text-5xl lg:text-7xl text-background leading-[1.1] mb-6 text-balance">
              <AnimatedWords text="The Art of" /> <br />
              <AnimatedWords text="Quiet Luxury" />
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-background/80 text-base font-inter lg:text-lg tracking-wide mb-10 max-w-md leading-relaxed">
              <AnimatedWords text="Timeless pieces crafted with intention. Where heritage meets modern refinement." />
            </motion.p>

            <motion.a
              variants={fadeUp}
              href="/all-products"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="inline-flex">
              <button
                type="button"
                className="inline-flex font-inter text-black bg-white items-center justify-center bg-background font-bold hover:bg-background/90 px-5 py-4 text-sm tracking-[0.2em] uppercase group">
                Discover Collection
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
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
