import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "../../Layout";

// ---- Clothing ecommerce story content (editable) ----
const timeline = [
  {
    year: "2012",
    title: "The First Drop",
    description:
      "We started with a small capsule of essentials—tees, denim, and outerwear—built around fit, fabric, and repeat wear.",
  },
  {
    year: "2016",
    title: "Fit & Fabric Lab",
    description:
      "We opened our in-house sampling program to refine patterns, test shrinkage, and improve stitching—so every piece feels better with time.",
  },
  {
    year: "2019",
    title: "Responsible Sourcing",
    description:
      "We began working with vetted mills and suppliers, prioritizing traceability and lower-impact materials without compromising feel.",
  },
  {
    year: "2022",
    title: "Community Built",
    description:
      "Customer feedback shaped our best-sellers—improved fits, better waistbands, upgraded linings, and fabrics that hold their shape.",
  },
  {
    year: "2026",
    title: "Everyday, Elevated",
    description:
      "Today we design modern wardrobe staples—clean silhouettes, premium fabrics, and details you notice in the mirror, not the logo.",
  },
];

// Using online images + text overlay on the image (requested)
const values = [
  {
    title: "Premium Materials",
    description:
      "We choose fabrics for softness, durability, and drape—then test them so they stay sharp after real life and real washes.",
    image:
      "https://images.unsplash.com/photo-1520975958225-25b5f9bda2a1?auto=format&fit=crop&w=1400&q=80",
    kicker: "Fabric First",
  },
  {
    title: "Tailored Fit",
    description:
      "Patterns are refined across sizes to keep proportions right—comfortable through the shoulders, clean through the waist, easy to move in.",
    image:
      "https://images.unsplash.com/photo-1520975869018-6f9f20f08a15?auto=format&fit=crop&w=1400&q=80",
    kicker: "Made to Move",
  },
  {
    title: "Quality Details",
    description:
      "Better zippers, stronger seams, cleaner finishes. The kind of quality you feel every time you put it on.",
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1400&q=80",
    kicker: "Built to Last",
  },
];

const craftsmen = [
  {
    name: "Lorenzo Benedetti",
    role: "Head of Production",
    years: "12 years",
    image:
      "https://images.unsplash.com/photo-1520975682193-cb7e3a88c42f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Sofia Marchetti",
    role: "Lead Designer",
    years: "9 years",
    image:
      "https://images.unsplash.com/photo-1520975741351-1e5b9fc5f386?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Alessandro Rossi",
    role: "Quality Director",
    years: "10 years",
    image:
      "https://images.unsplash.com/photo-1520975730708-5b6e1d2a10a8?auto=format&fit=crop&w=1400&q=80",
  },
];

// ---- Text animation helpers (repeats every time it enters view: NOT once) ----
function splitWords(text = "") {
  return String(text).trim().split(/\s+/).filter(Boolean);
}

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const wordUp = {
  hidden: { y: 18, opacity: 0, filter: "blur(6px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedWords({ text, className }) {
  const reduce = useReducedMotion();
  const words = splitWords(text);

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.65, margin: "-80px" }} // ✅ not once
    >
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} className="inline-block mr-[0.28em]" variants={wordUp}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function AboutPage() {
  const reduce = useReducedMotion();

  return (
    <Layout>
      <main className="min-h-screen bg-white text-zinc-900">
        {/* Introduction (no hero) */}
        <section className="pt-24 lg:pt-28 pb-14 lg:pb-16 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-5 block">
              About
            </motion.span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance text-zinc-900">
              <AnimatedWords text="Designed for everyday wear. Built to last." />
            </h1>

            <p className="mt-5 text-zinc-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              <AnimatedWords text="We create modern wardrobe staples—premium fabrics, clean silhouettes, and details you feel. The goal is simple: pieces that look great, fit right, and stay in rotation." />
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <span className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-4 block">
                Our Journey
              </span>
              <h2 className="font-serif text-3xl lg:text-5xl text-zinc-900">
                <AnimatedWords text="A story shaped by fit, fabric, and feedback." />
              </h2>
              <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
                <AnimatedWords text="We refine continuously—so the pieces you love get even better over time." />
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200" />

              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ amount: 0.35, margin: "-80px" }} // ✅ not once
                  transition={{ duration: 0.65, delay: index * 0.06 }}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-12 mb-10 lg:mb-14 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="inline-flex items-start gap-4 rounded-3xl bg-white ring-1 ring-black/10 shadow-sm p-5 lg:p-6">
                      <div className="shrink-0">
                        <div className="font-serif text-3xl text-zinc-900/25 leading-none">
                          {item.year}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-serif text-xl lg:text-2xl text-zinc-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm lg:text-base text-zinc-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block relative z-10">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/10 shadow-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    </div>
                  </div>

                  <div className="hidden lg:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}

        {/* Team */}
        {/*  <section className="py-16 lg:py-24 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 lg:mb-16">
              <span className="text-xs tracking-[0.4em] uppercase text-white/55 mb-4 block">
                The People
              </span>
              <h2 className="font-serif text-3xl lg:text-5xl">
                <AnimatedWords text="Design, production, and quality — together." />
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {craftsmen.map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ amount: 0.35, margin: "-80px" }}
                  transition={{ duration: 0.65, delay: index * 0.08 }}
                  className="text-center">
                  <div className="rounded-[28px] overflow-hidden bg-white/5 ring-1 ring-white/10 shadow-[0_26px_80px_rgba(0,0,0,0.55)]">
                    <div className="relative aspect-[4/5] bg-white/5">
                      <img
                        src={person.image || "/placeholder.svg"}
                        alt={person.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-xl lg:text-2xl">{person.name}</h3>
                      <p className="mt-1 text-white/70 text-sm">{person.role}</p>
                      <p className="mt-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/45">
                        {person.years}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Quote */}
        <section className="py-16 lg:py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.blockquote
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.55, margin: "-80px" }}
              transition={{ duration: 0.8 }}>
              <p className="font-serif text-2xl lg:text-4xl leading-relaxed mb-8 text-balance text-zinc-900">
                <AnimatedWords text="“The best piece isn’t the loudest — it’s the one you wear the most.”" />
              </p>
              <cite className="not-italic">
                <span className="block text-sm tracking-[0.2em] uppercase text-zinc-500">
                  — Studio Team
                </span>
              </cite>
            </motion.blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-zinc-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.55, margin: "-80px" }}>
              <span className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-4 block">
                Explore
              </span>
              <h2 className="font-serif text-3xl lg:text-5xl mb-6 text-zinc-900">
                <AnimatedWords text="Build your everyday wardrobe." />
              </h2>
              <p className="text-zinc-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                <AnimatedWords text="Shop essentials designed to fit well, feel better, and last longer." />
              </p>

              <Link
                to="/all-products"
                className="group inline-flex items-center gap-3 rounded-2xl bg-zinc-900 text-white px-8 py-4 text-sm font-extrabold shadow-[0_18px_60px_rgba(0,0,0,0.18)] hover:gap-4 transition-all">
                View Collection
                <ArrowRight className="h-4 w-4 stroke-[1.5]" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
