import React from "react";
import Level from "./Level";
import { Trophy } from "lucide-react";
import test from "../assets/test2.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";
import avatar4 from "../assets/avatar4.jpg";
import avatar5 from "../assets/avatar5.jpg";
import avatar6 from "../assets/avatar6.jpg";
import avatar7 from "../assets/avatar7.jpg";

// Dummy users with assigned avatars
const users = [
  { id: 1, name: "Ali", level: 15, avatar: avatar2 },
  { id: 2, name: "Mohammed", level: 22, avatar: avatar2 },
  { id: 3, name: "Sarah", level: 9, avatar: avatar3 },
  { id: 4, name: "Eman", level: 90, avatar: avatar6 },
  { id: 5, name: "Fahad", level: 18, avatar: avatar5 },
  { id: 6, name: "Faisel", level: 45, avatar: avatar4 },
  { id: 7, name: "Angham", level: 52, avatar: avatar7 },
  { id: 8, name: "Faris", level: 68, avatar: avatar2 }, // You can add more unique avatars
];

export default function Leaderboard() {
  const sortedUsers = [...users].sort((a, b) => b.level - a.level);
  const topThree = sortedUsers.slice(0, 3);
  const others = sortedUsers.slice(3);

  return (
    <div className="max-w-4xl w-full bg-gray-900 rounded-xl shadow-2xl p-6 mt-6 text-white">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-yellow-400">
        <Trophy className="w-8 h-8" /> Leaderboard
      </h2>

      {/* Podium for top 3 */}
      <div className="flex justify-center items-end gap-6 mb-8">
        {topThree.map((user, index) => (
          <div
            key={user.id}
            className="flex flex-col items-center transition-transform transform hover:scale-105">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
                index === 0
                  ? "border-yellow-400"
                  : index === 1
                  ? "border-gray-400"
                  : "border-amber-500"
              }`}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-center transform scale-125 "
              />
            </div>
            <div className="mt-2 font-bold text-lg">{user.name}</div>
            <Level level={user.level} />
            <div className="mt-1 text-sm text-gray-300">
              #{index + 1 === 1 ? "1st" : index + 1 === 2 ? "2nd" : "3rd"}
            </div>
          </div>
        ))}
      </div>

      {/* Other users */}
      <div className="divide-y divide-gray-700">
        {others.map((user, index) => (
          <div
            key={user.id}
            className="flex justify-between items-center py-4 px-4 rounded-lg mb-2 bg-gray-800 hover:bg-gray-700 transition-transform transform hover:scale-105">
            <div className="flex items-center gap-4">
              <span className="font-bold text-xl">{index + 4}</span>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-center transform scale-105"
                />
              </div>
              <span className="font-semibold text-lg">{user.name}</span>
            </div>
            <Level level={user.level} />
          </div>
        ))}
      </div>
    </div>
  );
}
