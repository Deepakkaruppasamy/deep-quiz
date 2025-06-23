import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

export const Resultshow = () => {
  let [count, setCount] = useState(0);
  let [feedback, setFeedback] = useState("");
  const UserName = useSelector((state) => state.mernQuize.userName);
  const resultUser = useSelector((state) => state.mernQuize.result);
  const [showCertificate, setShowCertificate] = useState(false);

  let originalResult = [];
  const singleQuiz = useSelector((state) => state?.mernQuize.QuizData);
  const questionArr = singleQuiz[0]?.questionArray;

  const filterAtualAnswer = (el) => {
    if (!el) return;
    el.map((e) => {
      originalResult.push(e.correctAnswer);
    });
  };
  if (questionArr) {
  filterAtualAnswer(questionArr);
  }

  for (let i = 0; i < originalResult.length; i++) {
    for (let j = 0; j < (resultUser ? resultUser.length : 0); j++) {
      if (resultUser && resultUser[j] == originalResult[i]) {
        count++;
      }
    }
  }

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3755/certificate",
        {
          name: UserName,
          course: singleQuiz[0]?.title || "Quiz",
          date: new Date().toLocaleDateString(),
        },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "deepquiz.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download certificate");
    }
  };

  const addBadge = (badge) => {
    const badges = JSON.parse(localStorage.getItem('badges') || '[]');
    if (!badges.includes(badge)) {
      badges.push(badge);
      localStorage.setItem('badges', JSON.stringify(badges));
    }
  };

  const calcPercent = () => {
    const percentage = resultUser && resultUser.length > 0 ? Math.round((count / resultUser.length) * 100) : 0;
    if (percentage > 90) {
      setFeedback(`Congratulations! You cleared the Test! ${UserName}`);
      setShowCertificate(true);
      if ((singleQuiz[0]?.title || '').toLowerCase().includes('html')) addBadge('html');
    } else if (percentage > 50 && percentage < 90) {
      setFeedback(
        `Congratulations! You cleared the Test! and Keep Practicing ${UserName}`
      );
      setShowCertificate(true);
      if ((singleQuiz[0]?.title || '').toLowerCase().includes('html')) addBadge('html');
    } else {
      setFeedback(
        `Sorry!, You are failed to complete the Test! You need to Work Hard! and Keep Practicing  ${UserName}`
      );
      setShowCertificate(false);
    }
  };
  useEffect(() => {
    calcPercent();
  });
  return (
    <div className="w-11/12 shadow-2xl mx-auto mt-24">
      {questionArr && resultUser ? (
        <>
      <h1 className="mt-8 text-3xl text-sky-700 text-center">
        Result Analysis
      </h1>
      <div className="flex justify-center items-center -mt-24">
        <div className="w-2/5 ml-4 flex justify-center">
          <img src="./resultAnalysis.gif" alt="resultAnalysis" />
        </div>
        <div className="w-2/5 mt-24 p-8 text-center flex flex-col items-center">
          <h1 className="text-2xl text-red-600 mb-4">{feedback}</h1>
          <strong className="text-xl italic text-teal-600 mb-4">
            Total Marks : {count}/{questionArr.length}
          </strong>
          {showCertificate && (
            <button
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleDownloadCertificate}
            >
              Download Certificate
            </button>
          )}
        </div>
      </div>

      <div className=" absolute  bg-blue-300 rounded-2xl right-24 top-28 border-2 mb-8 p-2 pl-4  pr-4 ">
        <Link to="/">
          <button className="text-xl font-bold ">Attempt More Quiz</button>
        </Link>
      </div>
        </>
      ) : (
        <div className="text-center text-red-600 text-xl mt-20">Results not available. Please complete a quiz first.</div>
      )}
    </div>
  );
};
