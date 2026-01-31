import React, { useEffect, useMemo, useState } from "react";

/**
 * Portfolio-style landing page (SOCO-inspired)
 * - Always hamburger menu (no desktop nav links)
 * - Portfolio hero (name, role, availability)
 * - Modern bento “capabilities” row (replaces MiniPill)
 * - Work grid feels like case studies (with year + role)
 * - Lightweight, premium typography-led UI
 *
 * Drop into a React + Tailwind project.
 */
export default function SocoLandingPage() {
  const nav = useMemo(
    () => [
      { label: "Home", href: "#top" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    [],
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const u = (topic, w, h, sig) =>
    `https://source.unsplash.com/random/${w}x${h}/?${encodeURIComponent(topic)}&sig=${sig}`;

  const IMAGES = {
    heroPill: u("mobile,ui,product,screen", 260, 180, 11),
    work1: u("branding,typography,design", 1400, 900, 21),
    work2: u("dashboard,ui,interface", 1400, 900, 22),
    work3: u("website,layout,minimal", 1400, 900, 23),
    about: u("creative,studio,workspace", 1400, 900, 31),
    avatar1: u("portrait,person", 200, 200, 41),
    avatar2: u("portrait,person", 200, 200, 42),
    avatar3: u("portrait,person", 200, 200, 43),
  };

  return (
    <div id="top" className="min-h-screen bg-white text-black">
      {/* NAV */}
      <header className="sticky px-44 top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-5">
          <a href="#top" className="block leading-none">
            <div className="text-lg font-semibold tracking-tight">WebSchema.</div>
            <div className="mt-1 text-xs leading-snug text-black/50">
              Portfolio & product studio
              <br />
              design + front-end
            </div>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              aria-label="Open menu">
              {/* Orange dot */}
              <span className="h-2 w-2 rounded-full bg-[#ff6a3d]" aria-hidden="true" />
              Menu <span className="text-base leading-none">☰</span>
            </button>

            <a
              href="#contact"
              className="rounded-full bg-[#ff6a3d] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(0,0,0,0.16)] transition hover:brightness-95">
              Get in touch
            </a>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">WebSchema.</div>
            <div className="mt-1 text-xs leading-snug text-black/50">
              Portfolio & product studio
              <br />
              design + front-end
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-black/15 px-3 py-2 text-sm font-semibold text-black/70 hover:bg-black/5 transition"
            aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="mt-8 grid gap-2">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-3xl px-4 py-4 text-xl font-medium tracking-tight text-black/85 hover:bg-black/5 transition">
              {n.label}
            </a>
          ))}
        </div>

        <div className="my-6 h-px bg-black/10" />

        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(0,0,0,0.16)] transition hover:brightness-95">
          Start a project
        </a>

        <div className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-4">
          <div className="text-xs font-semibold text-black/50">Availability</div>
          <div className="mt-2 text-sm font-semibold text-black/80">
            Booking 1 new project this month
          </div>
          <div className="mt-1 text-sm text-black/55">
            Landing pages, design systems, and front-end builds.
          </div>
        </div>

        <div className="mt-auto pt-10 text-xs text-black/45">
          © {new Date().getFullYear()} WebSchema.
        </div>
      </Drawer>

      {/* HERO (Portfolio) */}
      <section className="px-6 pt-12 pb-10">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-col items-center text-center">
            {/* tiny status line */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/60 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available for new work
              <span className="text-black/30">•</span>
              2026
            </div>

            {/* headline */}
            <h1 className="mt-6 max-w-[980px] text-[clamp(2.4rem,6.2vw,6.2rem)] font-medium leading-[1.02] tracking-[-0.035em]">
              <span className="text-black/20">A great business</span>
              <br />
              is the{" "}
              <span className="inline-flex items-center gap-3 align-baseline">
                result
                <span className="relative inline-flex items-center rounded-[24px] border border-black/10 bg-white px-2.5 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                  <img
                    src="/q.jpg"
                    alt="Design preview"
                    className="h-20 w-36 rounded-[16px] object-cover object-[50%_20%]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => (e.currentTarget.src = "https://picsum.photos/260/180")}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[24px] opacity-70"
                    style={{
                      background:
                        "radial-gradient(180px 70px at 20% 0%, rgba(255,255,255,0.75), transparent 60%)",
                    }}
                  />
                </span>
              </span>
              <br />
              of a great design
            </h1>

            {/* portfolio intro */}
            <p className="mt-6 max-w-[760px] text-base leading-relaxed text-black/55">
              I’m <span className="font-semibold text-black/75">WebSchema</span> — I design calm,
              modern interfaces and build fast front-ends. I work with founders and teams to ship
              landing pages, design systems, and product UI that feels premium.
            </p>

            {/* CTA row */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:brightness-95 transition">
                Start a project
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-black/70 hover:bg-black/5 transition">
                View case studies ↗
              </a>
            </div>

            {/* Modern bento capabilities (replaces MiniPill) */}
            <div className="mt-12 grid w-full max-w-[980px] gap-5 md:grid-cols-3">
              <ServiceBento
                index="01"
                title="UI/UX Design"
                meta="Research → Wireframes → UI Systems"
              />
              <div className="md:translate-y-2">
                <ServiceBento
                  index="02"
                  title="Front-end Build"
                  meta="React → Tailwind → a11y + Performance"
                />
              </div>
              <ServiceBento index="03" title="Branding" meta="Identity → Typography → Content" />
            </div>

            {/* Quick stats row (portfolio vibe) */}
            <div className="mt-8 grid w-full max-w-[980px] gap-4 sm:grid-cols-3">
              <StatCard label="Projects shipped" value="38+" />
              <StatCard label="Avg. Lighthouse" value="95+" />
              <StatCard label="Typical timeline" value="2–3 weeks" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="px-6 py-12">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-black/50">Services</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85">
                What I can do for your product
              </h2>
              <p className="mt-2 max-w-[720px] text-sm leading-relaxed text-black/55">
                I build systems that scale—clean components, consistent spacing, and thoughtful UX.
              </p>
            </div>
            <a
              href="#contact"
              className="hidden rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/70 hover:bg-black/5 transition md:inline-flex">
              Request a quote
            </a>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <ServiceCard
              title="Product design"
              desc="UI/UX, prototyping, and clean interaction patterns built for clarity."
              bullets={["Flows & IA", "Wireframes", "UI Kits", "Prototypes"]}
            />
            <ServiceCard
              title="Front-end builds"
              desc="Fast, accessible interfaces in React—shipped with production polish."
              bullets={["React + Tailwind", "a11y & SEO", "Performance", "Component systems"]}
            />
            <ServiceCard
              title="Brand systems"
              desc="Identity, typography, and content that feels coherent everywhere."
              bullets={["Logo & marks", "Type & color", "Copy direction", "Guidelines"]}
            />
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="px-6 py-12">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-black/50">Work</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85">
                Case studies
              </h2>
              <p className="mt-2 text-sm text-black/55">
                A small selection of recent design + build work.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <CaseCard
              className="lg:col-span-7"
              img={IMAGES.work1}
              year="2025"
              role="Brand + Web"
              title="SaaS identity + landing system"
              desc="Modular sections, calm typography, and conversion-led structure."
              tall
            />
            <div className="grid gap-6 lg:col-span-5">
              <CaseCard
                img={IMAGES.work2}
                year="2025"
                role="UI + Dev"
                title="Minimal dashboard rebuild"
                desc="Accessible components with measurable performance wins."
              />
              <CaseCard
                img={IMAGES.work3}
                year="2024"
                role="Portfolio"
                title="Founder portfolio refresh"
                desc="A typographic hero with bento layout and crisp spacing."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-12">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="text-xs font-semibold text-black/50">About</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85">
                Calm design. Clean systems. Fast shipping.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/55">
                I work like an in-house teammate—tight feedback loops, structured deliverables, and
                a build that matches the design.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoTile label="Speed" value="2–5 day iteration cycles" />
                <InfoTile label="Clarity" value="Systems, not one-offs" />
                <InfoTile label="Quality" value="Pixel polish + a11y" />
                <InfoTile label="Support" value="Hand-off + documentation" />
              </div>

              <a
                href="#contact"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:brightness-95 transition">
                Work with me
              </a>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.02] shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
                <div className="h-[320px] w-full sm:h-[420px]">
                  <img
                    src={IMAGES.about}
                    alt="Studio"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => (e.currentTarget.src = "https://picsum.photos/1400/900")}
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(520px 220px at 15% 0%, rgba(255,255,255,0.7), transparent 60%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-6 py-12">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-xs font-semibold text-black/50">Testimonials</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black/85">
            Words from founders & teams
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <QuoteCard
              img={IMAGES.avatar1}
              name="Cristian"
              role="Founder"
              quote="“Design decisions were crisp, fast, and deeply practical. Premium without being loud.”"
            />
            <QuoteCard
              img={IMAGES.avatar2}
              name="Aisha"
              role="Product Lead"
              quote="“We went from messy UI to a coherent system. Hand-off was spotless.”"
            />
            <QuoteCard
              img={IMAGES.avatar3}
              name="Noah"
              role="CTO"
              quote="“Performance improved immediately. Accessible components that scale.”"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-6 py-14">
        <div className="mx-auto max-w-[1160px]">
          <div className="relative overflow-hidden rounded-[32px] bg-black p-8 text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(900px 420px at 20% 10%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(900px 420px at 80% 90%, rgba(255,106,61,0.25), transparent 55%)",
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="text-xs font-semibold text-white/65">Let’s build</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  Want a portfolio-grade landing page?
                </div>
                <div className="mt-2 text-sm text-white/65">
                  Share your goals—get a scope + timeline in 48 hours.
                </div>
              </div>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-[24px] bg-white/10 p-4 ring-1 ring-white/15">
                <div className="grid gap-3">
                  <Input placeholder="Your name" />
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="What are you building?" />
                  <button className="mt-1 rounded-full bg-[#ff6a3d] px-5 py-3 text-sm font-semibold text-white hover:brightness-95 transition">
                    Send request
                  </button>
                  <div className="text-xs text-white/60">
                    Or email: <span className="font-semibold">hello@webschema.studio</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-8 text-sm text-black/55 sm:flex-row">
            <div>© {new Date().getFullYear()} WebSchema. All rights reserved.</div>
            <div className="flex gap-6">
              <a className="hover:text-black transition" href="#">
                Twitter
              </a>
              <a className="hover:text-black transition" href="#">
                Instagram
              </a>
              <a className="hover:text-black transition" href="#">
                Dribbble
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- UI -------------------------------- */

function Drawer({ open, onClose, children }) {
  return (
    <>
      <div
        className={
          "fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={
          "fixed right-0 top-0 z-[70] h-full w-[86%] max-w-[420px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22)] transition-transform duration-300 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
        aria-label="Menu">
        <div className="flex h-full flex-col p-6">{children}</div>
      </aside>
    </>
  );
}

function ServiceBento({ index, title, meta }) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{
          background: "radial-gradient(420px 160px at 20% 0%, rgba(0,0,0,0.04), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="text-xs font-semibold tracking-wide text-black/30">{index}</div>
        <div className="mt-3 text-lg font-semibold tracking-tight text-black/85">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-black/55">{meta}</div>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black/70">
          Explore
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[22px] border border-black/10 bg-black/[0.02] px-5 py-4">
      <div className="text-xs font-semibold text-black/50">{label}</div>
      <div className="mt-2 text-base font-semibold tracking-tight text-black/80">{value}</div>
    </div>
  );
}

function ServiceCard({ title, desc, bullets }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
      <div className="p-6">
        <div className="text-lg font-semibold tracking-tight text-black/85">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-black/55">{desc}</div>

        <div className="mt-5 grid gap-2">
          {bullets.map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-black/65">
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
              {b}
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black/75 hover:text-black transition">
          Learn more <span className="translate-y-[1px]">→</span>
        </a>
      </div>
    </div>
  );
}

function CaseCard({ img, year, role, title, desc, tall, className = "" }) {
  return (
    <a
      href="#"
      className={
        "group block overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 " +
        className
      }>
      <div className={(tall ? "h-[360px] sm:h-[420px]" : "h-[220px]") + " w-full overflow-hidden"}>
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => (e.currentTarget.src = "https://picsum.photos/1400/900")}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-xs font-semibold text-black/45">
          <span>{role}</span>
          <span>{year}</span>
        </div>
        <div className="mt-3 text-lg font-semibold text-black/85">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-black/55">{desc}</div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black/75">
          Read <span className="transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </a>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-[22px] border border-black/10 bg-black/[0.02] p-5">
      <div className="text-xs font-semibold text-black/50">{label}</div>
      <div className="mt-2 text-sm font-semibold text-black/80">{value}</div>
    </div>
  );
}

function QuoteCard({ img, name, role, quote }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
      <div className="text-sm leading-relaxed text-black/60">“{quote}”</div>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]">
          <img
            src={img}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => (e.currentTarget.src = "https://picsum.photos/200/200")}
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-black/80">{name}</div>
          <div className="text-xs text-black/50">{role}</div>
        </div>
      </div>
    </div>
  );
}

function Input({ type = "text", placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none transition focus:border-white/25 focus:bg-white/15"
    />
  );
}
