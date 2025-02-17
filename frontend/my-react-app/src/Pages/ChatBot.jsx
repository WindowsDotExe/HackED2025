"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { FiCircle, FiSquare, FiRotateCcw, FiCheck } from "react-icons/fi";
import ProgressBar from "./ProgressBar"; // Adjust the path if needed
import "../Styles/ChatBot.css";

const BACKEND_URL = "http://localhost:8000";
let mediaRecorder;
let audioChunks;

const ChatBot = () => {
  // Total number of questions is 5 (adjust if needed)
  const totalQuestions = 5;
  // currentIndex represents the index (starting at 0) of the current question
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [userInput, setUserInput] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // When the component mounts, initialize local storage and load the first question.
  useEffect(() => {
    localStorage.setItem("interviewResponses", JSON.stringify([]));
    localStorage.setItem("interviewFeedback", JSON.stringify([]));
    fetchQuestionForIndex(0);
  }, []);

  // Function to fetch and display a question given its index.
  const fetchQuestionForIndex = (index) => {
    const interviewQuestions = JSON.parse(localStorage.getItem("interviewQuestions"));

    if (!interviewQuestions || interviewQuestions.length === 0) {
      console.error("No interview questions found.");
      return;
    }

    // If we've answered all questions, redirect to feedback.
    if (index >= totalQuestions) {
      window.location.href = "/feedback";
      return;
    }

    const newQuestion = interviewQuestions[index];
    // Reset states for the new question
    setDisplayedQuestion("");
    setIsTyping(true);
    setUserInput("");
    setIsSubmitted(false);
    setHasRecordedOnce(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px";
    }

    // Typewriter effect: gradually display the question text
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i >= newQuestion.length) {
        clearInterval(typeWriter);
        setIsTyping(false);
        return;
      }
      setDisplayedQuestion(newQuestion.substring(0, i + 1));
      i++;
    }, 20);
  };

  const submitAnswer = async () => {
    setIsLoading(true);

    const interviewQuestions = JSON.parse(localStorage.getItem("interviewQuestions"));
    if (!userInput.trim()) {
      alert("Please type your answer first!");
      setIsLoading(false);
      return;
    }

    // Store the answer in local storage.
    const interviewResponses = JSON.parse(localStorage.getItem("interviewResponses"));
    localStorage.setItem(
      "interviewResponses",
      JSON.stringify([...interviewResponses, userInput.trim()])
    );

    const role = localStorage.getItem("role");

    // Send the answer to your backend
    const responseFeedback = await fetch(`${BACKEND_URL}/api/v1/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: userInput.trim(),
        interview_qn: interviewQuestions[currentIndex],
        interview_type: role,
      }),
    });

    const data = await responseFeedback.json();

    const interviewFeedback = JSON.parse(localStorage.getItem("interviewFeedback"));
    localStorage.setItem(
      "interviewFeedback",
      JSON.stringify([...interviewFeedback, data.feedback])
    );
    setIsSubmitted(true);

    // After a short delay, move to the next question.
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      fetchQuestionForIndex(nextIndex);
      setIsLoading(false);
    }, 1500);
  };

  const toggleRecording = async () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      setIsRecording(true);
      audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.start();
      setHasRecordedOnce(true);
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // Generate a random filename
        let filename = uuidv4() + ".wav";
        const FilePath = "uploads/" + filename;

        const { data, error } = await supabase.storage
          .from("user_audio_recordings")
          .upload(FilePath, audioBlob);

        if (error != null) {
          console.error("Error uploading file:", error);
        }

        const response = await fetch(`${BACKEND_URL}/api/v1/transcribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: FilePath,
          }),
        });

        const result = await response.json();
        setUserInput(result.text);
      };
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
      {/* Pass currentIndex + 1 so the progress bar is 1-indexed */}
      <ProgressBar total={totalQuestions} current={currentIndex + 1} />

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
            {isRecording ? (
              <>
                <FiSquare /> Stop Recording
              </>
            ) : hasRecordedOnce ? (
              <>
                <FiRotateCcw /> Record Again
              </>
            ) : (
              <>
                <FiCircle /> Start Recording
              </>
            )}
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
