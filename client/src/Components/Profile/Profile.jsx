import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizDataFrombackend } from "../../Redux/action.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export const Profile = () => {
  const data = useSelector((state) => state.mernQuize.QuizData);
  const [count, setCount] = useState(0);
  const userName = useSelector((state) => state.mernQuize.userName);
  const userEmail = useSelector((state) => state.mernQuize.userEmail);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('streak') || 0));
  const [showReward, setShowReward] = useState(false);
  const today = new Date().toDateString();

  useEffect(() => {
    // Load existing profile image if available
    if (userEmail) {
      // Fetch user's profile image from backend
      const fetchProfileImage = async () => {
        try {
          const response = await axios.get(`https://deep-quiz-6.onrender.com/get-user-profile?email=${userEmail}`);
          if (response.data.profileImage) {
            setProfileImage(response.data.profileImage);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      fetchProfileImage();
    }
  }, [userEmail]);

  useEffect(() => {
    // Load badges from localStorage
    const storedBadges = JSON.parse(localStorage.getItem('badges') || '[]');
    setBadges(storedBadges);
  }, []);

  useEffect(() => {
    // Fetch user's quiz attempts
    if (userEmail) {
      axios.get('https://deep-quiz-6.onrender.com/getuser')
        .then(res => {
          const user = res.data.find(u => u.email === userEmail);
          setQuizAttempts(user?.quizAttempted || []);
        });
    }
  }, [userEmail]);

  useEffect(() => {
    // Check if user completed today's challenge
    const lastQuizDate = localStorage.getItem('lastQuizDate');
    if (lastQuizDate !== today && quizAttempts.length > 0) {
      // If user completed a quiz today, increment streak
      if (quizAttempts.some(a => new Date(a.date).toDateString() === today)) {
        setStreak(s => {
          const newStreak = s + 1;
          localStorage.setItem('streak', newStreak);
          localStorage.setItem('lastQuizDate', today);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 2500);
          return newStreak;
        });
      }
    }
  }, [quizAttempts, today]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !userEmail) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      // Convert image to base64 for storage
      const base64Image = profileImage;
      
      const response = await axios.put("https://deep-quiz-6.onrender.com/update-profile-image", {
        email: userEmail,
        profileImage: base64Image
      });

      if (response.data.message === "Profile image updated successfully") {
        toast.success("Profile image updated successfully!");
        setSelectedFile(null);
      } else {
        toast.error("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to render badge icons
  const badgeIcons = {
    html: (
      <span className="inline-flex items-center px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold mr-2 mb-2">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" className="w-5 h-5 mr-1" />
        HTML Badge
      </span>
    ),
    // Add more badges here as needed
  };

  // Analytics data
  const scoreData = (() => {
    // Simulate scores over time from quizAttempts
    const labels = quizAttempts.map((a, i) => `Quiz ${i + 1}`);
    const scores = quizAttempts.map(a => Array.isArray(a.quizResult) ? a.quizResult.filter(x => x).length : 0);
    return {
      labels,
      datasets: [{ label: 'Score', data: scores, backgroundColor: 'rgba(59,130,246,0.7)', borderColor: 'rgba(59,130,246,1)', fill: false }]
    };
  })();
  const badgeData = {
    labels: badges.length > 0 ? badges : ['No badges'],
    datasets: [{
      data: badges.length > 0 ? badges.map(() => 1) : [1],
      backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'],
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-lg text-gray-600 italic">
            "The beautiful thing about learning is that nobody can take it away from you."
          </p>
          <p className="text-sm text-gray-500 mt-2">– B.B. King</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-100 shadow-lg">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-500">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Controls */}
              {selectedFile && (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{isUploading ? "Uploading..." : "Save Image"}</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    {selectedFile.name}
                  </p>
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {userName}
              </h2>
              {/* Badges Section */}
              {badges.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Badges Earned:</h3>
                  <div className="flex flex-wrap">
                    {badges.map((badge, idx) => (
                      <span key={badge + idx}>{badgeIcons[badge] || badge}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Active Learner</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Email: {userEmail}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Member since 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timed Challenge & Streaks Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 dark:from-yellow-900 dark:via-pink-900 dark:to-blue-900 rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Daily Challenge</h3>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">Complete at least one quiz today to keep your streak!</p>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Current Streak:</span>
              <motion.span
                key={streak}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-pink-600 dark:text-yellow-300"
              >
                {streak} 🔥
              </motion.span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(streak, 7) * 14.28}%` }}
              className="h-2 bg-pink-400 rounded-full mt-2 mb-2"
              style={{ width: '100%', maxWidth: 300 }}
            >
              <motion.div
                className="h-2 bg-green-400 rounded-full"
                style={{ width: `${Math.min(streak, 7) * 14.28}%` }}
                transition={{ duration: 0.7, type: "spring" }}
              />
            </motion.div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Keep your streak for 7 days to earn a badge!</span>
          </div>
          <AnimatePresence>
            {showReward && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 text-2xl font-bold"
              >
                🎉 Streak Up! Keep it going!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Your Progress</h3>
            <Line data={scoreData} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Badges Earned</h3>
            <Pie data={badgeData} />
          </div>
          {/* Improvement Area (placeholder) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-pink-600 mb-4">Improvement Area</h3>
            <p className="text-gray-700 dark:text-gray-200">Keep practicing quizzes to see your improvement trends here soon!</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 transform">
              Start New Quiz
            </button>
          </Link>
          <Link to="/feedback">
            <button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 transform">
              Give Feedback
            </button>
          </Link>
          <Link to="/faq">
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 transform">
              FAQ
            </button>
          </Link>
        </div>

        {/* Quiz Attempts Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold mb-4 text-blue-600">Your Quiz Attempts</h3>
          {quizAttempts.length === 0 ? (
            <p className="text-gray-500">You have not attempted any quizzes yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Quiz ID</th>
                  <th className="py-2 px-4">Marks</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map((a, idx) => (
                  <tr key={a.quizId || idx} className="border-t">
                    <td className="py-2 px-4">{a.quizId}</td>
                    <td className="py-2 px-4">{Array.isArray(a.quizResult) ? a.quizResult.filter(x => x).length : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
