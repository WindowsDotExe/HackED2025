"use client";

import "../Styles/ChatBot.css";
import React, { useState, useEffect, useRef } from "react";
import { FiCircle, FiSquare, FiRotateCcw, FiCheck } from "react-icons/fi";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const fetchNextQuestion = async () => {
    setIsLoading(false);
    const newQuestion = "Tell me about a time when you solved a difficult problem.";
    setDisplayedQuestion("");
    setIsTyping(true);
    setUserInput("");
    setIsSubmitted(false);
    setHasRecordedOnce(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px";
    }

    let index = 0;
    const typeWriter = setInterval(() => {
      setDisplayedQuestion((prev) => {
        if (index >= newQuestion.length) {
          clearInterval(typeWriter);
          setIsTyping(false);
          return newQuestion;
        }
        return newQuestion.substring(0, index + 1);
      });
      index++;
    }, 20);
  };

  const submitAnswer = () => {
    if (!userInput.trim()) {
      alert("Please type your answer first!");
      return;
    }

    setIsSubmitted(true);
    setIsLoading(true);

    setTimeout(() => {
      fetchNextQuestion();
    }, 1500);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setHasRecordedOnce(true);
    } else {
      setIsRecording(false);
    }
  };

  const handleTextareaChange = (e) => {
    if (!isSubmitted) {
      setUserInput(e.target.value);
      const target = e.target;
      target.style.height = "auto";
      const newHeight = Math.min(target.scrollHeight, 200);
      target.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="chat-container">
      <div className="moving-background"></div>
      
      <div className="ai-box">
        <div className="text-content">
          {displayedQuestion}
          {isTyping && <span className="cursor">|</span>}
        </div>
      </div>
      
      <textarea
        className={`answer-bubble ${isSubmitted ? "locked" : ""}`}
        ref={textareaRef}
        value={userInput}
        onChange={handleTextareaChange}
        placeholder="Type or speak to answer."
        disabled={isSubmitted}
      />
      
      {!isSubmitted && !isLoading && (
        <div className="button-container">
          <button className="submit-button" onClick={submitAnswer}>
            <FiCheck /> Submit
          </button>
          <button
            className={`record-button ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
          >
            {isRecording 
              ? <><FiSquare /> Stop Recording</>
              : hasRecordedOnce 
                ? <><FiRotateCcw /> Record Again</>
                : <><FiCircle /> Start Recording</>}
          </button>
        </div>
      )}
      
      {isLoading && (
        <div className="loading-animation">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
