import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your quizzes, scores, badges, or the platform." }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    try {
      const res = await axios.post("http://localhost:3755/chatbot", { question: userMsg.text });
      setMessages((msgs) => [...msgs, { from: "bot", text: res.data.answer }]);
    } catch {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Sorry, I couldn't get an answer right now." }]);
    }
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
        {open && (
          <div className="bg-white shadow-xl rounded-lg w-80 h-96 flex flex-col border border-gray-200">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-bold">QuizBot</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={msg.from === "bot" ? "text-left" : "text-right"}>
                  <span className={msg.from === "bot" ? "bg-blue-100 text-blue-800 px-3 py-1 rounded-lg inline-block" : "bg-green-100 text-green-800 px-3 py-1 rounded-lg inline-block"}>
                    {msg.text}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex p-2 border-t">
              <input
                className="flex-1 border rounded-l px-2 py-1 focus:outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
              />
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-r">Send</button>
            </form>
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none"
          aria-label="Open chatbot"
        >
          💬
        </button>
      </div>
    </>
  );
};

export default ChatbotWidget; 