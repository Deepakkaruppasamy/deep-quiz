import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizDataFrombackend } from "../Redux/action.js";
import { Quiz } from "../Components/QuizNew/Quiz";

export const NewQuizPage = () => {
  const data = useSelector((state) => state.mernQuize.QuizData);
  const [count, setCount] = useState(0);
  const [clickoption, setClickOption] = useState(false);
  const [timerPerQuestion, setTimerPerQuestion] = useState(60); // default 60s
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswer = (index, e, el) => {
    if (clickoption == false) {
      if (el.answer[0][index] === el.correctAnswer) {
        setCount(count + 1);
      }
    }
  };

  // ------taking path from window object and compairing with the backend data

  const pathname = window.location.pathname
    .split("")
    .splice(1, window.location.pathname.length)
    .join("");

  const filtertopicwise = data.filter((el) => {
    return pathname === el.title;
  });

  const newfilterquestions = filtertopicwise[0]?.questions;
  const dispatch = useDispatch();

  const fetchQuizData = () => {
    dispatch(fetchQuizDataFrombackend());
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handlecount = (index) => {
    setClickOption(true);
  };

  return (
    <div className="">
      {/* Timer selection modal */}
      {!quizStarted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Select Time Per Question</h2>
            <div className="flex space-x-4 mb-6">
              {[30, 60, 90].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTimerPerQuestion(sec)}
                  className={`px-6 py-2 rounded-lg font-semibold border-2 transition-colors duration-200 ${timerPerQuestion === sec ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                >
                  {sec} seconds
                </button>
              ))}
            </div>
            <button
              onClick={() => setQuizStarted(true)}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
      <div className="border-teal-500 absolute  right-24 top-24 border-2 mb-8 p-1 pl-2  pr-2 ">
        <h1 className="text-xl font-bold">Count:{count}</h1>
      </div>
      <div className="mt-20">
        {newfilterquestions?.map((el, index) => {
          return (
            <div>
              <div className="flex  w-12/12  pl-1 pt-2 pb-2 mt-2   mr-4">
                <div className="border-red-700 w-11/12 border-grey-200 border-2 pl-1 ml-24 ">
                  <div className="flex w-11/12">
                    <div className="w-40">
                      <p className="text-xl font-normal  pl-1">
                        Question {index + 1})
                      </p>
                    </div>
                    <div className="w-10/12 -ml-10">
                      <p className="text-xl font-normal  ">{el.que}</p>
                    </div>
                  </div>
                  {el?.answer[0]?.map((e, index) => {
                    return (
                      <div className="flex ml-32">
                        <p className="mr-2">{index + 1})</p>
                        <div
                          className="cursor-pointer hoverOption"
                          onClick={() => handleAnswer(index, e, el)}
                        >
                          <li className="text-xl li-option-tag">{e}</li>
                          {/* onClick={()=>{handlecount(index)}} */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {quizStarted && (
        <Quiz questionArr={newfilterquestions} timerPerQuestion={timerPerQuestion} />
      )}
    </div>
  );
};
