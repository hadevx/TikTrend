import { Power, Store, Clock } from "lucide-react";

function Off() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-neutral-200 shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white">
          <Power className="h-7 w-7" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-neutral-900">Store is currently closed</h1>

        {/* Message */}
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
          We’re temporarily not accepting orders.
          <br />
          Please check back later when the store is open again.
        </p>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-neutral-200" />

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
          <Store className="h-4 w-4" />
          <span>Thank you for your patience</span>
        </div>

        {/* Subtle hint */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <Clock className="h-4 w-4" />
          <span>Status: Closed</span>
        </div>
      </div>
    </div>
  );
}

export default Off;
