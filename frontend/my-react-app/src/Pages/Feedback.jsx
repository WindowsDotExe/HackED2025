"use client";

import React, { useState } from "react";
import "../Styles/Feedback.css";

const feedbackData = [
  { id: 1, question: "What is React?", response: "A JS library for building UIs.", feedback: "Detailed feedback for question 1." },
  { id: 2, question: "What is State in React?", response: "State allows React components to change over time.", feedback: "Detailed feedback for question 2." },
  { id: 3, question: "What are Props?", response: "Props are inputs passed from parent to child.", feedback: "Detailed feedback for question 3." },
  { id: 4, question: "What is JSX?", response: "A syntax extension that looks like HTML in JS.", feedback: "Detailed feedback for question 4." },
  { id: 5, question: "What is a Component?", response: "Reusable pieces of UI in a React app.", feedback: "Detailed feedback for question 5." },
];

const FeedbackCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
              <h2>{item.question}</h2>

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
