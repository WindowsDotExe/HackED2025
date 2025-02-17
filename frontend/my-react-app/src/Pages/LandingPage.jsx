"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaLightbulb, FaCogs, FaRocket, FaTrophy } from "react-icons/fa";
import "../Styles/LandingPage.css"

const LandingPage = () => {
  const [text, setText] = useState("")
  const fullText = "Hey, I'm Flux!"
  const [showContent, setShowContent] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    let currentIndex = 0
    const typewriterEffect = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typewriterEffect)
        setShowContent(true)
      }
    }, 150)

    return () => clearInterval(typewriterEffect)
  }, [])

  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        setShowFooter(true)
      }, 1500) // Match the delay of the button animation
    }
  }, [showContent])

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <div className="heading-container">
          <h1 className="typewriter-text heading-spacing">{text}</h1>
        </div>

        <div className="cards-grid row-grid">
          {showContent && (
            <>
              <div className="info-card square-card">
                <FaLightbulb className="card-icon" />
                <span>Building amazing experiences</span>
              </div>
              <div className="info-card square-card">
                <FaCogs className="card-icon" />
                <span>Creating innovative solutions</span>
              </div>
              <div className="info-card square-card">
                <FaRocket className="card-icon" />
                <span>Driving digital transformation</span>
              </div>
              <div className="info-card square-card">
                <FaTrophy className="card-icon" />
                <span>Delivering exceptional results</span>
              </div>
            </>
          )}
        </div>

        <Link to="/prompt" className="interview-button rounded-box">
          Let's Interview!
        </Link>
      </div>

      <footer className={`custom-footer ${showFooter ? "show" : ""}`}>
        <span className="star-icon">⭐ </span>
        <span className="footer-text">Designed & Developed by Sarvesh, Joshua, Matthew & Nuuradin</span>
      </footer>
    </div>
  )
}

export default LandingPage