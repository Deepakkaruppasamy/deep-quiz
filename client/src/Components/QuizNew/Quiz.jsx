import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postQuizResult, postUserResult } from "../../Redux/action.js";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import axios from "axios";

// Sound effect utility
function playBeep(frequency = 440, duration = 150, type = 'sine') {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);
  oscillator.stop(ctx.currentTime + duration / 1000);
  oscillator.onended = () => ctx.close();
}

export const Quiz = (props) => {
  const { questionArr, timerPerQuestion: propTimerPerQuestion } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state?.mernQuize?.QuizData);
  const userID = useSelector((state) => state?.mernQuize?.userId);
  const quizID = data && data.length > 0 ? data[0]._id : null;

  const [num, setNum] = useState(0);
  const [ans, setAns] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer logic
  const secondsPerQuestion = propTimerPerQuestion || 60; // Use prop or default
  const totalTime = questionArr.length * secondsPerQuestion;

  const quizContainerRef = useRef();

  // Webcam proctoring (requires user consent and privacy policy)
  const [webcamStream, setWebcamStream] = useState(null);
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setWebcamStream(stream);
      } catch (err) {
        alert('Webcam access denied. Proctoring will not be enabled.');
      }
    };
    startWebcam();
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
    // Privacy note: Inform users their webcam is being used for proctoring. Do not record or transmit video without explicit consent.
  }, []);

  // Prevent back button abuse
  useEffect(() => {
    const handlePopState = (e) => {
      window.history.pushState(null, '', window.location.href);
      alert('Back navigation is disabled during the quiz.');
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const blockEvent = (e) => e.preventDefault();
    const blockKey = (e) => {
      // Block F12, Ctrl+Shift+I/J/C/U, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
        alert('Dev tools are disabled during the quiz.');
      }
    };
    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('copy', blockEvent);
    document.addEventListener('paste', blockEvent);
    document.addEventListener('keydown', blockKey);
    return () => {
      document.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('paste', blockEvent);
      document.removeEventListener('keydown', blockKey);
    };
  }, []);

  // Add a function to request fullscreen on user gesture
  const handleEnterFullscreen = () => {
    const el = quizContainerRef.current;
    if (el && el.requestFullscreen) el.requestFullscreen();
    else if (el && el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el && el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el && el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const handleNext = () => {
    setFeedback(null);
    if (num < questionArr.length - 1) {
      setNum(num + 1);
      setAns([...ans, selectedOption]);
      setSelectedOption(null);
    } else {
      // Last question, so we finish
      dispatch(postUserResult([...ans, selectedOption]));
      const obj = {
        quizId: quizID,
        userId: userID,
        quizResult: [...ans, selectedOption],
      };
      axios.post(`https://deep-quiz-6.onrender.com/userResult/${userID}`, obj)
        .then(response => {
          console.log("Quiz result posted successfully:", response.data);
          setShowConfetti(true);
          playBeep(880, 300, 'triangle'); // Quiz completion sound
          setTimeout(() => navigate("/showallanswer"), 2500);
        })
        .catch(error => {
          console.error("Error posting quiz result:", error);
          alert("An error occurred while posting the quiz result.");
        });
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Check if correct
    const correct = question?.correctAnswer === option;
    setFeedback(correct ? 'correct' : 'incorrect');
    playBeep(correct ? 880 : 220, 200, correct ? 'square' : 'sawtooth');
  };

  const question = questionArr[num];
  const progress = ((num + 1) / questionArr.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // handleAutoSubmit(); // Uncomment if you want to auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      playBeep(120, 600, 'sawtooth'); // Time up sound
    }
  }, [timeLeft]);

  return (
    <div ref={quizContainerRef} className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* Webcam overlay */}
      {webcamStream && (
        <video
          autoPlay
          muted
          playsInline
          style={{ position: 'fixed', bottom: 16, right: 16, width: 120, height: 90, borderRadius: 8, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
          ref={video => {
            if (video && webcamStream) video.srcObject = webcamStream;
          }}
        />
      )}
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">
              Question {num + 1} of {questionArr.length}
            </span>
            <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: `${(num / questionArr.length) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        {/* Add a button to enter fullscreen if not already in fullscreen */}
        {document.fullscreenElement == null && (
          <button
            onClick={handleEnterFullscreen}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Enter Fullscreen
          </button>
        )}
        {showConfetti && <ConfettiExplosion />}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {question?.questions}
              </h2>
              <div className="space-y-4">
                {question?.options?.map((option, index) => {
                  const isSelected = selectedOption === option.option;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(option.option)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between
                        ${
                          isSelected
                            ? feedback === 'correct'
                              ? 'bg-green-100 border-green-500 shadow-md'
                              : 'bg-red-100 border-red-500 shadow-md'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium text-gray-700">{option.option}</span>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          {feedback === 'correct' ? (
                            <CheckCircle className="text-green-500" />
                          ) : (
                            <XCircle className="text-red-500" />
                          )}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {/* Instant feedback message */}
              {selectedOption && (
                <div className={`mt-4 text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>{feedback === 'correct' ? 'Correct!' : 'Incorrect!'}</div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-end">
            <motion.button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {num === questionArr.length - 1 ? "Finish" : "Next"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
