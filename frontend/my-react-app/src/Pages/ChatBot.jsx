"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [displayedQuestion, setDisplayedQuestion] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // New loading state
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchNextQuestion()
  }, [])

  const fetchNextQuestion = async () => {
    setIsLoading(false) // Stop loading animation
    const newQuestion = "Tell me about a time when you solved a difficult problem."
    setDisplayedQuestion("")
    setIsTyping(true)
    setUserInput("")
    setIsSubmitted(false)
    setHasRecordedOnce(false)

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
    }

    let index = 0
    const typeWriter = setInterval(() => {
      setDisplayedQuestion((prev) => {
        if (index >= newQuestion.length) {
          clearInterval(typeWriter)
          setIsTyping(false)
          return newQuestion
        }
        return newQuestion.substring(0, index + 1)
      })
      index++
    }, 20)
  }

  const submitAnswer = () => {
    if (!userInput.trim()) {
      alert("Please type your answer first!")
      return
    }

    setIsSubmitted(true)
    setIsLoading(true) // Start loading animation

    setTimeout(() => {
      fetchNextQuestion()
    }, 1500) // Simulate loading time before next question
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      setHasRecordedOnce(true)
    } else {
      setIsRecording(false)
    }
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

      {/* AI Question Text with Typewriter Effect & Blinking Cursor */}
      <div className="ai-box">
        <div className="text-content">
          {displayedQuestion}
          {isTyping && <span className="cursor">|</span>}
        </div>
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

      {/* Buttons or Loading Animation */}
      {!isSubmitted && !isLoading && (
        <div className="button-container">
          <button className="button-30 submit-button" onClick={submitAnswer}>
            Submit
          </button>
          <button
            className={`button-30 record-button ${isRecording ? "recording" : ""}`}
            onClick={toggleRecording}
          >
            {isRecording 
              ? "Stop Recording" 
              : hasRecordedOnce 
                ? "Record Again" 
                : "Start Recording"}
          </button>
        </div>
      )}

      {/* Loading Animation when transitioning to the next question */}
      {isLoading && (
        <div className="loading-animation">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}
    </div>
  )
}

export default ChatBot
