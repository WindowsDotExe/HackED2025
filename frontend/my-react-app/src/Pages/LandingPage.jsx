"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLightbulb, FaCogs, FaRocket, FaTrophy } from "react-icons/fa";
import "../Styles/LandingPage.css";

// import { use } from "react";

const BACKEND_URL = "http://localhost:8000";

const highlightFlux = (typedText, fluxGlowing) => {
  // Find the first occurrence of "Flux"
  const index = typedText.indexOf("Flux");
  // If "Flux" isn't in the typed text yet, return as-is
  if (index === -1) return typedText;

  // Split into: before "Flux", "Flux", and after
  const before = typedText.slice(0, index);
  const flux = typedText.slice(index, index + 4); // 'Flux'
  const after = typedText.slice(index + 4);

  // Wrap only 'Flux' in a span whose class can glow
  return (
    <>
      {before}
      <span className={`flux-text ${fluxGlowing ? "glowing" : ""}`}>
        {flux}
      </span>
      {after}
    </>
  );
};

const LandingPage = () => {
  const [text, setText] = useState("");
  const fullText = "Hey, I'm Flux";
  const [showContent, setShowContent] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [fluxGlowing, setFluxGlowing] = useState(false);

  useEffect(() => {
    localStorage.setItem("interviewResponses", JSON.stringify([]));
    localStorage.setItem("interviewFeedback", JSON.stringify([]))
    localStorage.setItem("interviewQuestions", JSON.stringify([]))
    localStorage.setItem("role", JSON.stringify([]))
    let currentIndex = 0;
    const typewriterEffect = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterEffect);
        // After typing is done, wait half a sec, then start glowing
        setTimeout(() => {
          setFluxGlowing(true);
          setShowContent(true);
        }, 500);
      }
    }, 100);

    return () => clearInterval(typewriterEffect);
  }, []);

  useEffect(() => {
    if (showContent) {
      // Fade in the footer a bit later
      setTimeout(() => {
        setShowFooter(true);
      }, 1500);
    }
  }, [showContent]);

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <div className="heading-container">
          <h1 className="typewriter-text heading-spacing">
            {/* 
              Highlight "Flux" only if it exists in 'text', 
              otherwise just show typed text.
            */}
            {highlightFlux(text, fluxGlowing)}
          </h1>
        </div>

        <div className="cards-grid row-grid">
          {showContent && (
            <>
              <div className="info-card square-card">
                <FaLightbulb className="card-icon" />
                <span>Master your interview with AI-driven coaching</span>
              </div>
              <div className="info-card square-card">
                <FaCogs className="card-icon" />
                <span>Personalized feedback to sharpen your answers</span>
              </div>
              <div className="info-card square-card">
                <FaRocket className="card-icon" />
                <span>Boost your confidence with mock interviews</span>
              </div>
              <div className="info-card square-card">
                <FaTrophy className="card-icon" />
                <span>Land your dream job with expert AI guidance</span>
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
        <span className="footer-text">
          Designed & Developed by Sarvesh, Joshua, Matthew & Nuuradin
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
