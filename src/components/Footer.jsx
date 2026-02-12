import { useMemo } from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Phone } from "lucide-react";
import webschema from "/images/webschema.png";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";
/**
 * Simple dark footer (consistent with ClothingHero / FeaturedProducts)
 * - neutral-950 base
 * - dotted grid + subtle vignette
 * - minimal columns + social icons
 */
export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();
  const { data: store } = useGetStoreStatusQuery(undefined);

  console.log(store);
  const footerLinks = useMemo(
    () => ({
      Shop: [
        { name: "All Products", href: "/all-products" },
        { name: "New Arrivals", href: "/all-products" },
      ],
      Support: [
        { name: "Contact", href: "/contact" },
        { name: "Shipping", href: "/about" },
        { name: "Returns", href: "/about" },
      ],
      Legal: [
        { name: "Privacy", href: "/about" },
        { name: "Terms", href: "/about" },
      ],
    }),
    [],
  );

  const socialLinks = useMemo(
    () => [
      { name: "Instagram", icon: Instagram, href: store?.[0]?.instagram || "#" },
      { name: "Twitter", icon: Twitter, href: store?.[0]?.twitter || "#" },
      { name: "WhatsApp", icon: Phone, href: `https://wa.me/${store?.[0]?.phoneNumber}` || "#" },
    ],
    [],
  );

  return (
    <footer className={clsx(pathname === "/profile" && "hidden")}>
      <div className="relative overflow-hidden border-t border-white/10 bg-neutral-950 text-white">
        {/* dotted grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "0 0",
          }}
        />
        {/* subtle vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 55% 45%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(900px 520px at 50% 70%, rgba(0,0,0,0.25), rgba(0,0,0,0.9) 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <span className="font-mono text-xs tracking-[0.35em] text-white/80">WS</span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">WEBSCHEMA</div>
                  <div className="text-xs text-white/55">Simple. Premium. Reliable.</div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Curated pieces with a smooth, secure checkout.
              </p>

              <div className="mt-4 flex items-center gap-2">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 text-white/75 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={s.name}
                    title={s.name}>
                    <s.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {Object.entries(footerLinks).map(([title, links]) => (
                  <div key={title}>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <ul className="mt-4 space-y-3">
                      {links.map((l) => (
                        <li key={l.name}>
                          <Link
                            to={l.href}
                            className="text-sm text-white/70 transition hover:text-white">
                            {l.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/60">© {currentYear} WebSchema. All rights reserved.</p>

            <a
              href="https://webschema.online"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
              <span>Created by</span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <img src={webschema} alt="webschema.online" className="h-5 w-5" draggable={false} />
                <span className="text-white/80">webschema</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
