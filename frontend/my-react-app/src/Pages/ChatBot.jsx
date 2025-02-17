"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [aiQuestion, setAiQuestion] = useState("")
  const [displayedQuestion, setDisplayedQuestion] = useState("") // For typewriter effect
  const [isTyping, setIsTyping] = useState(true) // Track if typing is still in progress
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchNextQuestion()
  }, [])

  const fetchNextQuestion = async () => {
    const newQuestion = "Tell me about a time when you solved a difficult problem."
    setAiQuestion(newQuestion)
    setDisplayedQuestion("")
    setIsTyping(true) // Start typing animation
    setUserInput("")
    setIsSubmitted(false)
    setHasRecordedOnce(false)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
    }

    // Run the typewriter effect
    let index = 0
    const typeWriter = setInterval(() => {
      setDisplayedQuestion((prev) => {
        if (index >= newQuestion.length) {
          clearInterval(typeWriter)
          setIsTyping(false) // Stop cursor blinking after typing is done
          return newQuestion
        }
        return newQuestion.substring(0, index + 1)
      })
      index++
    }, 25)
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
    }, 500)
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
          {isTyping && <span className="cursor">|</span>} {/* Cursor appears while typing */}
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
