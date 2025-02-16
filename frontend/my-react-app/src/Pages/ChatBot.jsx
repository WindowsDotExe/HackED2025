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
    // Simulated API response
    const mockResponse = { question: "Tell me about a time when you solved a difficult problem." };
  
    setAiQuestion(mockResponse.question);
    setUserInput("");
    setFeedback("");
    setShowNextButton(false);
  
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"; // Reset textarea to default size
    }
  };
  
  
  const submitAnswer = async () => {
    if (userInput.trim()) {
      // Simulated response from backend
      const mockResponse = { feedback: "Lorem Ipsum comes from sections 1.10.32 and 1.10.33 ofLorem Ipsum comes from sections 1.10.32 and 1.10.33 ofLorem Ipsum comes from sections 1.10.32 and 1.10.33 ofLorem Ipsum comes from sections 1.10.32 and 1.10.33 ofLorem Ipsum comes from sections 1.10.32 and 1.10.33 ofLorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." };
  
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
        <div className="feedback-container">
            <h3 className="feedback-heading">Feedback</h3>
            <div className="feedback-box">
            <p>{feedback}</p>
            </div>
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