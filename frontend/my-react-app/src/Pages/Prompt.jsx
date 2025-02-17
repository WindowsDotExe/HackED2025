"use client"
import "../Styles/Prompt.css"
import { useState } from "react"
import { FiCheck } from "react-icons/fi"
import { useEffect } from "react";

const BACKEND_URL = "https://hacked2025-backend.onrender.com";

const Prompt = () => {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("interviewResponses", JSON.stringify([]));
    localStorage.setItem("interviewFeedback", JSON.stringify([]))
    localStorage.setItem("interviewQuestions", JSON.stringify([]))
    localStorage.setItem("role", JSON.stringify([]))
  }, [])

  const handleSubmit = async () => {
    const role = prompt.trim();
    if (!role){
        return;
    } 
    setLoading(true)

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/generate-questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role })
        });
        const data = await response.json();
        // console.log(data.feedback);
        // console.log(data.response);
        setQuestions(data.response);
        localStorage.setItem("interviewQuestions", JSON.stringify(data.response)); // ✅ Store in localStorage
        localStorage.setItem("role", JSON.stringify(role));
        setCurrentIndex(0);
    } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions(["Error loading questions. Try again."]);
    }

    // Simulate a short delay before navigating
    setTimeout(() => {
      window.location.href = "/chatbot"  // Redirect after animation
    }, 2000)  // Adjust delay time as needed
  }

  return (
    <div className="prompt-container">
      <div className="moving-background"></div>

      {/* Heading with transition effect */}
      <h1 className="prompt-heading">What are you interviewing for?</h1>

      {/* Large Search Bar Styled Input */}
      <input
        type="text"
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="I would like to interview for..."
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
