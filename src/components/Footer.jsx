import { useMemo } from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook } from "lucide-react";
import webschema from "/images/webschema.png";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  // Minimal, essential links only
  const footerLinks = useMemo(
    () => ({
      Shop: [
        { name: "All Products", href: "/all-products" },
        { name: "New Arrivals", href: "/all-products" },
      ],
      Support: [
        { name: "Contact", href: "/contact" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ],
      Legal: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
      ],
    }),
    [],
  );

  const socialLinks = useMemo(
    () => [
      { name: "Instagram", icon: Instagram, href: "#" },
      { name: "Twitter", icon: Twitter, href: "#" },
      { name: "Facebook", icon: Facebook, href: "#" },
    ],
    [],
  );

  return (
    <footer className={clsx(pathname === "/profile" && "hidden")}>
      <div className="relative p-5 sm:p-0 overflow-hidden border-t border-neutral-200 bg-neutral-950 text-white">
        {/* soft glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-220px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-40 bottom-[-220px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container-custom relative px-4 sm:px-6 py-12 lg:py-16">
          {/* Top */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">WebSchema</h3>
                    <p className="text-xs text-white/60">Simple. Premium. Reliable.</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  Thoughtfully curated pieces with a smooth shopping experience.
                </p>

                <div className="mt-5 flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70
                                 hover:text-white hover:bg-white/10 transition"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label={social.name}>
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {Object.entries(footerLinks).map(([category, links], idx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.06 }}>
                    <h4 className="text-sm font-semibold text-white">{category}</h4>
                    <ul className="mt-4 space-y-3">
                      {links.map((l) => (
                        <li key={l.name}>
                          <Link
                            to={l.href}
                            className="inline-flex items-center text-sm text-white/70 hover:text-white transition">
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <motion.div
            className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}>
            <p className="text-sm text-white/60">© {currentYear} WebSchema. All rights reserved.</p>

            <a
              href="https://webschema.online"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
              <span>Created by</span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <img
                  src={webschema}
                  alt="webschema.online"
                  className="h-5 w-5 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]"
                />
                <span className="text-white/80">webschema</span>
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
