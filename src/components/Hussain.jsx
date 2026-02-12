import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
/**
 * ✅ React version of your Codrops demo
 * - Keeps same behavior:
 *   - Preload images
 *   - Drag shirts (mouse + touch)
 *   - Hover over center image during drag swaps to *Center* hover image (ModelHover if exists)
 *   - Drop on center swaps center model image to the dragged shirt’s model
 *   - Tooltip toggle
 *   - Resize clears inline left/top so responsive CSS works
 *
 * Notes:
 * - This expects your assets are in /public/assets/ (React/Vite/Next public folder)
 *   Example: public/assets/1Product.png, public/assets/1Model.png, public/assets/1ModelHover.png, etc.
 * - You should move your CSS (base.css) into your app and keep classes the same.
 */

function preloadImages(imageArray) {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const totalImages = imageArray.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    imageArray.forEach((path) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) resolve();
      };
      img.onerror = () => {
        loadedCount++;
        console.warn(`Failed to load image: ${path}`);
        if (loadedCount === totalImages) resolve();
      };
      img.src = path;
    });
  });
}

const INITIAL_SHIRTS = [
  {
    id: "p1",
    productSrc: "/avatar2.jpg",
    modelSrc: "/avatar2.jpg",
    name: "Ratphex-T",
    size: "L",
    posClass: "top-left",
  },
  {
    id: "p3",
    productSrc: "/3Product.png",
    modelSrc: "/3Model.png",
    name: "AnimalCollective-T",
    size: "S",
    posClass: "bottom-left",
  },
  {
    id: "p2",
    productSrc: "/2Product.png",
    modelSrc: "/2Model.png",
    name: "RatwardScissor-T",
    size: "XL",
    posClass: "middle-right",
  },
];

