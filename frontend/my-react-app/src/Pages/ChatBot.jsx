"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"

const BACKEND_URL = "http://localhost:8000"
let mediaRecorder;
let audioChunks;

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [aiQuestion, setAiQuestion] = useState("")
  const [feedback, setFeedback] = useState("")
  const [showNextButton, setShowNextButton] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchNextQuestion()
  }, [])

  const fetchNextQuestion = async () => {
    // change the type of question in the url once retreived
    const response = await fetch(`${BACKEND_URL}/api/v1/question`)
    // const response = await fetch("/api/v1/question?type=general")
    // console.log(response)
    const data = await response.json()
    // console.log(data.question)
    setAiQuestion(data.question || "No question found.");
    setUserInput("")
    setFeedback("")
    setShowNextButton(false)
    setIsSubmitted(false)

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
    }
  }

  const submitAnswer = async () => {
    if (userInput.trim()) {
      const response = await fetch(`${BACKEND_URL}/api/v1/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: userInput, interview_qn: aiQuestion, interview_type: "general" }),
      })

      const data = await response.json()
      
      setFeedback(
        data.feedback
      )
      setShowNextButton(true)
      setIsSubmitted(true)
    }
  }

  const toggleRecording = async () => {
    
    setIsRecording(!isRecording)
    // console.log(isRecording)
    // Add your speech-to-text logic here
    if (!isRecording) {
      audioChunks = [];
      // console.log('BEFORE RECORDING')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.start();
    }
    else{
      mediaRecorder.stop()
      // console.log('AFTER RECORDING')
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.wav");

        // console.log('BEFORE API CALL')
        const response = await fetch(`${BACKEND_URL}/api/v1/transcribe`, {
          method: "POST",
          body: formData,
        });
        // console.log('AFTER API CALL')
        
        const result = await response.json()
        setUserInput(result.text);
    }
  }
}

  return (
    <div className="chat-container">
      <div className="moving-background"></div>
      <div className="chat-box ai-box">
        <h2>AI Interviewer</h2>
        <div className="text-content">{aiQuestion}</div>
      </div>
      <div className="chat-box user-box">
        <h2>Your Response</h2>
        <textarea
          className={`answer-bubble ${isSubmitted ? "locked" : ""}`}
          ref={textareaRef}
          value={userInput}
          onChange={(e) => !isSubmitted && setUserInput(e.target.value)}
          placeholder="Your answer will appear here..."
          disabled={isSubmitted}
        />
        <div className="button-container">
          <button className="submit-button" onClick={submitAnswer} disabled={isSubmitted}>
            Submit
          </button>
          <button className="record-button" onClick={toggleRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
        {feedback && (
          <div className="feedback-container">
            <h3 className="feedback-heading">Feedback</h3>
            <div className="feedback-box">
              <p>{feedback}</p>
            </div>
          </div>
        )}
      </div>
      <button className={`next-question-button ${showNextButton ? "show" : ""}`} onClick={fetchNextQuestion}>
        Next Question
      </button>
    </div>
  )
}

export default ChatBot