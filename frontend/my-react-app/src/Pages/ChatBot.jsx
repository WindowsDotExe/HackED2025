"use client"

import { useState, useEffect, useRef } from "react"
import "../Styles/ChatBot.css"

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [aiQuestion, setAiQuestion] = useState("")
  const [feedback, setFeedback] = useState("")
  const [showNextButton, setShowNextButton] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchNextQuestion()
  }, [])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.min(textarea.scrollHeight, 400)
      textarea.style.height = `${newHeight}px`
    }
  }

  const handleUserInput = (e) => {
    setUserInput(e.target.value)
    adjustTextareaHeight()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitAnswer()
    }
  }

  const fetchNextQuestion = async () => {
    // Simulating API response
    const mockResponse = { question: "Tell me about a time when you solved a difficult problem." };
  
    setAiQuestion(mockResponse.question);
    setUserInput("");
    setFeedback("");
    setShowNextButton(false);
    adjustTextareaHeight();
  };
  
  const submitAnswer = async () => {
    if (userInput.trim()) {
      // Simulated response from backend
      const mockResponse = { feedback: "Great response! Try to be more specific about your role." };
  
      setFeedback(mockResponse.feedback);
      setShowNextButton(true);
    }
  };
  

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
          ref={textareaRef}
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here and press Enter to submit..."
          rows={1}
        />
        {feedback && (
          <div className="feedback-box">
            <h3>Feedback</h3>
            <p>{feedback}</p>
          </div>
        )}
        {showNextButton && (
          <button className="next-question-button" onClick={fetchNextQuestion}>
            Next Question
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatBot