import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, BookOpen, Users, Award, Zap } from "lucide-react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How do I start taking quizzes?",
      answer: "Simply sign up for an account, browse through the available topics (HTML, CSS, JavaScript, React, Redux, MongoDB), and click on any topic to begin your quiz. You can take quizzes multiple times to improve your score.",
      icon: <Zap className="h-5 w-5" />
    },
    {
      question: "Are the quizzes free to take?",
      answer: "Yes! All quizzes on our platform are completely free. We believe in making quality education accessible to everyone who wants to learn and improve their programming skills.",
      icon: <Award className="h-5 w-5" />
    },
    {
      question: "How many questions are in each quiz?",
      answer: "Each quiz contains 10 carefully crafted questions that test your knowledge across different aspects of the topic. The questions range from basic concepts to more advanced scenarios.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      question: "Can I see my previous quiz results?",
      answer: "Yes! After completing a quiz, you'll see your results immediately. You can also access your profile to view your quiz history and track your progress over time.",
      icon: <Users className="h-5 w-5" />
    },
    {
      question: "What if I get a question wrong?",
      answer: "Don't worry! You can review all your answers after completing the quiz. This helps you learn from your mistakes and understand the correct answers for future reference.",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      question: "How often are new questions added?",
      answer: "We regularly update our question database with new, relevant questions to keep the content fresh and aligned with current industry standards and best practices.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      question: "Can I skip questions during a quiz?",
      answer: "Yes, you can skip questions if you're unsure about the answer. However, we recommend trying to answer all questions to get the most accurate assessment of your knowledge.",
      icon: <Zap className="h-5 w-5" />
    },
    {
      question: "Is there a time limit for quizzes?",
      answer: "Currently, there's no strict time limit, but we recommend taking your time to think through each question carefully. This helps ensure you're truly understanding the concepts.",
      icon: <Award className="h-5 w-5" />
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our quiz platform and how to make the most of your learning experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-blue-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-blue-100 mb-6">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Send Feedback
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 