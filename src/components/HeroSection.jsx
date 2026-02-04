import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import { ArrowRight, PackageCheck, Rocket, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import BlurPanel from "./BlurPanel";

export function HeroSection() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // ✅ Online video source (direct .mp4)
  const VIDEO_SRC =
    "https://cdn.coverr.co/videos/coverr-a-model-walking-down-the-street-9719/1080p.mp4";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.03, 1]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Small helper: split text into animated chars (optional)
  const AnimatedText = useMemo(() => {
    return function AnimatedText({ text, delay = 0 }) {
      return (
        <span>
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + i * 0.025,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              style={{ display: char === " " ? "inline" : "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      );
    };
  }, [reduceMotion]);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: reduceMotion ? 1 : videoScale,
          y: reduceMotion ? 0 : videoY,
        }}>
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover object-[50%_60%]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            // If you want a fallback image while video loads:
            // poster="https://images.pexels.com/photos/..."
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70" />
          <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_50%_35%,rgba(255,255,255,0.10),transparent_55%)]" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center"
        style={{ y: reduceMotion ? 0 : contentY, opacity: reduceMotion ? 1 : contentOpacity }}>
        <div className="container-custom px-6 md:px-10 text-white">
          <div className="max-w-4xl">
            {/* Badge */}
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Designed in Kuwait • Modern essentials
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight">
                <AnimatedText text="Elevate your style" delay={0.35} />
                <br />
                <span className="italic font-light text-white/90">
                  <AnimatedText text="with timeless fashion." delay={0.85} />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-base md:text-xl leading-relaxed text-white/85">
                Minimal silhouettes. Premium fabrics. Built for real life—work, weekends, and
                everything in between. Designed in{" "}
                <img
                  src="https://flagcdn.com/w20/kw.png"
                  alt="Kuwait Flag"
                  className="w-5 h-5 inline-block align-[-2px]"
                  loading="lazy"
                />{" "}
                Kuwait.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="#shop"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm md:text-base font-semibold shadow-lg shadow-black/30 transition hover:translate-y-[-1px] hover:bg-white/90">
                  Shop new arrivals <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#lookbook"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm md:text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/15">
                  View lookbook
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.div>

      {/* Bottom Info Strip */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 flex justify-center"
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}>
        <BlurPanel className="mx-6 mb-6 px-6 py-4 bg-black/25 backdrop-blur-md border-white/15">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/90">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm">Fast delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Based in Kuwait</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Exclusive offers</span>
            </div>
          </div>
        </BlurPanel>
      </motion.div>
    </section>
  );
}
