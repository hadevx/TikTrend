import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

export default function Pagination({ page, setPage, pages }) {
  if (pages <= 1) return null;

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < pages && setPage(page + 1);
  const handlePageClick = (p) => setPage(p);

  // Build a compact range: 1 ... (page-1) page (page+1) ... pages
  const getPageItems = () => {
    // show more pages when few
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

    const items = new Set([1, pages, page, page - 1, page + 1, page - 2, page + 2]);
    const list = [...items].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);

    // add ellipsis markers
    const out = [];
    for (let i = 0; i < list.length; i++) {
      out.push(list[i]);
      if (i < list.length - 1 && list[i + 1] - list[i] > 1) out.push("...");
    }
    return out;
  };

  const pageItems = getPageItems();

  return (
    <div className="w-full border-t border-neutral-200 bg-white/60 backdrop-blur px-4 py-3 sm:px-6">
      {/* Mobile */}
      <div className="flex items-center justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={clsx(
            "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
            "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="text-sm font-medium text-neutral-700">
          {page} / {pages}
        </div>

        <button
          onClick={handleNext}
          disabled={page === pages}
          className={clsx(
            "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition",
            "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}>
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Page <span className="font-semibold text-neutral-900">{page}</span> of{" "}
          <span className="font-semibold text-neutral-900">{pages}</span>
        </p>

        <nav className="flex items-center gap-2" aria-label="Pagination">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={clsx(
              "h-10 w-10 rounded-2xl border flex items-center justify-center transition",
              "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {pageItems.map((item, idx) =>
              item === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="h-10 w-10 rounded-2xl border border-transparent flex items-center justify-center text-neutral-400"
                  aria-hidden="true">
                  <MoreHorizontal className="h-5 w-5" />
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageClick(item)}
                  className={clsx(
                    "h-10 min-w-10 px-3 rounded-2xl border text-sm font-semibold transition",
                    item === page
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                      : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50",
                  )}
                  aria-current={item === page ? "page" : undefined}>
                  {item}
                </button>
              ),
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={page === pages}
            className={clsx(
              "h-10 w-10 rounded-2xl border flex items-center justify-center transition",
              "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="Next page">
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
