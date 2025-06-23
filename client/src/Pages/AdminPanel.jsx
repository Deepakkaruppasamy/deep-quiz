import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const TABS = ["Dashboard", "Quizzes", "Questions", "Users/Results", "Feedback", "Contact", "Signup/Attempts", "Analytics"];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    category: "",
    difficulty: "",
    tags: "",
  });
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  // Protect route: only allow if isAdmin
  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all quizzes
  useEffect(() => {
    if (activeTab === "Quizzes") {
      setLoading(true);
      axios.get("http://localhost:3755/admin/")
        .then(res => setQuizzes(res.data))
        .catch(() => setQuizzes([]))
        .finally(() => setLoading(false));
    }
  }, [activeTab, showQuizModal]);

  // Fetch user count for dashboard
  useEffect(() => {
    if (activeTab === "Dashboard") {
      axios.get("http://localhost:3755/getuser")
        .then(res => setUserCount(res.data.length))
        .catch(() => setUserCount(0));
    }
  }, [activeTab]);

  // Delete quiz
  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await axios.delete(`http://localhost:3755/admin/${id}`);
      setQuizzes(quizzes.filter(q => q._id !== id));
    }
  };

  // Handle form field changes
  const handleQuizFormChange = (e) => {
    setQuizForm({ ...quizForm, [e.target.name]: e.target.value });
  };

  // Open modal for add/edit
  const openQuizModal = (quiz) => {
    if (quiz) {
      setQuizForm({
        title: quiz.title || "",
        category: quiz.category || "",
        difficulty: quiz.difficulty || "",
        tags: quiz.tags || "",
      });
      setEditQuiz(quiz);
    } else {
      setQuizForm({ title: "", category: "", difficulty: "", tags: "" });
      setEditQuiz(null);
    }
    setShowQuizModal(true);
  };

  // Submit add/edit quiz
  const handleQuizFormSubmit = async (e) => {
    e.preventDefault();
    if (editQuiz) {
      // Edit existing quiz
      await axios.put(`http://localhost:3755/admin/${editQuiz._id}`, quizForm);
    } else {
      // Add new quiz
      await axios.post("http://localhost:3755/admin/", quizForm);
    }
    setShowQuizModal(false);
  };

  // Question management state
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    questions: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });

  // Fetch questions for selected quiz
  useEffect(() => {
    if (activeTab === "Questions" && selectedQuizId) {
      const quiz = quizzes.find(q => q._id === selectedQuizId);
      setQuestions(quiz?.questionArray || []);
    }
  }, [activeTab, selectedQuizId, quizzes, showQuestionModal]);

  // Handle question form changes
  const handleQuestionFormChange = (e) => {
    setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
  };
  const handleOptionChange = (idx, value) => {
    const newOptions = [...questionForm.options];
    newOptions[idx] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  // Open modal for add/edit question
  const openQuestionModal = (question) => {
    if (question) {
      setQuestionForm({
        questions: question.questions || "",
        options: question.options?.map(o => o.option) || ["", "", "", ""],
        correctAnswer: question.correctAnswer || "",
        explanation: question.explanation || "",
      });
      setEditQuestion(question);
    } else {
      setQuestionForm({ questions: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" });
      setEditQuestion(null);
    }
    setShowQuestionModal(true);
  };

  // Submit add/edit question (scaffold, to be implemented)
  const handleQuestionFormSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement backend call for add/edit
    setShowQuestionModal(false);
  };

  // Delete question (scaffold, to be implemented)
  const handleDeleteQuestion = async (idx) => {
    // TODO: Implement backend call for delete
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    // Disable back button after logout
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  };

  // Auto-logout after 15 min inactivity
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000); // 15 min
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, []);

  // Feedback, Contact, and Users/Attempts state
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (activeTab === "Feedback") {
      axios.get("http://localhost:3755/feedback/all").then(res => setFeedbacks(res.data));
    }
    if (activeTab === "Contact") {
      axios.get("http://localhost:3755/contact/all").then(res => setContacts(res.data));
    }
    if (activeTab === "Signup/Attempts") {
      axios.get("http://localhost:3755/getuser").then(res => setUsers(res.data));
    }
  }, [activeTab]);

  // Chart data for Dashboard
  const signupData = (() => {
    // Group users by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);
    users.forEach(u => {
      if (u.createdAt) {
        const d = new Date(u.createdAt);
        counts[d.getMonth()]++;
      }
    });
    return {
      labels: months,
      datasets: [{ label: 'Signups', data: counts, backgroundColor: 'rgba(59,130,246,0.7)' }]
    };
  })();
  const quizAttemptData = (() => {
    // Count attempts per quizId
    const quizMap = {};
    users.forEach(u => {
      (u.quizAttempted || []).forEach(a => {
        quizMap[a.quizId] = (quizMap[a.quizId] || 0) + 1;
      });
    });
    return {
      labels: Object.keys(quizMap),
      datasets: [{ label: 'Attempts', data: Object.values(quizMap), backgroundColor: 'rgba(16,185,129,0.7)' }]
    };
  })();
  const feedbackRatingData = (() => {
    // Count feedbacks by rating
    const ratingMap = {};
    feedbacks.forEach(f => {
      ratingMap[f.rating] = (ratingMap[f.rating] || 0) + 1;
    });
    return {
      labels: Object.keys(ratingMap),
      datasets: [{ label: 'Feedback Ratings', data: Object.values(ratingMap), backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa'] }]
    };
  })();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>
        <ul className="space-y-4">
          {TABS.map((tab) => (
            <li key={tab}>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} className="mt-8 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">Logout</button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "Dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-4xl font-bold text-blue-600">{userCount}</span>
                <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">Total Users</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
                <span className="text-4xl font-bold text-green-600">{quizzes.length}</span>
                <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">Total Quizzes</span>
              </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">User Signups Per Month</h3>
                <Bar data={signupData} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Quiz Attempts Per Quiz</h3>
                <Bar data={quizAttemptData} />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Feedback Ratings Distribution</h3>
                <Pie data={feedbackRatingData} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Recent Quiz Activity</h3>
              <p className="text-gray-500 dark:text-gray-300">(Recent activity coming soon...)</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Top Performing Quizzes</h3>
              <p className="text-gray-500 dark:text-gray-300">(Top quizzes coming soon...)</p>
            </div>
          </div>
        )}
        {activeTab === "Quizzes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">All Quizzes</h3>
              <button onClick={() => { openQuizModal(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">+ Add Quiz</button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              {loading ? (
                <p className="text-gray-500 dark:text-gray-300">Loading quizzes...</p>
              ) : quizzes.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No quizzes found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Title</th>
                      <th className="py-2 px-4">Created At</th>
                      <th className="py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz) => (
                      <tr key={quiz._id} className="border-t">
                        <td className="py-2 px-4">{quiz.title}</td>
                        <td className="py-2 px-4">{quiz.createdAt ? new Date(quiz.createdAt).toLocaleString() : ''}</td>
                        <td className="py-2 px-4 space-x-2">
                          <button onClick={() => { openQuizModal(quiz); }} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                          <button onClick={() => handleDeleteQuiz(quiz._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Quiz Add/Edit Modal (to be implemented) */}
            {showQuizModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg min-w-[350px]">
                  <h2 className="text-xl font-bold mb-4">{editQuiz ? 'Edit Quiz' : 'Add Quiz'}</h2>
                  <form onSubmit={handleQuizFormSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="title"
                      value={quizForm.title}
                      onChange={handleQuizFormChange}
                      placeholder="Quiz Title"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                    <input
                      type="text"
                      name="category"
                      value={quizForm.category}
                      onChange={handleQuizFormChange}
                      placeholder="Category"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      name="difficulty"
                      value={quizForm.difficulty}
                      onChange={handleQuizFormChange}
                      placeholder="Difficulty"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <input
                      type="text"
                      name="tags"
                      value={quizForm.tags}
                      onChange={handleQuizFormChange}
                      placeholder="Tags (comma separated)"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <div className="flex justify-end space-x-2 mt-6">
                      <button type="button" onClick={() => setShowQuizModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editQuiz ? 'Update' : 'Add'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "Questions" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Manage Questions</h3>
            <div className="mb-4">
              <label className="mr-2 font-semibold">Select Quiz:</label>
              <select
                value={selectedQuizId}
                onChange={e => setSelectedQuizId(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">-- Select Quiz --</option>
                {quizzes.map(q => (
                  <option key={q._id} value={q._id}>{q.title}</option>
                ))}
              </select>
            </div>
            {selectedQuizId && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold">Questions</h4>
                  <button onClick={() => openQuestionModal(null)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Question</button>
                </div>
                {questions.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">No questions found for this quiz.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="py-2 px-4">Question</th>
                        <th className="py-2 px-4">Correct Answer</th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((q, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="py-2 px-4">{q.questions}</td>
                          <td className="py-2 px-4">{q.correctAnswer}</td>
                          <td className="py-2 px-4 space-x-2">
                            <button onClick={() => openQuestionModal(q)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                            <button onClick={() => handleDeleteQuestion(idx)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {/* Question Add/Edit Modal */}
            {showQuestionModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg min-w-[350px]">
                  <h2 className="text-xl font-bold mb-4">{editQuestion ? 'Edit Question' : 'Add Question'}</h2>
                  <form onSubmit={handleQuestionFormSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="questions"
                      value={questionForm.questions}
                      onChange={handleQuestionFormChange}
                      placeholder="Question text"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                    {[0,1,2,3].map(idx => (
                      <input
                        key={idx}
                        type="text"
                        value={questionForm.options[idx]}
                        onChange={e => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx+1}`}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                        required
                      />
                    ))}
                    <input
                      type="text"
                      name="correctAnswer"
                      value={questionForm.correctAnswer}
                      onChange={handleQuestionFormChange}
                      placeholder="Correct Answer"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                    <input
                      type="text"
                      name="explanation"
                      value={questionForm.explanation}
                      onChange={handleQuestionFormChange}
                      placeholder="Explanation (optional)"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <div className="flex justify-end space-x-2 mt-6">
                      <button type="button" onClick={() => setShowQuestionModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editQuestion ? 'Update' : 'Add'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "Users/Results" && (
          <div>
            <h3 className="text-xl font-bold mb-4">User Results</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-gray-500 dark:text-gray-300">(User results and analytics coming soon...)</p>
            </div>
          </div>
        )}
        {activeTab === "Feedback" && (
          <div>
            <h3 className="text-xl font-bold mb-4">User Feedback</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
              {feedbacks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No feedback found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Subject</th>
                      <th className="py-2 px-4">Rating</th>
                      <th className="py-2 px-4">Feedback</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((f, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2 px-4">{f.name}</td>
                        <td className="py-2 px-4">{f.email}</td>
                        <td className="py-2 px-4">{f.subject}</td>
                        <td className="py-2 px-4">{f.rating}</td>
                        <td className="py-2 px-4">{f.feedback}</td>
                        <td className="py-2 px-4">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === "Contact" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Messages</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
              {contacts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No contact messages found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Subject</th>
                      <th className="py-2 px-4">Message</th>
                      <th className="py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2 px-4">{c.name}</td>
                        <td className="py-2 px-4">{c.email}</td>
                        <td className="py-2 px-4">{c.subject}</td>
                        <td className="py-2 px-4">{c.message}</td>
                        <td className="py-2 px-4">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === "Signup/Attempts" && (
          <div>
            <h3 className="text-xl font-bold mb-4">User Signup & Quiz Attempts</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No users found.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Is Admin</th>
                      <th className="py-2 px-4">Quiz Attempts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2 px-4 align-top">{u.name}</td>
                        <td className="py-2 px-4 align-top">{u.email}</td>
                        <td className="py-2 px-4 align-top">{u.isAdmin ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4">
                          {u.quizAttempted && u.quizAttempted.length > 0 ? (
                            <table className="w-full text-xs border">
                              <thead>
                                <tr>
                                  <th className="py-1 px-2">Quiz ID</th>
                                  <th className="py-1 px-2">Marks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {u.quizAttempted.map((a, i) => (
                                  <tr key={i} className="border-t">
                                    <td className="py-1 px-2">{a.quizId}</td>
                                    <td className="py-1 px-2">{Array.isArray(a.quizResult) ? a.quizResult.filter(x => x).length : ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <span>No attempts</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {activeTab === "Analytics" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Analytics</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <p className="text-gray-500 dark:text-gray-300">(Analytics dashboard coming soon...)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 