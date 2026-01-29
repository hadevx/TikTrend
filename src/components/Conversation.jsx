import React, { useState } from "react";
import { motion } from "framer-motion";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "مرحباً يا حسين 👋 أنا مساعدك الذكي. اختر من القائمة:",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [typing, setTyping] = useState(false);

  const [quickReplies, setQuickReplies] = useState([
    "الأسعار 💰",
    "الدعم الفني 🛠️",
    "الباقات 📦",
    "خروج 🚪",
  ]);

  // التعامل مع الردود
  const handleChoice = (choice) => {
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: choice,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    let botReply = "لم أفهم طلبك.";
    let options = [];

    if (choice.includes("الأسعار")) {
      botReply = "أسعارنا تبدأ من 9.99$ شهرياً.";
      options = ["أرني الباقات 📦", "تجربة مجانية 🎉"];
    } else if (choice.includes("الدعم")) {
      botReply = "يمكنك التواصل مع الدعم عبر: 📧 support@example.com";
    } else if (choice.includes("الباقات")) {
      botReply = "لدينا 3 باقات:\n- برونزية 🥉\n- فضية 🥈\n- ذهبية 🥇";
      options = ["تفاصيل البرونزية", "تفاصيل الفضية", "تفاصيل الذهبية"];
    } else if (choice.includes("تفاصيل البرونزية")) {
      botReply = "الباقة البرونزية 🥉: مناسبة للمبتدئين - 9.99$/شهر.";
    } else if (choice.includes("تفاصيل الفضية")) {
      botReply = "الباقة الفضية 🥈: متوازنة - 19.99$/شهر.";
    } else if (choice.includes("تفاصيل الذهبية")) {
      botReply = "الباقة الذهبية 🥇: كاملة - 29.99$/شهر.";
    } else if (choice.includes("خروج")) {
      botReply = "مع السلامة يا حسين 👋";
      options = [];
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setQuickReplies(options);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto h-[600px] border rounded-xl flex flex-col shadow-lg bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="p-4 border-b font-semibold bg-blue-600 text-white rounded-t-xl text-center">
        🤖 المساعد الذكي
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}>
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                🤖
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] break-words shadow ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">{msg.time}</p>
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                👤
              </div>
            )}
          </motion.div>
        ))}
        {typing && <div className="text-sm text-gray-500 italic">المساعد يكتب...</div>}
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="p-3 border-t bg-white flex flex-wrap gap-2 justify-center">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(qr)}
              className="px-3 py-2 text-sm bg-blue-50 border border-blue-300 rounded-full hover:bg-blue-100 transition">
              {qr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
