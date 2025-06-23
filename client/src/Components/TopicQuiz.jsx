import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  ALargeSmall,
  Atom,
  Database,
  Orbit,
  ChevronRight,
} from "lucide-react";

export const TopicQuiz = () => {
  const userId = useSelector((state) => state.mernQuize.userId);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  const topics = [
    { name: "HTML", icon: <Code size={32} />, path: "/quiz/html", color: "from-orange-400 to-red-500" },
    { name: "CSS", icon: <Palette size={32} />, path: "/quiz/css", color: "from-blue-400 to-sky-500" },
    { name: "JavaScript", icon: <ALargeSmall size={32} />, path: "/quiz/javascript", color: "from-yellow-400 to-amber-500" },
    { name: "React", icon: <Atom size={32} />, path: "/quiz/react", color: "from-sky-400 to-cyan-500" },
    { name: "Redux", icon: <Orbit size={32} />, path: "/quiz/redux", color: "from-purple-400 to-indigo-500" },
    { name: "MongoDB", icon: <Database size={32} />, path: "/quiz/mongodb", color: "from-green-400 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            Test Your Knowledge
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Select a topic to start your quiz.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topics.map((topic) => {
            const to = userId ? topic.path : "/register";
            return (
              <Link to={to} key={topic.name}>
                <motion.div
                  className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-300"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color} text-white shadow-lg`}>
                      {topic.icon}
                    </div>
                    <h2 className="ml-5 text-2xl font-bold text-gray-700">
                      {topic.name}
                    </h2>
                  </div>
                  <ChevronRight
                    size={28}
                    className="text-gray-400 group-hover:text-gray-600 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};
