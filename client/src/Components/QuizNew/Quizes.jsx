import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getQuiz } from "../../Redux/action.js";
import { Quiz } from "./Quiz";

export const Quizes = () => {
  const singleQuiz = useSelector((state) => state?.mernQuize.QuizData);
  const params = useParams();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getQuiz(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (singleQuiz && singleQuiz.length > 0) {
      setLoading(false);
    }
  }, [singleQuiz]);

  if (isLoading || !singleQuiz || singleQuiz.length === 0) {
    return (
      <div>
        <iframe
          title="loading"
          className="w-4/5 h-96 ml-40"
        
        ></iframe>
      </div>
    );
  }

  const questionArr = singleQuiz[0]?.questionArray;

  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };

  return <Quiz questionArr={questionArr} />;
};
