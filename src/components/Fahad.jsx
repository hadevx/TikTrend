import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ✅ Single-item ecommerce version (ONLY the first image)
 * - One pinned "product reveal" section
 * - Ghost scroll spacer created in React
 * - Same GSAP behaviors: clip reveal, image scale/y, text lines in, blur/opacity, optional video slide, overlay fade
 * - You can remove the video block entirely if you want a pure static ecommerce hero
 */

const WORK_ITEMS = [
  {
    id: "product-hero",
    image:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon.jpg",
    titleLines: ["NEW ARRIVAL", "AURA JACKET"],
    titleAccentIndex: 1,
    accentClass: "color-1",
    subLines: [
      "Water-resistant • Lightweight",
      "Minimal everyday outerwear",
      "Designed for city & travel",
      "Unisex fit • XS–XXL",
      "Free returns • 30 days",
    ],
    meta: {
      price: "$129",
      cta: "Shop now",
      secondary: "View details",
      trust: ["Free shipping $75+", "Secure checkout", "30-day returns"],
    },
    // Optional: keep ONE video for motion (delete this block + markup if not needed)
    videos: [
      {
        poster:
          "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-poster-00001.jpg",
        mp4: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-transcode.mp4",
        webm: "https://moussamamadou.github.io/scroll-trigger-gsap-section/videos/9430543-uhd_4096_2160_25fps-transcode.webm",
      },
    ],
  },
];

