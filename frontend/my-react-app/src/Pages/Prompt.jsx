"use client"
import "../Styles/Prompt.css"
import { useState } from "react"
import { FiCheck } from "react-icons/fi"

const Prompt = () => {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!prompt.trim()) return
    setLoading(true)

    // Simulate a short delay before navigating
    setTimeout(() => {
      window.location.href = "/chatbot"  // Redirect after animation
    }, 2000)  // Adjust delay time as needed
  }

  return (
    <div className="prompt-container">
      <div className="moving-background"></div>

      {/* Heading with transition effect */}
      <h1 className="prompt-heading">Enter Prompt</h1>

      {/* Large Search Bar Styled Input */}
      <input
        type="text"
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
        disabled={loading} // Disable input when loading
      />

      {/* Submit Button or Loading Animation */}
      {!loading ? (
        <button
          className={`prompt-submit ${!prompt.trim() ? "disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!prompt.trim()}
        >
          <FiCheck /> Submit 
        </button>
      ) : (
        <div className="loading-section">
          <span className="loading-text">Building your questions</span>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Prompt
