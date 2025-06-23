import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const ShowAllAnswers = () => {
  const resultUser = useSelector((state) => state.mernQuize.result);
  const singleQuiz = useSelector((state) => state?.mernQuize.QuizData);
  const questionArr = singleQuiz[0]?.questionArray;
  const [current, setCurrent] = useState(0);

  if (!questionArr || !resultUser) return null;
  const question = questionArr[current];
  const userAnswer = resultUser[current];
  const isCorrect = userAnswer === question.correctAnswer;
  const explanation = question.explanation || "No explanation provided.";

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Quiz Review</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="mb-8"
        >
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Question {current + 1}:</span>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">{question.questions}</p>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Your Answer:</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-lg font-bold ${isCorrect ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{userAnswer || "No answer"}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Correct Answer:</span>
            <span className="ml-2 px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-lg font-bold">{question.correctAnswer}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <span className="font-semibold text-gray-700 dark:text-gray-200">Explanation:</span>
            <p className="ml-2 mt-2 text-gray-800 dark:text-gray-300 italic bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">{explanation}</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">{current + 1} / {questionArr.length}</span>
        <button
          onClick={() => setCurrent((c) => Math.min(questionArr.length - 1, c + 1))}
          disabled={current === questionArr.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="mt-8 text-center">
        <Link to="/result">
          <button className="text-xl font-bold bg-teal-400 px-6 py-2 rounded-lg shadow hover:bg-teal-500 transition-colors">Final Marks</button>
        </Link>
      </div>
    </div>
  );
};
