import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const dummyLeaders = [
  { name: "Alice", score: 98 },
  { name: "Bob", score: 92 },
  { name: "Charlie", score: 89 },
  { name: "Diana", score: 85 },
  { name: "Eve", score: 80 },
];

export default function Leaderboard() {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">Leaderboard</h2>
      <AnimatePresence>
        {dummyLeaders.map((user, idx) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            className={`flex items-center justify-between px-6 py-4 mb-4 rounded-lg shadow-md bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 ${idx === 0 ? "border-4 border-yellow-400" : ""}`}
          >
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {idx + 1}. {user.name}
            </span>
            <span className="text-2xl font-bold text-blue-700 dark:text-yellow-300">{user.score}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 