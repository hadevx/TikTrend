import { useEffect, useRef, useState, useMemo } from "react";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";
import clsx from "clsx";
export default function Navigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: store } = useGetStoreStatusQuery(undefined);

  const bannerText = store?.[0]?.banner;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // ✅ Redux: cart + auth
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const userInfo = useSelector((state) => state.auth?.userInfo);

  // ✅ cart count (sum of qty)
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.qty || 0), 0);
  }, [cartItems]);

  // ✅ Only apply scroll behavior on Home route
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  // Close search on outside click + Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSearchOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "Shop" },
    { href: "/sale", label: "Sale" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  /**
   * ✅ Colors:
   * - Home "/" at top (not scrolled): white text/icons (transparent header)
   * - Home "/" when scrolled: black text/icons (glass header)
   * - Any other route (/cart, /products, etc.): ALWAYS black text/icons
   */
  const useLightText = isHome && !isScrolled;

  const navItemColor = useLightText ? "text-white" : "text-foreground";
  const navItemHoverColor = useLightText
    ? "text-white/70 hover:text-white"
    : "text-foreground/60 hover:text-foreground";
  const iconColor = useLightText ? "text-white" : "text-foreground";

  // ✅ Banner height: used to offset the fixed header so it doesn't overlap the banner
  const bannerHeight = bannerText ? 36 : 0; // px

  // ✅ Header background behavior:
  // - Home: transparent at top, becomes glass on scroll
  // - Other routes: always white + border
  const headerClass = `fixed left-0 right-0 z-50 transition-all duration-500 ${
    isHome
      ? isScrolled
        ? "bg-white/80 backdrop-blur-md border-b border-border"
        : "bg-transparent"
      : "bg-white/90 backdrop-blur-md border-b border-border"
  }`;

  return (
    <>
      {/* ✅ Top Banner */}
      <AnimatePresence>
        {bannerText ? (
          <motion.div
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -36, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={clsx(
              "fixed top-0 left-0 right-0 z-[60]",
              "h-9 border-b border-black/10",
              // banner style
              useLightText ? "bg-black text-white" : "bg-black text-white",
            )}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-center">
              <p className="text-xs tracking-[0.2em] uppercase text-center line-clamp-1">
                {bannerText}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={headerClass}
        style={{ top: bannerHeight }}>
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className={`lg:hidden p-2 -ml-2 transition-colors duration-500 ${iconColor}`}
              aria-label="Toggle menu">
              {isMenuOpen ? (
                <X className="h-5 w-5 stroke-[1.5]" />
              ) : (
                <Menu className="h-5 w-5 stroke-[1.5]" />
              )}
            </button>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
                    pathname === link.href ? navItemColor : navItemHoverColor
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link
              to="/"
              className={`absolute left-1/2 -translate-x-1/2 font-serif text-xl lg:text-2xl tracking-[0.3em] uppercase transition-colors duration-500 ${
                useLightText ? "text-white" : "text-foreground"
              }`}
              style={{ top: "50%", transform: "translate(-50%, -50%)" }}>
              {store?.[0]?.storeName || "MyStore"}
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <div ref={searchContainerRef} className="relative hidden sm:flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className={`w-full bg-transparent border-b text-sm py-1 pr-2 outline-none transition-colors duration-500 ${
                          useLightText
                            ? "border-white/30 text-white placeholder:text-white/50"
                            : "border-foreground/30 text-foreground placeholder:text-foreground/50"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search icon toggler */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen((v) => !v)}
                  aria-label="Toggle search"
                  className={`p-2 transition-colors duration-500 ${iconColor}`}>
                  <Search className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Account */}
              <Link
                to={userInfo ? "/profile" : "/login"}
                aria-label="Account"
                className={`p-2 hidden sm:block transition-colors duration-500 ${iconColor}`}>
                <User className="h-5 w-5 stroke-[1.5]" />
              </Link>

              {/* Cart (Redux count) */}
              <button
                onClick={() => navigate("/cart")}
                aria-label="Shopping cart"
                className={`p-2 -mr-2 relative transition-colors duration-500 ${iconColor}`}>
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full text-[10px] flex items-center justify-center bg-rose-500 text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              style={{ top: bannerHeight }}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 bg-white border-r border-border lg:hidden"
              style={{ top: bannerHeight }}>
              <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                <span className="font-serif text-lg tracking-[0.2em] uppercase">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2"
                  aria-label="Close menu">
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              <nav className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-lg tracking-[0.15em] uppercase transition-colors ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}>
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-border pt-6 mt-2">
                  <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-4">
                    Account
                  </p>

                  <Link
                    to={userInfo ? "/profile" : "/login"}
                    className="block text-lg tracking-[0.15em] uppercase transition-colors text-foreground/60 hover:text-foreground mb-4">
                    {userInfo ? "Profile" : "Login"}
                  </Link>

                  {/* Mobile cart shortcut */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/cart");
                    }}
                    className="mt-6 w-full inline-flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Cart
                    </span>
                    {cartCount > 0 ? (
                      <span className="h-6 min-w-[24px] px-2 rounded-full bg-foreground text-background text-xs grid place-items-center">
                        {cartCount}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Empty</span>
                    )}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
