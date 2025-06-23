import React from "react";
import { motion } from "framer-motion";

export const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6"
          >
            About Our Quiz Platform
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Empowering developers to test and enhance their knowledge in modern web technologies
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe in making learning interactive and engaging. Our platform provides
              comprehensive quizzes covering the latest web technologies, helping developers
              stay updated with industry standards and best practices.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Offer</h2>
            <ul className="text-gray-600 space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Interactive quizzes on 6 major technologies
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Real-time scoring and performance tracking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                Detailed explanations for each answer
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Progress monitoring and analytics
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Technologies Covered</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {["HTML5", "CSS3", "JavaScript", "React", "Redux", "MongoDB"].map((tech) => (
              <div
                key={tech}
                className="bg-white/20 rounded-lg p-4 backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <span className="font-semibold">{tech}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet the Developer</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">deepak</h3>
            <p className="text-gray-600 mb-4">Full Stack Web Developer</p>
            <p className="text-gray-600">
              Passionate about creating innovative web solutions and helping developers
              enhance their skills through interactive learning experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 