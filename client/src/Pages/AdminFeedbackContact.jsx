import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedbackContact = () => {
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3755/contact/all").then(res => setContacts(res.data));
    axios.get("http://localhost:3755/feedback/all").then(res => setFeedbacks(res.data));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">All Contact Messages</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td className="border px-4 py-2">{c.name}</td>
                <td className="border px-4 py-2">{c.email}</td>
                <td className="border px-4 py-2">{c.subject}</td>
                <td className="border px-4 py-2">{c.message}</td>
                <td className="border px-4 py-2">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Feedback</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Rating</th>
              <th className="border px-4 py-2">Feedback</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f._id}>
                <td className="border px-4 py-2">{f.name}</td>
                <td className="border px-4 py-2">{f.email}</td>
                <td className="border px-4 py-2">{f.subject}</td>
                <td className="border px-4 py-2">{f.rating}</td>
                <td className="border px-4 py-2">{f.feedback}</td>
                <td className="border px-4 py-2">{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFeedbackContact; 