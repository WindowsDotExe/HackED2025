"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiHome, FiSend, FiRotateCcw, FiX, FiMessageCircle } from "react-icons/fi"; 
import "../Styles/Feedback.css";

const BACKEND_URL = "https://hacked2025-backend.onrender.com";

const FeedbackCarousel = () => {
  const feedbackData = [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const feedback = JSON.parse(localStorage.getItem("interviewFeedback"));
  const questions = JSON.parse(localStorage.getItem("interviewQuestions"))
  const responses = JSON.parse(localStorage.getItem("interviewResponses"))

  useEffect(() => {
    // delayed popup
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate(); 

  const handleCardClick = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const openEmailPopup = () => setShowEmailPopup(true);
  const closeEmailPopup = () => {
    setShowEmailPopup(false);
    setEmailSent(false);
    setEmail("");
  };


  const handleSendEmail = async () => {
    setSending(true);

    const interviewQuestions = JSON.parse(localStorage.getItem("interviewQuestions"));
    const interviewResponses = JSON.parse(localStorage.getItem("interviewResponses"));
    const interviewFeedback = JSON.parse(localStorage.getItem("interviewFeedback"));
    

    await fetch(`${BACKEND_URL}/api/v1/email-feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, interviewQuestions, interviewResponses, interviewFeedback }),
    });


    setTimeout(() => {
      setSending(false);
      setEmailSent(true);

      setTimeout(() => {
        setShowEmailPopup(false);
        setEmailSent(false);
        setEmail("");
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
        <button className="home-button" onClick={() => navigate("/")}>
          <FiHome /> Home
        </button>
        <button className="onemore-button" onClick={() => navigate("/Prompt")}>
          <FiRotateCcw /> Another One?
        </button>
      </div>
  
      {/* Blurred Background (Only When Popup is Open) */}
      {showEmailPopup && <div className="background-blur"></div>}
  
      {/* Email Popup */}
      {showEmailPopup && (
        <div className="email-popup">
          <FiX className="close-icon" onClick={closeEmailPopup} />
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
            <p className="email-sent-text">Email sent successfully!</p>
          )}
        </div>
      )}
  
      {/* Feedback Form Popup Bubble */}
      {showFeedbackPopup && (
        <div className="feedback-popup" onClick={() => window.open("https://tally.so/r/npk4LV", "_blank")}>
          <FiMessageCircle className="feedback-icon" />
          <span>Give Feedback</span>
        </div>
      )}
    </div>
  );
}

export default FeedbackCarousel;
