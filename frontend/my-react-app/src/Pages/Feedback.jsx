"use client";

import React, { useState } from "react";
import "../Styles/Feedback.css";

const feedbackData = [];

const FeedbackCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedback = JSON.parse(localStorage.getItem("interviewFeedback"));
  const questions = JSON.parse(localStorage.getItem("interviewQuestions"))
  const responses = JSON.parse(localStorage.getItem("interviewResponses"))

  // run a for loop to create the feedbackData array from the questions, responses, and feedback
  for (let i = 0; i < questions.length; i++) {
    feedbackData.push({
      id: i,
      question: questions[i],
      response: responses[i],
      feedback: feedback[i],
    });
  }
  const length = feedbackData.length;

  const handleCardClick = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  return (
    <div className="carousel-background">
      <h1 className="carousel-heading">So, how did you do?</h1>

      <div className="carousel-wrapper">
        {feedbackData.map((item, index) => {
          let position = (index - currentIndex + length) % length;

          return (
            <div
              key={item.id}
              className={`carousel-card ${
                position === 0
                  ? "center-card"
                  : position === 1
                  ? "right-card"
                  : position === length - 1
                  ? "left-card"
                  : "hidden-card"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <h2 className="center-align">{item.question}</h2>

              <strong className="left-align">Your Response:</strong>
              <div className="response-container">
                <p>{item.response}</p>
              </div>

              <strong className="left-align">Flux Feedback:</strong>
              <div className="feedback-container">
                <p>{item.feedback}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackCarousel;
