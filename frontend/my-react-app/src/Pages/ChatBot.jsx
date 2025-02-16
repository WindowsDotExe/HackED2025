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

    // Reset the textarea height to minimal
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
    }
  }

  const submitAnswer = () => {
    if (!userInput.trim()) {
      alert("Please type your answer first!")
      return
    }

    setFeedback(
      "Your response demonstrates problem-solving skills and initiative. " +
        "Consider providing more specific details about the steps you took..."
    )
    setShowNextButton(true)
    setIsSubmitted(true)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Add your speech-to-text logic here if needed
  }

  const handleTextareaChange = (e) => {
    // Only allow changes if not submitted
    if (!isSubmitted) {
      setUserInput(e.target.value)
      // Auto-resize logic up to 200px
      const target = e.target
      target.style.height = "auto"
      const newHeight = Math.min(target.scrollHeight, 200)
      target.style.height = `${newHeight}px`
    }
  }

  return (
    <div className="chat-container">
      <div className="moving-background"></div>

      {/* Smaller AI Box */}
      <div className="chat-box ai-box">
        <div className="text-content">{aiQuestion}</div>
      </div>

      {/* Larger User Box */}
      <div className="chat-box user-box">
        <textarea
          className={`answer-bubble ${isSubmitted ? "locked" : ""}`}
          ref={textareaRef}
          value={userInput}
          onChange={handleTextareaChange}
          placeholder="Your answer will appear here..."
          disabled={isSubmitted}
        />

        {/* Hide buttons once submitted */}
        {!isSubmitted && (
          <div className="button-container">
            <button
              className="submit-button"
              onClick={submitAnswer}
              disabled={isSubmitted}
            >
              Submit
            </button>
            <button className="record-button" onClick={toggleRecording}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        )}

        {feedback && (
          <div className="feedback-container">
            <h3 className="feedback-heading">Feedback</h3>
            <div className="feedback-box">
              <p>{feedback}</p>
            </div>
          </div>
        )}

        {/* Next question button under feedback */}
        {showNextButton && (
          <div className="next-question-container">
            <button
              className="next-question-button"
              onClick={fetchNextQuestion}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBot

