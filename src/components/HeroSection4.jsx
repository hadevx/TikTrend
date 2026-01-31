import React from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pill,
  Receipt,
  Stethoscope,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

/**
 * Hero-section version of the reference UI.
 * - TailwindCSS required
 * - lucide-react icons
 *
 * Layout:
 *   Left: headline + supporting copy + CTAs + trust/stats
 *   Right: the dashboard mock (the cloned UI)
 */
export default function FitnessHeroSection() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-40 h-[520px] w-[520px] rounded-full bg-lime-300/15 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        {/* Top nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white/85" />
            </div>
            <div>
              <div className="text-white font-semibold tracking-tight">Fitme</div>
              <div className="text-xs text-white/60">Health dashboard</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
            <a className="px-3 py-2 rounded-xl hover:bg-white/5 transition" href="#features">
              Features
            </a>
            <a className="px-3 py-2 rounded-xl hover:bg-white/5 transition" href="#pricing">
              Pricing
            </a>
            <a className="px-3 py-2 rounded-xl hover:bg-white/5 transition" href="#faq">
              FAQ
            </a>
          </div>

          <button className="h-10 w-10 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition">
            <Menu className="h-5 w-5 text-white/80" />
          </button>
        </div>

        {/* Hero */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white/80">
              <Shield className="h-4 w-4" />
              Privacy-first insights · Real-time trends
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
              Track your health.
              <br />
              <span className="text-white/70">Feel in control.</span>
            </h1>

            <p className="mt-5 text-lg text-white/70 max-w-xl">
              A beautifully minimal dashboard that turns vitals, medication, and progress into
              clear, actionable insights. Built for fast check-ins—day after day.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-neutral-950 px-6 py-3 font-semibold shadow-[0_18px_55px_rgba(255,255,255,0.18)] hover:opacity-95 active:scale-[0.99] transition">
                Get started
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 active:scale-[0.99] transition">
                View demo
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl">
              <Kpi label="Daily check-ins" value="12K+" />
              <Kpi label="Avg. time saved" value="18 min" />
              <Kpi label="User rating" value="4.9/5" className="col-span-2 md:col-span-1" />
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=60",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=60",
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=60",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-neutral-950"
                  />
                ))}
              </div>
              <div>
                Trusted by teams building 
                <span className="text-white/80">modern health experiences</span>.
              </div>
            </div>
          </div>

          {/* Mock */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[34px] bg-gradient-to-br from-lime-300/15 via-white/5 to-violet-500/15 blur-2xl" />
            <div className="relative">
              <DashboardMock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 ${className}`}>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-white/60">{label}</div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="rounded-[28px] bg-[#0b0b0e] shadow-[0_40px_140px_rgba(0,0,0,0.7)] ring-1 ring-white/10 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          {/* LEFT */}
          <div className="rounded-[24px] bg-[#0c0c10] ring-1 ring-white/10 p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white/70 text-sm flex items-center gap-2">
                  <span className="font-semibold text-white/80">Fitme.</span>
                </div>
                <div className="mt-4 text-white text-[34px] leading-[1.05] font-semibold tracking-tight">
                  Hi, Ann.
                  <br />
                  Check your
                  <br />
                  Activity <span className="inline-block">👋🏻</span>
                </div>
              </div>

              <button className="h-10 w-10 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition">
                <Menu className="h-5 w-5 text-white/80" />
              </button>
            </div>

            {/* Filters */}
            <div className="mt-5 flex gap-3">
              <PillButton label="26 May" />
              <PillButton label="Medication" />
            </div>

            {/* Metric cards row */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-[#7b5cff]/35 via-[#6d4cff]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="text-white/70 text-sm">Heart rate</div>
                  <div className="text-white/60 text-xs">45 BPM</div>
                </div>
                <div className="mt-3 h-14 rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                  <MiniChart />
                </div>
                <div className="mt-3 text-white/70 text-xs">Jan · Feb · Mar · Apr</div>
              </Card>

              <Card className="bg-gradient-to-br from-[#16161b] to-[#0f0f14]">
                <div className="flex items-center justify-between">
                  <div className="text-white/80 text-sm">Blood Pressure</div>
                  <div className="h-9 w-9 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full border border-white/40" />
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-3">
                  <div className="text-white text-2xl font-semibold">120~</div>
                  <div className="text-white/50 text-sm mb-1">Sys</div>
                  <div className="ml-auto text-white text-2xl font-semibold">80~</div>
                  <div className="text-white/50 text-sm mb-1">Dia</div>
                </div>
              </Card>
            </div>

            {/* Big content card */}
            <div className="mt-4 relative rounded-[24px] bg-[#101015] ring-1 ring-white/10 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
              </div>

              <div className="relative p-4 grid grid-cols-[44px_1fr_44px] gap-3 items-center">
                <IconNavButton>
                  <ChevronLeft className="h-5 w-5 text-white/70" />
                </IconNavButton>

                <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-4 items-center">
                  <div className="relative h-[108px] rounded-[20px] bg-[#0b0b0e] ring-1 ring-white/10 overflow-hidden">
                    <img
                      alt="Portrait"
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                      src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div>
                    <div className="text-white text-base font-semibold leading-snug">
                      Tips how to take
                      <br />
                      medicine in correct
                      <br />
                      way
                    </div>
                    <button className="mt-3 inline-flex items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-white/80 text-sm hover:bg-white/10 transition">
                      Read
                    </button>
                  </div>
                </div>

                <IconNavButton>
                  <ChevronRight className="h-5 w-5 text-white/70" />
                </IconNavButton>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[26px] bg-[#d7ff3f] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <div className="rounded-[22px] bg-black/10 ring-1 ring-black/10 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-black/70 text-xs">Profile</div>
                  <div className="mt-0.5 text-black text-lg font-semibold">Ms. Ann</div>
                </div>
                <button className="h-9 w-9 rounded-xl bg-black/10 ring-1 ring-black/10 flex items-center justify-center hover:bg-black/15 transition">
                  <Menu className="h-5 w-5 text-black/70" />
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <img
                    alt="Avatar"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=70"
                    className="h-[88px] w-[88px] rounded-[26px] object-cover ring-2 ring-black/20"
                  />
                  <div className="absolute -inset-3 rounded-[32px] border border-black/20" />
                  <Dot className="-top-2 -left-2" />
                  <Dot className="-top-2 -right-2" />
                  <Dot className="-bottom-2 -left-2" />
                  <Dot className="-bottom-2 -right-2" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat icon={<Heart className="h-4 w-4" />} label="Recovering" value="56%" />
                <Stat icon={<Pill className="h-4 w-4" />} label="Medicines" value="643" />
                <Stat icon={<Receipt className="h-4 w-4" />} label="Receipts" value="414" />
                <Stat icon={<Stethoscope className="h-4 w-4" />} label="Doctors" value="8" />
              </div>

              {/* Pulse */}
              <div className="mt-4 rounded-[18px] bg-black/10 ring-1 ring-black/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-black font-semibold">Pulse Rate</div>
                  <div className="h-8 w-8 rounded-xl bg-black/10 ring-1 ring-black/10" />
                </div>
                <div className="mt-3 h-12 rounded-2xl bg-black/10 ring-1 ring-black/10 overflow-hidden">
                  <PulseWave />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot({ className }) {
  return <div className={`absolute ${className} h-2.5 w-2.5 rounded-full bg-black/70`} />;
}

function PillButton({ label }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition">
      <span className="h-2 w-2 rounded-full bg-white/70" />
      <span>{label}</span>
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[22px] p-5 ring-1 ring-white/10 bg-white/5 ${className}`}>
      {children}
    </div>
  );
}

function IconNavButton({ children }) {
  return (
    <button className="h-10 w-10 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition">
      {children}
    </button>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-[18px] bg-black/10 ring-1 ring-black/10 p-3">
      <div className="flex items-center gap-2 text-black/70">
        <div className="h-8 w-8 rounded-xl bg-black/10 ring-1 ring-black/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-black text-lg font-semibold leading-none">{value}</div>
          <div className="text-[11px] text-black/70 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 320 120" className="h-full w-full">
      <defs>
        <linearGradient id="miniGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(174, 128, 255, 0.9)" />
          <stop offset="1" stopColor="rgba(124, 92, 255, 0.2)" />
        </linearGradient>
      </defs>
      <path
        d="M0,85 C35,70 50,35 85,45 C120,55 135,92 170,82 C205,72 215,40 245,50 C275,60 290,78 320,70 L320,120 L0,120 Z"
        fill="url(#miniGrad)"
        opacity="0.9"
      />
      <path
        d="M0,85 C35,70 50,35 85,45 C120,55 135,92 170,82 C205,72 215,40 245,50 C275,60 290,78 320,70"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PulseWave() {
  return (
    <svg viewBox="0 0 320 90" className="h-full w-full">
      <path
        d="M0,55 L40,55 L55,35 L70,70 L88,20 L108,78 L126,52 L160,52 L176,40 L192,62 L210,30 L230,70 L252,52 L320,52"
        fill="none"
        stroke="rgba(0,0,0,0.85)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
