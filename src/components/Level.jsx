import React from "react";
import { Star, Flame, Crown, Award, Shield, Gem, Zap, Heart, Rocket, Trophy } from "lucide-react";
import clsx from "clsx";

// Import your 10 badge images
import one from "../assets/levels/one.png";
import two from "../assets/levels/two.png";
import three from "../assets/levels/three.png";
import four from "../assets/levels/four.png";
import five from "../assets/levels/five.png";
import six from "../assets/levels/six.png";
import seven from "../assets/levels/seven.png";
import eight from "../assets/levels/eight.png";
import nine from "../assets/levels/nine.png";
import ten from "../assets/levels/ten.png";

const badges = [one, two, three, four, five, six, seven, eight, nine, ten];

const icons = [
  { icon: Star, color: "bg-yellow-500", shadow: "drop-shadow-[0_0_6px_#eab308]" }, // yellow-500 hex
  { icon: Flame, color: "bg-red-500", shadow: "drop-shadow-[0_0_6px_#ef4444]" }, // red-500 hex
  { icon: Crown, color: "bg-purple-600", shadow: "drop-shadow-[0_0_6px_#9333ea]" }, // purple-600 hex
  { icon: Award, color: "bg-blue-500", shadow: "drop-shadow-[0_0_6px_#3b82f6]" }, // blue-500 hex
  { icon: Shield, color: "bg-green-500", shadow: "drop-shadow-[0_0_6px_#22c55e]" }, // green-500 hex
  { icon: Gem, color: "bg-pink-500", shadow: "drop-shadow-[0_0_6px_#ec4899]" }, // pink-500 hex
  { icon: Zap, color: "bg-orange-500", shadow: "drop-shadow-[0_0_6px_#f97316]" }, // orange-500 hex
  { icon: Heart, color: "bg-rose-500", shadow: "drop-shadow-[0_0_6px_#f43f5e]" }, // rose-500 hex
  { icon: Rocket, color: "bg-cyan-500", shadow: "drop-shadow-[0_0_6px_#06b6d4]" }, // cyan-500 hex
  { icon: Trophy, color: "bg-indigo-600", shadow: "drop-shadow-[0_0_6px_#4f46e5]" }, // indigo-600 hex
];

function UserLevel({ level }) {
  const clampedLevel = Math.max(1, Math.min(100, level));
  const rangeIndex = Math.floor((clampedLevel - 1) / 10);
  const badgeImage = badges[rangeIndex];

  return (
    <div className="relative">
      {/* Badge image */}
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <img
          src={badgeImage}
          alt={`Badge level ${clampedLevel}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Level pill */}
      <span className="absolute -bottom-2 -right-2">
        <Level level={clampedLevel} />
      </span>
    </div>
  );
}

const Level = ({ level }) => {
  const clampedLevel = Math.max(1, Math.min(100, level));
  const rangeIndex = Math.floor((clampedLevel - 1) / 10);
  const { icon: Icon, color, shadow } = icons[rangeIndex];

  return (
    <div
      className={clsx(
        "inline-flex items-center px-2 py-1 rounded-full text-white font-bold text-xs",
        color,
        shadow
      )}>
      <Icon className="w-4 h-4 mr-1" />
      <span>Lvl {clampedLevel}</span>
    </div>
  );
};

export default UserLevel;
