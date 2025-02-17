"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [aiQuestion, setAiQuestion] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false) // Track if recording has been done once
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchNextQuestion()
  }, [])

  const fetchNextQuestion = async () => {
    setAiQuestion("Tell me about a time when you solved a difficult problem.")
    setUserInput("")
    setIsSubmitted(false)
    setHasRecordedOnce(false) // Reset recording state for the new question

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

    setIsSubmitted(true)

    // Move to the next question automatically
    setTimeout(() => {
      fetchNextQuestion()
    }, 500) // Small delay for better user experience
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setHasRecordedOnce(true) // Set flag that recording has happened
    } else {
      setIsRecording(false)
    }
    // Add your speech-to-text logic here if needed
  }

  const handleTextareaChange = (e) => {
    if (!isSubmitted) {
      setUserInput(e.target.value)
      const target = e.target
      target.style.height = "auto"
      const newHeight = Math.min(target.scrollHeight, 200)
      target.style.height = `${newHeight}px`
    }
  }

  return (
    <div className="chat-container">
      <div className="moving-background"></div>

      {/* AI Question Text */}
      <div className="ai-box">
        <div className="text-content">{aiQuestion}</div>
      </div>

      {/* Text Input */}
      <textarea
        className={`answer-bubble ${isSubmitted ? "locked" : ""}`}
        ref={textareaRef}
        value={userInput}
        onChange={handleTextareaChange}
        placeholder="Type or speak to answer."
        disabled={isSubmitted}
      />

      {/* Buttons */}
      {!isSubmitted && (
        <div className="button-container">
          <button className="submit-button" onClick={submitAnswer}>
            Submit
          </button>
          <button className="record-button" onClick={toggleRecording}>
            {isRecording 
              ? "Stop Recording" 
              : hasRecordedOnce 
                ? "Record Again" 
                : "Start Recording"}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatBot
