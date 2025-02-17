"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiHome, FiSend } from "react-icons/fi"; 
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
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate(); 

  const handleCardClick = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const openEmailPopup = () => setShowEmailPopup(true);

  const handleSendEmail = () => {
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setEmailSent(true);

      setTimeout(() => {
        setShowEmailPopup(false);
        setEmailSent(false);
        setEmail("");
        navigate("/Prompt");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="carousel-background">
      <h1 className="carousel-heading">So, how did you do?</h1>

      <div className="carousel-wrapper">
        {feedbackData.map((item, index) => {
          let position = (index - currentIndex + feedbackData.length) % feedbackData.length;

          return (
            <div
              key={item.id}
              className={`carousel-card ${
                position === 0
                  ? "center-card"
                  : position === 1
                  ? "right-card"
                  : position === feedbackData.length - 1
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

      {/* Buttons */}
      <div className="button-container">
        <button className="email-button" onClick={openEmailPopup}>
          <FiMail /> Email Feedback
        </button>
        <button className="home-button" onClick={() => navigate("/Prompt")}>
          <FiHome /> Home
        </button>
      </div>

      {/* Blurred Background (Only When Popup is Open) */}
      {showEmailPopup && <div className="background-blur"></div>}

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="email-popup">
          <h2>Send Feedback via Email</h2>
          {!emailSent ? (
            <div className="email-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSendEmail} disabled={sending}>
                {sending ? "Sending..." : <FiSend />}
              </button>
            </div>
          ) : (
            <p className="email-sent-text">✅ Email sent successfully!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackCarousel;
