import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Menu, X, ChevronDown, Search, ShoppingCart, User as UserIconSvg } from "lucide-react";
import { useGetCategoriesTreeQuery, useGetProductsQuery } from "../redux/queries/productApi";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

/**
 * Header styled EXACTLY like SiteNav:
 * - Sticky dark glass bar (neutral-950/60 + backdrop blur)
 * - Left: logo badge + brand text
 * - Middle (desktop): category links row
 * - Right: "Search" ghost button (desktop) + primary "Sign in" or user pill + cart
 * - Mobile: menu drawer with same dark style
 *
 * Keeps your existing:
 * - product search by Enter (navigates to /products/:id)
 * - categories mega (desktop dropdown)
 * - category tree in mobile
 * - cart count from redux
 * - store banner
 */

export default function Header({ onSearch }) {
  const links = useMemo(() => ["New", "Outerwear", "Hoodies", "Tees", "Accessories"], []);

  const [clicked, setClicked] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [noProductFound, setNoProductFound] = useState(false);

  const { data: products = [] } = useGetProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: storeStatus } = useGetStoreStatusQuery();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const cartCount = useMemo(() => cartItems.reduce((a, c) => a + c.qty, 0), [cartItems]);

  const menuRef = useRef(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setClicked(false);
        setExpandedCategoryId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // lock scroll when mobile menu open
  useEffect(() => {
    if (clicked) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [clicked]);

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setNoProductFound(false);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = searchQuery.trim().toLowerCase();
      const matchedProduct = products.find((p) => p?.name?.toLowerCase().includes(q));
      if (matchedProduct) {
        navigate(`/products/${matchedProduct._id}`);
        setClicked(false);
        setExpandedCategoryId(null);
        setNoProductFound(false);
      } else {
        setNoProductFound(true);
      }
    }
  };

  // Desktop mega menu rendering
  const renderCategoryTree = (categories) =>
    categories?.map((cat) => (
      <div key={cat._id} className="space-y-2">
        <Link
          to={`/category/${cat._id}`}
          onClick={() => setExpandedCategoryId(null)}
          className="block text-sm font-semibold text-neutral-950 hover:text-neutral-700">
          {cap(cat.name)}
        </Link>

        {cat.children?.length > 0 && (
          <ul className="space-y-1 pl-3 border-l border-neutral-200">
            {cat.children.map((child) => (
              <li key={child._id}>
                <Link
                  to={`/category/${child._id}`}
                  onClick={() => setExpandedCategoryId(null)}
                  className="block text-sm text-neutral-600 hover:text-neutral-900">
                  {cap(child.name)}
                </Link>

                {child.children?.length > 0 && (
                  <ul className="mt-1 space-y-1 pl-3">
                    {child.children.map((g) => (
                      <li key={g._id}>
                        <Link
                          to={`/category/${g._id}`}
                          onClick={() => setExpandedCategoryId(null)}
                          className="block text-xs text-neutral-500 hover:text-neutral-900">
                          {cap(g.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ));

  // Mobile category tree
  const renderMobileCategoryTree = (categories) =>
    categories?.map((cat) => (
      <div key={cat._id} className="space-y-2">
        <Link
          to={`/category/${cat._id}`}
          onClick={() => setClicked(false)}
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-white/95 hover:bg-white/10">
          {cap(cat.name)}
        </Link>

        {cat.children?.length > 0 && (
          <div className="pl-3 space-y-1">
            {cat.children.map((child) => (
              <Link
                key={child._id}
                to={`/category/${child._id}`}
                onClick={() => setClicked(false)}
                className="block rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                {cap(child.name)}
              </Link>
            ))}
          </div>
        )}
      </div>
    ));

  return (
    <>
      {/* Store banner sits ABOVE the nav, still consistent */}
      {storeStatus?.[0]?.banner?.trim() && (
        <div className="fixed left-0 right-0 top-0 z-[60] bg-neutral-950 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold">
          {storeStatus[0].banner}
        </div>
      )}

      {/* Exact SiteNav style */}
      <header
        className={clsx(
          "sticky top-0 z-50 border-b  border-white/10 bg-neutral-950 backdrop-blur-xl ",
          storeStatus?.[0]?.banner?.trim() && "mt-[40px] sm:mt-[44px]",
        )}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* LEFT: brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setClicked(true)}
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
              title="Menu">
              <Menu className="h-5 w-5 text-white/90" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <span className="font-mono text-xs tracking-[0.35em] text-white/80">WS</span>
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight text-white">WEBSCHEMA</div>
                <div className="text-xs text-white/55">Minimal performance essentials</div>
              </div>
            </Link>
          </div>

          {/* MIDDLE: links row (desktop) */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              to="/"
              className={clsx(
                "text-sm transition",
                pathname === "/" ? "text-white" : "text-white/70 hover:text-white",
              )}>
              Home
            </Link>

            {/* Your dynamic mega menu trigger, styled like SiteNav links */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setExpandedCategoryId((p) => (p === "all" ? null : "all"))}
                className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition">
                Categories
                <ChevronDown
                  size={16}
                  className={clsx(
                    "transition-transform duration-200",
                    expandedCategoryId === "all" ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              <AnimatePresence>
                {expandedCategoryId === "all" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 12, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full w-[760px] rounded-3xl border border-white/10 bg-white shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-neutral-950">
                            Browse categories
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            Explore curated collections picked for you.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedCategoryId(null)}
                          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50">
                          Close
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-6">
                        {categoryTree && renderCategoryTree(categoryTree)}
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        Tip: use search for quick access
                      </span>
                      <Link
                        to="/all-products"
                        onClick={() => setExpandedCategoryId(null)}
                        className="text-xs font-semibold text-neutral-950 hover:opacity-70">
                        View all products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="text-sm text-white/70 hover:text-white transition">
              About
            </Link>
            <Link to="/contact" className="text-sm text-white/70 hover:text-white transition">
              Contact
            </Link>
          </nav>

          {/* RIGHT: actions (exact SiteNav layout) */}
          <div className="flex items-center gap-2">
            {/* Cart icon (kept) but styled to match */}
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              aria-label="Cart"
              title="Cart">
              <ShoppingCart className="h-5 w-5 text-white/90" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-xs font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Primary action (SiteNav) */}
            {userInfo ? (
              <Link
                to="/profile"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)] inline-flex items-center gap-2">
                <UserIconSvg className="h-4 w-4" />
                <span className="max-w-[140px] truncate">{userInfo.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-white px-4 flex items-center gap-2 py-2 text-sm font-semibold text-neutral-950 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                <UserIconSvg className="h-4 w-4" />
                <span className="max-w-[140px] truncate">Account</span>
              </Link>
            )}
          </div>
        </div>

        {/* Optional: inline search input under bar (hidden by default) */}
        {/* If you want, I can add a tiny expanding search row in this header. */}
      </header>

      {/* Mobile drawer (matches the same glass/dark style) */}
      <AnimatePresence>
        {clicked && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80]">
            <div className="absolute inset-0 bg-black/60" onClick={() => setClicked(false)} />

            <motion.nav
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              exit={{ x: -340 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-[360px] bg-neutral-950/95 text-white backdrop-blur-xl border-r border-white/10 shadow-2xl">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <Link to="/" onClick={() => setClicked(false)} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <span className="font-mono text-xs tracking-[0.35em] text-white/80">AW</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">ARC.WEAR</div>
                    <div className="text-xs text-white/55">Minimal performance essentials</div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setClicked(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                  aria-label="Close"
                  title="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Search input (mobile) */}
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-white/60" />
                    <input
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchSubmit}
                      placeholder="Search products…"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
                    />
                  </div>
                  {noProductFound && (
                    <p className="mt-2 text-xs text-rose-300">
                      No product found. Try another name.
                    </p>
                  )}
                </div>

                <Link
                  to="/"
                  onClick={() => setClicked(false)}
                  className="block rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                  Home
                </Link>

                {/* Categories accordion */}
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <button
                    type="button"
                    onClick={() => setExpandedMobileCat((p) => (p === "all" ? null : "all"))}
                    className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold">
                    Categories
                    <ChevronDown
                      size={18}
                      className={clsx(
                        "transition-transform",
                        expandedMobileCat === "all" ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedMobileCat === "all" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-2 pb-3">
                        <div className="max-h-[45vh] overflow-y-auto pr-2 space-y-2">
                          {categoryTree && renderMobileCategoryTree(categoryTree)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/about"
                  onClick={() => setClicked(false)}
                  className="block rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setClicked(false)}
                  className="block rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                  Contact
                </Link>

                {userInfo ? (
                  <Link
                    to="/profile"
                    onClick={() => setClicked(false)}
                    className="mt-2 inline-flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90">
                    <UserIconSvg className="h-4 w-4" />
                    My account
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setClicked(false)}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90">
                    Sign in
                  </Link>
                )}

                <div className="pt-4 text-center text-xs text-white/50">
                  © {new Date().getFullYear()} ARC.WEAR
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
