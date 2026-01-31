import { ArrowRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroCloneEcom() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Hero image */}
      <div className="mt-6 px-3 sm:px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50">
          <img
            src="/images/img2.jpg"
            alt="New collection"
            className="w-full h-[260px] sm:h-[340px] md:h-[440px] object-cover"
            style={{ objectPosition: "50% 55%" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16 sm:pb-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              New drop • Limited stock
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 leading-[1.05]">
              Effortless fits for <br className="hidden sm:block" />
              everyday <span className="italic font-light text-neutral-700">confidence</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl">
              Premium essentials, clean cuts, and comfortable fabrics. Shop the latest collection
              made for Kuwait delivery.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link
                to="/all-products"
                className="group inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition">
                Shop new arrivals
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/category/best-sellers"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition">
                Best sellers
              </Link>
            </div>

            {/* Small trust row */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-600">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                Fast Kuwait delivery
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                Easy exchanges
              </span>
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1">
                Secure checkout
              </span>
            </div>
          </div>

          {/* Right (promo card instead of email capture) */}
          <div className="md:justify-self-end w-full md:max-w-sm">
            <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm p-5 sm:p-6">
              <p className="text-xs font-semibold text-neutral-500">Today’s offer</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                Extra <span className="text-emerald-600">10% off</span> on selected items
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Limited time. Browse the sale section and grab your size before it’s gone.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-neutral-500 text-xs">Delivery</p>
                  <p className="font-semibold text-neutral-900 mt-1">24–48 hrs</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-neutral-500 text-xs">Exchange</p>
                  <p className="font-semibold text-neutral-900 mt-1">Easy</p>
                </div>
              </div>

              <Link
                to="/sale"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition">
                Shop sale
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Soft bottom glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-yellow-100/60 via-pink-100/40 to-transparent" />
    </section>
  );
}
