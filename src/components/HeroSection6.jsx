import React from "react";

function MiniGraph() {
  return (
    <div className="mt-3 h-20 w-full rounded-xl bg-white shadow-inner">
      <svg
        viewBox="0 0 240 80"
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true">
        {/* subtle grid */}
        <g opacity="0.12">
          {[10, 30, 50, 70].map((y) => (
            <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="black" strokeWidth="1" />
          ))}
          {[40, 80, 120, 160, 200].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="black" strokeWidth="1" />
          ))}
        </g>

        {/* area */}
        <path
          d="M0,58 L20,54 L40,56 L60,42 L80,46 L100,34 L120,38 L140,24 L160,28 L180,18 L200,22 L220,12 L240,16 L240,80 L0,80 Z"
          fill="rgba(0,0,0,0.08)"
        />

        {/* line */}
        <path
          d="M0,58 L20,54 L40,56 L60,42 L80,46 L100,34 L120,38 L140,24 L160,28 L180,18 L200,22 L220,12 L240,16"
          fill="none"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* points */}
        {[
          [0, 58],
          [20, 54],
          [40, 56],
          [60, 42],
          [80, 46],
          [100, 34],
          [120, 38],
          [140, 24],
          [160, 28],
          [180, 18],
          [200, 22],
          [220, 12],
          [240, 16],
        ].map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r="2.6" fill="rgba(0,0,0,0.7)" />
        ))}
      </svg>
    </div>
  );
}

function OnlineAvatar({ src, alt }) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className="h-8 w-8 rounded-full border border-black/20 object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {/* online dot */}
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>
  );
}

export default function AnalyticsHero() {
  const avatars = [
    {
      src: "https://i.pravatar.cc/64?img=12",
      alt: "Team member 1",
    },
    {
      src: "https://i.pravatar.cc/64?img=32",
      alt: "Team member 2",
    },
    {
      src: "https://i.pravatar.cc/64?img=5",
      alt: "Team member 3",
    },
  ];

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-[1200px]">
        {/* Header row: title + small feature chips */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="max-w-[560px] text-4xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
              Your key to strategic
              <br />
              success through analytics
            </h1>

            {/* added feature chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Real-time dashboards
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Automated reports
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Team collaboration
              </span>
            </div>
          </div>

          {/* added CTA buttons */}
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:bg-black/[0.02]">
              View demo
            </button>
            <button className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition hover:opacity-90">
              Get started
            </button>
          </div>
        </div>

        {/* Force WHITE and BLACK cards side-by-side from md and up */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
          {/* LEFT (white card) */}
          <div className="min-w-0">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <div className="mb-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                Setting up reports
              </div>

              {/* Text + Stats side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Text */}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-black">
                    Fast and easy access to analytics
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">
                    One platform for comprehensive analytics solutions that will be the first step
                    towards digitalization.
                  </p>

                  {/* added mini feature list */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-black/65">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.04]">
                        ✓
                      </span>
                      Shareable dashboards with permissions
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/65">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.04]">
                        ✓
                      </span>
                      Alerts when metrics spike or drop
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/65">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/[0.04]">
                        ✓
                      </span>
                      Export to PDF / CSV in one click
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="min-w-0 rounded-2xl bg-black/[0.02] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/50">Sales statistic</span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                      +20%
                    </span>
                  </div>

                  <div className="mt-2 text-xl font-semibold text-black">264.2 KD</div>

                  <MiniGraph />

                  {/* added small KPI row */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-2 shadow-sm">
                      <div className="text-[10px] text-black/45">Conversion</div>
                      <div className="text-sm font-semibold text-black">3.8%</div>
                    </div>
                    <div className="rounded-xl bg-white p-2 shadow-sm">
                      <div className="text-[10px] text-black/45">Avg. Order</div>
                      <div className="text-sm font-semibold text-black">19.4 KD</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* added bottom subtle progress bar */}
              <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-black/70">Weekly goal</span>
                  <span className="text-xs text-black/50">72%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                  <div className="h-2 w-[72%] rounded-full bg-black" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT (black card) */}
          <div className="relative min-w-0 overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px 240px at 20% 10%, rgba(255,255,255,0.15), transparent 60%)",
              }}
            />

            {/* added subtle border ring */}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-white/10" />

            <div className="relative">
              <div className="mb-6 text-sm text-white/70">
                Ready for exciting, instantaneous, all-accessible insights in real time?
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Widget 1 */}
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">Transactions</div>
                    <div className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      Live
                    </div>
                  </div>
                  <div className="mt-2 text-3xl font-semibold">43K</div>
                  <div className="mt-2 text-xs text-white/55">+1,284 in the last hour</div>
                </div>

                {/* Widget 2 (with online avatars) */}
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">Widget control</div>
                    <span className="text-[11px] text-white/50">3 online</span>
                  </div>

                  <div className="mt-3 flex items-center">
                    <div className="flex -space-x-2">
                      {avatars.map((a, idx) => (
                        <OnlineAvatar key={idx} src={a.src} alt={a.alt} />
                      ))}
                    </div>

                    <button className="ml-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15">
                      Invite
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-white/55">
                    Collaborate and manage widgets together.
                  </div>
                </div>
              </div>

              {/* added “quick actions” row */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Export", sub: "PDF / CSV" },
                  { label: "Alerts", sub: "Smart rules" },
                  { label: "Share", sub: "Team links" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                    <div className="text-sm font-semibold">{item.label}</div>
                    <div className="mt-1 text-xs text-white/60">{item.sub}</div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-white/65">
                Reports provide a comprehensive overview of important aspects of web analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom metric */}
        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="text-6xl font-semibold tracking-tight text-black">
            Up to <span className="text-7xl">45%</span>
          </div>

          <p className="max-w-[520px] text-sm leading-relaxed text-black/55">
            Increase your analytics efficiency by up to 45%. Unique algorithms provide insights from
            data, reduce time for analysis and save time for making important, informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
