import React, { useState } from "react";

const HeartWithPop = () => {
  const [count, setCount] = useState(0);
  const [particles, setParticles] = useState([]);

  const handleClick = () => {
    // Create 5 small hearts flying outward
    const newParticles = Array.from({ length: 5 }, (_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 40 + Math.random() * 20;
      return {
        id: Date.now() + i,
        x: distance * Math.cos(angle),
        y: distance * Math.sin(angle),
        scale: 0.5 + Math.random() * 0.5,
        rotate: Math.random() * 360,
      };
    });
    setParticles(newParticles);
    setCount((prev) => prev + 1);
  };

  const fillPercent = Math.min(count * 20, 100);
  const fillHeight = (24 * fillPercent) / 100;

  return (
    <div className="relative w-16 h-16">
      {/* Main Heart */}
      <svg
        onClick={handleClick}
        viewBox="0 0 24 24"
        className="w-16 h-16 cursor-pointer relative z-10">
        <defs>
          <clipPath id="heart-clip">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                     4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
                     14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                     6.86-8.55 11.54L12 21.35z"
            />
          </clipPath>
          <linearGradient id="heart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7b7b" />
            <stop offset="100%" stopColor="#c70000" />
          </linearGradient>
        </defs>

        {/* Heart outline */}
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
             4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
             14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z"
          fill="none"
          stroke="#b10000"
          strokeWidth="2"
        />

        {/* Heart fill */}
        <rect
          x="0"
          y={24 - fillHeight}
          width="24"
          height={fillHeight}
          fill="url(#heart-gradient)"
          clipPath="url(#heart-clip)"
          style={{
            transition: "all 0.3s ease-in-out",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
          }}
        />
      </svg>

      {/* Pop hearts */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-red-500 text-lg"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%)`,
            animation: `popHeart 0.6s forwards`,
            "--dx": `${p.x}px`,
            "--dy": `${p.y}px`,
            "--scale": p.scale,
            "--rotate": `${p.rotate}deg`,
          }}
          onAnimationEnd={() => setParticles((prev) => prev.filter((x) => x.id !== p.id))}>
          ❤️
        </span>
      ))}

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-lg font-bold">
        {count}
      </div>

      <style>{`
        @keyframes popHeart {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(var(--scale)) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HeartWithPop;
