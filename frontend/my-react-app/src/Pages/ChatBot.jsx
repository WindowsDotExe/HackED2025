"use client"
import "../Styles/ChatBot.css"

import React, { useState, useEffect, useRef } from "react"
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = "https://hacked2025-backend.onrender.com"
let mediaRecorder;
let audioChunks;

const ChatBot = () => {
  const [userInput, setUserInput] = useState("")
  const [displayedQuestion, setDisplayedQuestion] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRecordedOnce, setHasRecordedOnce] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // New loading state
  const textareaRef = useRef(null)

  useEffect(() => {
    // fetchQuestions();
    localStorage.setItem("interviewResponses", JSON.stringify([]));
    localStorage.setItem("interviewFeedback", JSON.stringify([]))
    fetchNextQuestion();
  }, [])

//   async function fetchQuestions(role) {
//     // Check if questions already exist in localStorage
//     const storedQuestions = localStorage.getItem("interviewQuestions");
//     if (storedQuestions) {
//         setQuestions(JSON.parse(storedQuestions));
//         setCurrentIndex(0); // Start from the first question
//         return;
//     }

//     try {
//         const response = await fetch(`${BACKEND_URL}/v1/generate-questions`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ role })
//         });

//         const data = await response.json();
//         setQuestions(data.questions);
//         localStorage.setItem("interviewQuestions", JSON.stringify(data.questions)); // ✅ Store in localStorage
//         setCurrentIndex(0);
//     } catch (error) {
//         console.error("Error fetching questions:", error);
//         setQuestions(["Error loading questions. Try again."]);
//     }
// }

  const fetchNextQuestion = async () => {
    const interviewQuestions = JSON.parse(localStorage.getItem("interviewQuestions"));

    const newQuestion = interviewQuestions[currentIndex];
    if (currentIndex > 4) {
      window.location.href = "/feedback" 
      return;
    }
    setCurrentIndex(currentIndex+1);
    setIsLoading(false) // Stop loading animation
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

  const submitAnswer = async () => {
    const interviewQuestions = JSON.parse(localStorage.getItem("interviewQuestions"));
    if (!userInput.trim()) {
      alert("Please type your answer first!")
      return
    }
    console.log(localStorage.getItem("interviewResponses"));
    const interviewResponses = JSON.parse(localStorage.getItem("interviewResponses"));
    localStorage.setItem("interviewResponses", JSON.stringify([...interviewResponses, userInput.trim()]));
    const role = localStorage.getItem("role");
    console.log(localStorage.getItem("interviewResponses"));
    const responseFeedback = await fetch(`${BACKEND_URL}/api/v1/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({answer: userInput.trim(), interview_qn: interviewQuestions[currentIndex-1], interview_type: role})
    })

    const data = await responseFeedback.json();
    
    const interviewFeedback = JSON.parse(localStorage.getItem("interviewFeedback"));
    localStorage.setItem("interviewFeedback", JSON.stringify([...interviewFeedback, data.feedback]));
    setIsSubmitted(true)
    setIsLoading(true) // Start loading animation

    setTimeout(() => {
      fetchNextQuestion()
    }, 1500) // Simulate loading time before next question
  }

  const toggleRecording = async () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      setIsRecording(true)
      audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.start();
      setHasRecordedOnce(true)
    } else {
      setIsRecording(false)
      mediaRecorder.stop()
      // console.log('AFTER RECORDING')
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // const formData = new FormData();
        // generate a random filename
        let filename = uuidv4() + ".wav";
        console.log(filename)
        var FilePath = "uploads/" + filename
        // formData.append("audio", audioBlob, filename);

        const {data, error} = await supabase
        .storage
        .from('user_audio_recordings')
        .upload(FilePath, audioBlob)

        if (error != null){
          console.log("BRUHH")
        }
        // console.log('BEFORE API CALL')
        const response = await fetch(`${BACKEND_URL}/api/v1/transcribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filePath: FilePath
          }),
        });        
        // console.log('AFTER API CALL')
        const result = await response.json()
        setUserInput(result.text);
    }
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