function WorkItem({ item, index }) {
  return (
    <div className="work_item" data-work="item">
      <div className="work_image-wrapper">
        <img
          src={item.image}
          alt={item.id}
          className="work_image"
          data-work="image"
          loading="lazy"
        />
      </div>

      <div className="work_item-wrapper">
        {/* Optional video row */}
        {item.videos?.length ? (
          <div className="work_video-wrapper">
            {item.videos.map((v, i) => (
              <div className="work_video-container" data-work="video" key={i}>
                <div className="work_video">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{ backgroundImage: `url("${v.poster}")` }}
                    data-object-fit="cover">
                    <source src={v.mp4} type="video/mp4" />
                    <source src={v.webm} type="video/webm" />
                  </video>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="work_text">
          <div className="work_text-title">
            {item.titleLines.map((line, i) => {
              const isAccent = i === item.titleAccentIndex;
              return (
                <div className="line-wrapper" key={i}>
                  <div className="line" data-line>
                    {isAccent ? (
                      <>
                        <span className={item.accentClass}>{line.split(" ")[0]} </span>
                        {line.split(" ").slice(1).join(" ")}
                      </>
                    ) : (
                      line
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="work-text-subtitle">
            {item.subLines.map((t, i) => (
              <div className="line-wrapper" key={i}>
                <div className="line" data-line>
                  {t}
                </div>
              </div>
            ))}
          </div>

          {/* Ecommerce block */}
          <div className="work_ecom">
            <div className="work_price" data-line>
              {item.meta?.price}
            </div>

            <div className="work_actions">
              <button className="work_cta primary" type="button" data-line>
                {item.meta?.cta}
              </button>
              <button className="work_cta secondary" type="button" data-line>
                {item.meta?.secondary}
              </button>
            </div>

            <div className="work_trust">
              {item.meta?.trust?.map((x, i) => (
                <div className="work_trust-item" key={i} data-line>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="work_item-overlay" data-work="item-overlay"></div>
    </div>
  );
}

export default function ScrollTriggerGsapSectionReact_SingleEcom() {
  const sectionRef = useRef(null);
  const ghostCount = useMemo(() => WORK_ITEMS.length, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const items = Array.from(sectionEl.querySelectorAll('[data-work="item"]'));
    const ghosts = Array.from(sectionEl.querySelectorAll('[data-ghost="item"]'));

    if (!items.length || ghosts.length !== items.length) return;

    // Pin each item (only one here)
    gsap.set(items, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      clipPath: "inset(100% 0 0% 0)",
    });

    const triggers = [];

    items.forEach((el, index) => {
      const ghost = ghosts[index];

      const lines = el.querySelectorAll("[data-line]");
      const workImage = el.querySelector('[data-work="image"]');
      const videoContainers = el.querySelectorAll('[data-work="video"]');
      const overlay = el.querySelector('[data-work="item-overlay"]');

      gsap.set(workImage, { scale: 1.4, yPercent: 10 });

      const stStarting = {
        trigger: ghost,
        scrub: true,
        start: "top bottom",
        end: "+=75vh top",
      };

      // Reveal item via clipPath
      triggers.push(
        gsap.to(el, { clipPath: "inset(0% 0 0 0)", scrollTrigger: stStarting }).scrollTrigger,
      );

      // Image movement
      triggers.push(
        gsap.to(workImage, { yPercent: 10, scale: 1.2, scrollTrigger: stStarting }).scrollTrigger,
      );

      // Text lines in
      triggers.push(
        gsap.from(lines, {
          yPercent: 125,
          rotate: 2.5,
          ease: "power2.inOut",
          duration: 1.25,
          scrollTrigger: {
            trigger: ghost,
            start: "top 75%",
            toggleActions: "play reverse restart reverse",
          },
        }).scrollTrigger,
      );

      // Image blur + fade
      triggers.push(
        gsap.to(workImage, {
          filter: "blur(10px)",
          opacity: 0.3,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ghost,
            scrub: true,
            start: "0 top",
            end: "35% top",
          },
        }).scrollTrigger,
      );

      // Optional videos slide
      if (videoContainers?.length) {
        triggers.push(
          gsap.from(videoContainers, {
            x: "100vw",
            scrollTrigger: {
              trigger: ghost,
              scrub: true,
              start: "0 top",
              end: "65% top",
              onLeave: () => {
                gsap.set(overlay, { display: "flex", opacity: 0 });
              },
            },
          }).scrollTrigger,
        );
      }

      // Final overlay + slight drift
      const stFinal = {
        trigger: ghost,
        scrub: true,
        start: "105% bottom",
        toggleActions: "play reverse play reverse",
      };

      triggers.push(
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, scrollTrigger: stFinal }).scrollTrigger,
      );

      if (videoContainers?.length) {
        triggers.push(
          gsap.to(videoContainers, { yPercent: 15, scrollTrigger: stFinal }).scrollTrigger,
        );
      }

      triggers.push(gsap.to(el, { filter: "blur(1px)", scrollTrigger: stFinal }).scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t?.kill?.());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero_section sticky">
        <div className="hero_container">
          <div className="footer_image-wrapper">
            <img
              src="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon.jpg"
              alt="hero"
              className="hero_image"
              loading="lazy"
            />
          </div>
          <div className="hero_text">
            <div>
              Discover.
              <br />
              <span className="color-0">WEBSCHEMA </span>
              shop.
            </div>
          </div>
        </div>
      </section>

      {/* Work section */}
      <section className="work_section" data-work="section" ref={sectionRef}>
        {/* Ghost spacer */}
        <div className="ghost_work-container" aria-hidden="true">
          {Array.from({ length: ghostCount }).map((_, i) => (
            <div
              key={i}
              data-ghost="item"
              className="ghost_work-item"
              style={{ width: "100%", height: "100vh" }}
            />
          ))}
        </div>

        <div className="work_container">
          {WORK_ITEMS.map((item, idx) => (
            <WorkItem item={item} index={idx} key={item.id} />
          ))}
        </div>
      </section>

      {/* Footer */}
      {/*    <section className="footer_section">
        <div className="footer_container">
          <div className="footer_image-wrapper">
            <img
              src="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718345_11zon_11zon_11zon.jpg"
              alt="footer"
              className="footer_image"
              loading="lazy"
            />
          </div>
          <div className="footer_text">
            <div>
              Thanks for
              <br />
              <span className="color-0">shopping </span>
              with us.
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}

/**
 * Optional CSS additions (put in your stylesheet):
 *
 * .work_ecom { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.9rem; }
 * .work_price { font-size: 1.4rem; letter-spacing: 0.02em; opacity: 0.95; }
 * .work_actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
 * .work_cta { border-radius: 999px; padding: 0.8rem 1.1rem; font-size: 0.95rem; border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.25); color: white; cursor: pointer; }
 * .work_cta.primary { background: rgba(255,255,255,0.18); }
 * .work_cta:hover { transform: translateY(-1px); }
 * .work_trust { display: flex; gap: 0.75rem; flex-wrap: wrap; font-size: 0.85rem; opacity: 0.8; }
 * .work_trust-item { border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 0.35rem 0.6rem; background: rgba(0,0,0,0.18); }
 */
