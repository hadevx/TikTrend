import { useState } from "react";

// Sample products with mood tags
const allProducts = [
  {
    id: 1,
    name: "Colorful T-Shirt",
    price: 5.5,
    mood: "Happy",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Romantic Candle",
    price: 3.2,
    mood: "Romantic",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Stress Relief Tea",
    price: 4.8,
    mood: "Stressed",
    image: "https://via.placeholder.com/150",
  },
  { id: 4, name: "Yoga Mat", price: 12.5, mood: "Chill", image: "https://via.placeholder.com/150" },
  {
    id: 5,
    name: "Travel Backpack",
    price: 25.0,
    mood: "Adventurous",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 8.0,
    mood: "Happy",
    image: "https://via.placeholder.com/150",
  },
];

const moods = [
  { mood: "Happy", color: "bg-yellow-400", emoji: "😄" },
  { mood: "Romantic", color: "bg-pink-500", emoji: "💕" },
  { mood: "Stressed", color: "bg-blue-500", emoji: "😰" },
  { mood: "Chill", color: "bg-green-400", emoji: "🧘" },
  { mood: "Adventurous", color: "bg-orange-500", emoji: "🌍" },
];

export default function MoodShopping() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  // Filter products locally based on selected mood
  const filteredProducts = selectedMood ? allProducts.filter((p) => p.mood === selectedMood) : [];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center p-4">
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-rose-500 text-white px-6 py-3 rounded-lg shadow-md font-bold">
        Shop by Mood
      </button>

      {/* Mood Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-80 md:w-[500px] shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
              onClick={() => setIsModalOpen(false)}>
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">How are you feeling today?</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {moods.map((m) => (
                <button
                  key={m.mood}
                  onClick={() => {
                    setSelectedMood(m.mood);
                    setIsModalOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold transition shadow-md ${m.color} hover:scale-105`}>
                  <span>{m.emoji}</span> {m.mood}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Display products */}
      {selectedMood && (
        <div className="mt-6 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No products found for "{selectedMood}"
            </p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-center">{p.name}</h3>
                <p className="text-gray-600">{p.price.toFixed(3)} KD</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