export default function InteractiveStylingCanvas() {
  const shirts = useMemo(() => INITIAL_SHIRTS, []);

  const shirtsContainerRef = useRef(null);
  const centerImageRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState(`Model is 5ft 4" and wears size S`);

  // Center image (what's currently shown)
  const [centerSrc, setCenterSrc] = useState("/assets/1Model.png");

  // Track valid hover paths for center image
  const validHoverPathsRef = useRef(new Set());

  // Drag state stored in refs to avoid re-renders on move
  const dragRef = useRef({
    activeEl: null,
    initialLeft: "",
    initialTop: "",
    currentX: 0,
    currentY: 0,
    lastX: 0,
    lastY: 0,
    isMoving: false,
    moveTimeout: null,
    originalCenterSrc: "",
    isHoveringCenter: false,
  });

  // Preload images + build valid hover set
  useEffect(() => {
    const paths = [];

    shirts.forEach((s) => {
      paths.push(s.productSrc, s.modelSrc);
      const hover = s.modelSrc.replace("Model.png", "ModelHover.png");
      if (hover !== s.modelSrc) {
        paths.push(hover);
        validHoverPathsRef.current.add(hover);
      }
    });

    // also preload center src
    paths.push(centerSrc);

    const unique = Array.from(new Set(paths)).filter(Boolean);

    preloadImages(unique).then(() => setLoading(false));
  }, [shirts, centerSrc]);

  // Resize: reset inline positioning so CSS classes take over
  useEffect(() => {
    const onResize = () => {
      const nodes = shirtsContainerRef.current?.querySelectorAll(".shirt");
      if (!nodes) return;
      nodes.forEach((el) => {
        el.style.left = "";
        el.style.top = "";
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const onDocClick = () => {
      setTooltipVisible(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const getClientXY = (e) => {
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const normalizeToBaseModel = (src) => {
    // if src ends with ModelHover.png -> turn into Model.png
    if (!src) return src;
    if (src.endsWith("ModelHover.png")) return src.replace("ModelHover.png", "Model.png");
    return src;
  };

  const deriveHoverForBase = (baseSrc) => {
    if (!baseSrc) return null;
    if (!baseSrc.endsWith("Model.png")) return null;
    const hover = baseSrc.replace("Model.png", "ModelHover.png");
    if (validHoverPathsRef.current.has(hover)) return hover;
    return null;
  };

  const cleanupDragListeners = () => {
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleEnd);
    document.removeEventListener("touchcancel", handleEnd);
  };

  const handleStart = (e) => {
    e.preventDefault();

    const el = e.currentTarget;
    const state = dragRef.current;

    state.activeEl = el;

    // store base/original center image (ensure not hover)
    const baseCenter = normalizeToBaseModel(centerSrc);
    state.originalCenterSrc = baseCenter;
    state.isHoveringCenter = false;

    // store initial computed left/top (as in original code)
    const computed = window.getComputedStyle(el);
    state.initialLeft = computed.left || "0px";
    state.initialTop = computed.top || "0px";
    state.currentX = parseInt(state.initialLeft, 10) || 0;
    state.currentY = parseInt(state.initialTop, 10) || 0;

    const { x, y } = getClientXY(e);
    state.lastX = x;
    state.lastY = y;

    // style
    el.style.cursor = "grabbing";
    el.style.zIndex = "1000";
    el.classList.add("grabbed");

    // listeners
    if (e.type === "mousedown") {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
    } else {
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
    }
  };

  const handleMove = (e) => {
    const state = dragRef.current;
    const el = state.activeEl;
    const centerEl = centerImageRef.current;

    if (!el || !centerEl) return;
    e.preventDefault();

    const { x, y } = getClientXY(e);

    const deltaX = x - state.lastX;
    const deltaY = y - state.lastY;

    state.currentX += deltaX;
    state.currentY += deltaY;

    el.style.left = `${state.currentX}px`;
    el.style.top = `${state.currentY}px`;

    // collision detection (bounding boxes) for hover effect
    const shirtRect = el.getBoundingClientRect();
    const centerRect = centerEl.getBoundingClientRect();

    const collision = !(
      shirtRect.right < centerRect.left ||
      shirtRect.left > centerRect.right ||
      shirtRect.bottom < centerRect.top ||
      shirtRect.top > centerRect.bottom
    );

    if (collision) {
      const hover = deriveHoverForBase(state.originalCenterSrc);
      const alreadyHover = centerSrc.endsWith("ModelHover.png");

      if (!alreadyHover && hover) {
        setCenterSrc(hover);
        state.isHoveringCenter = true;
      }
    } else {
      if (state.isHoveringCenter && state.originalCenterSrc) {
        setCenterSrc(state.originalCenterSrc);
        state.isHoveringCenter = false;
      }
    }

    // dragging direction classes
    const isMovingNow = Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2;

    if (isMovingNow && !state.isMoving) {
      el.classList.remove("grabbed");
      el.classList.add(deltaX > 0 ? "dragging-right" : "dragging-left");
      state.isMoving = true;
    } else if (state.isMoving && deltaX !== 0) {
      el.classList.remove("dragging-right", "dragging-left");
      el.classList.add(deltaX > 0 ? "dragging-right" : "dragging-left");
    }

    state.lastX = x;
    state.lastY = y;

    if (state.moveTimeout) window.clearTimeout(state.moveTimeout);
    state.moveTimeout = window.setTimeout(() => {
      if (!state.activeEl) return;
      if (state.isMoving) {
        el.classList.remove("dragging-right", "dragging-left");
        el.classList.add("grabbed");
        state.isMoving = false;
      }
    }, 50);
  };

  const handleEnd = (e) => {
    const state = dragRef.current;
    const el = state.activeEl;
    const centerEl = centerImageRef.current;

    if (!el || !centerEl) {
      cleanupDragListeners();
      state.activeEl = null;
      return;
    }

    // precise collision: shirt center inside center image
    const shirtRect = el.getBoundingClientRect();
    const centerRect = centerEl.getBoundingClientRect();

    const shirtCenterX = shirtRect.left + shirtRect.width / 2;
    const shirtCenterY = shirtRect.top + shirtRect.height / 2;

    const collision =
      shirtCenterX >= centerRect.left &&
      shirtCenterX <= centerRect.right &&
      shirtCenterY >= centerRect.top &&
      shirtCenterY <= centerRect.bottom;

    if (collision) {
      const newModelSrc = el.getAttribute("data-model-src");
      if (newModelSrc) {
        const base = normalizeToBaseModel(newModelSrc);
        setCenterSrc(base);
        state.originalCenterSrc = base;

        const size = el.getAttribute("data-model-size") || "S";
        setTooltipText(`Model is 5ft 4" and wears size ${size}`);
      }
    } else {
      // revert if we were hovering
      if (state.isHoveringCenter && state.originalCenterSrc) {
        setCenterSrc(state.originalCenterSrc);
      }
    }

    // reset shirt position
    el.style.left = state.initialLeft;
    el.style.top = state.initialTop;
    state.currentX = parseInt(state.initialLeft, 10) || 0;
    state.currentY = parseInt(state.initialTop, 10) || 0;

    // reset classes/styles
    el.style.cursor = "grab";
    el.style.zIndex = "";
    el.classList.remove("dragging-right", "dragging-left", "grabbed");

    if (state.moveTimeout) window.clearTimeout(state.moveTimeout);

    cleanupDragListeners();

    state.isHoveringCenter = false;
    state.activeEl = null;
  };

  return (
    <div className={loading ? "demo-1 loading" : "demo-1"}>
      <main>
        <header className="frame">
          <h1 className="frame__title">Interactive Styling UI</h1>
          <a className="frame__back" href="https://tympanus.net/codrops/?p=94987">
            Article
          </a>
          <a className="frame__archive" href="https://tympanus.net/codrops/demos/">
            All demos
          </a>
          <a
            className="frame__github"
            href="https://github.com/kaberikram/Interactive-Styling-Canvas">
            GitHub
          </a>
          <nav className="frame__tags">
            <a href="https://tympanus.net/codrops/demos/?tag=draggable">#draggable</a>
          </nav>
        </header>

        <div className="container">
          <div className="shirts-container" ref={shirtsContainerRef}>
            {shirts.map((s) => (
              <img
                key={s.id}
                src={s.productSrc}
                alt={s.name}
                className={clsx("shirt", s.posClass)}
                data-model-src={s.modelSrc}
                data-shirt-name={s.name}
                data-model-size={s.size}
                draggable={false}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
              />
            ))}

            <img
              src={centerSrc}
              alt="Model wearing Product"
              className="rat-center"
              id="centerImage"
              ref={centerImageRef}
              draggable={false}
            />

            <span
              id="info-tooltip"
              data-tooltip={tooltipText}
              className={tooltipVisible ? "tooltip-visible" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setTooltipVisible((v) => !v);
              }}>
              ?
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
