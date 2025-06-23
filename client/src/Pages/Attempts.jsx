import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Attempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Admin-only protection
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/login");
      return;
    }
    axios.get("http://localhost:3755/getuser")
      .then(res => {
        // Flatten all attempts for all users
        const allAttempts = [];
        res.data.forEach(user => {
          (user.quizAttempted || []).forEach(attempt => {
            allAttempts.push({
              user: user.name,
              email: user.email,
              quizId: attempt.quizId,
              quizResult: attempt.quizResult,
              date: attempt.date || user.createdAt || "",
            });
          });
        });
        setAttempts(allAttempts);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">User Quiz Attempts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : attempts.length === 0 ? (
        <p>No attempts found.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">User</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Quiz ID</th>
              <th className="py-2 px-4">Marks</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 px-4">{a.user}</td>
                <td className="py-2 px-4">{a.email}</td>
                <td className="py-2 px-4">{a.quizId}</td>
                <td className="py-2 px-4">{Array.isArray(a.quizResult) ? a.quizResult.filter(x => x).length : ''}</td>
                <td className="py-2 px-4">{a.date ? new Date(a.date).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 