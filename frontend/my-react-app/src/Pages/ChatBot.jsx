"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"

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
    setAiQuestion("Tell me about a time when you solved a difficult problem.")
    setUserInput("")
    setFeedback("")
    setShowNextButton(false)
    setIsSubmitted(false)

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
    }
  }

  const submitAnswer = () => {
    if (userInput.trim()) {
      setFeedback(
        "Your response demonstrates problem-solving skills and initiative. Consider providing more specific details about the steps you took to solve the problem and the outcome of your actions."
      )
      setShowNextButton(true)
      setIsSubmitted(true)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Add your speech-to-text logic here
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