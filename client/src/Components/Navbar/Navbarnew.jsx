import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logouthandleraction } from "../../Redux/action.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { User, LogOut, ChevronDown, BrainCircuit, Sun, Moon } from "lucide-react";
import axios from "axios";

export const Navbarnew = () => {
  const userId = useSelector((state) => state.mernQuize.userId);
  const userName = useSelector((state) => state.mernQuize.userName);
  const userEmail = useSelector((state) => state.mernQuize.userEmail);
  const adminName = useSelector((state) => state.mernQuize.adminName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (userEmail) {
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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  const logouthandler = () => {
    const name = userName || adminName;
    dispatch(Logouthandleraction());
    toast(`${name} Successfully Logged Out`, {
      type: "success",
    });
    navigate("/");
  };

  const profilenavigate = () => {
    navigate("/profile");
  };

  const isLoggedIn = userId !== null;
  const displayName = adminName || userName;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">deep quiz</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link
              to="/feedback"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Feedback
            </Link>
            <Link
              to="/faq"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
            >
              FAQ
            </Link>
            <Link
              to="/attempts"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
              style={{ display: localStorage.getItem('isAdmin') === 'true' ? 'inline' : 'none' }}
            >
              Attempts
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Leaderboard
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 animate-spin-slow mr-1 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 animate-pulse mr-1 text-gray-700" />
              )}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setShowDropdown((v) => !v)}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-700" />
                  )}
                  <span className="font-medium text-gray-800">{displayName}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                >
                  <button
                    onClick={profilenavigate}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </button>
                  <button
                    onClick={logouthandler}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </button>
                </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
