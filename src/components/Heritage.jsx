import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* Text animation variants */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const word = {
  hidden: {
    y: 28,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function AnimatedText({ text, className }) {
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ margin: "-80px" }} // 👈 retriggers when re-entering
      className={className}>
      {text.split(" ").map((wordText, i) => (
        <motion.span key={i} variants={word} className="inline-block mr-[0.25em]">
          {wordText}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function HeritageSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden font-playfair text-white">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <img
          src="/q.jpg"
          alt="Clothing craftsmanship"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ margin: "-80px" }}
            className="block mb-6 text-xs tracking-[0.4em] uppercase text-white/70">
            Our Collection
          </motion.span>

          {/* Headline */}
          <h2 className="font-serif text-4xl lg:text-6xl leading-[1.15] mb-8">
            <AnimatedText text="Elevated Everyday Wear," />
            <br />
            <AnimatedText text="Designed to Move With You" />
          </h2>

          {/* Description */}
          <p className="text-lg lg:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto mb-14">
            <AnimatedText text="Premium fabrics, refined silhouettes, and timeless essentials crafted for modern life. Designed for comfort, built for confidence." />
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
            {[
              { value: "2019", label: "Established" },
              { value: "150+", label: "Styles Released" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ margin: "-80px" }}>
                <span className="block mb-2 text-4xl lg:text-5xl font-serif">{item.value}</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white/60">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
