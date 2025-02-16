import "../Styles/ChatBot.css";
import React, { useState, useEffect } from 'react';

export default function ChatBot() {
    const [messages, setMessages] = useState([]); // Stores chat history
    const [input, setInput] = useState(""); // Stores user input
    const [interviewQuestion, setInterviewQuestion] = useState("Loading question...");
    const [interviewType, setInterviewType] = useState("general");
    const [hasAnswered, setHasAnswered] = useState(false); // ✅ Track if user has answered

    // ✅ Fetch a new interview question from backend
    async function fetchInterviewQuestion() {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/question?type=${interviewType}`);
            const data = await response.json();
            setInterviewQuestion(data.question || "No question found.");
            setMessages([{ text: data.question, isBot: true }]); // Reset messages with new question
            setHasAnswered(false); // ✅ Reset answer state
        } catch (error) {
            console.error("Error fetching question:", error);
            setInterviewQuestion("Error loading question.");
        }
    }

    // ✅ Send answer & get AI feedback
    async function answer() {
        if (!input.trim()) return; // Prevent empty submissions

        const userMessage = { text: input, isBot: false };
        setMessages(prevMessages => [...prevMessages, userMessage]); // Add user message
        setInput(""); // Clear input
        
        try {
            const response = await fetch("http://localhost:8000/api/v1/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answer: input,
                    interview_qn: interviewQuestion,
                    interview_type: interviewType
                })
            });

            const data = await response.json();
            const botMessage = { text: data.feedback, isBot: true };

            setMessages(prevMessages => [...prevMessages, botMessage]); // Add AI response
            setHasAnswered(true); // ✅ Enable "Next Question" button
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    }

    // ✅ Fetch initial question when component mounts
    useEffect(() => {
        fetchInterviewQuestion();
    }, []);

    return (
        <div className="container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.isBot ? "col-1" : "col-2"}>
                        <div className={msg.isBot ? "bot-message-box" : "user-message-box"}>
                            <div className={msg.isBot ? "bot-message" : "user-message"}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-box">
                <input 
                    className="answer" 
                    type="text" 
                    placeholder="Type your message here" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="submit" onClick={answer}>Send</button>
            </div>
            <div className="button-box">
                {hasAnswered && (
                    <button className="next-question" onClick={fetchInterviewQuestion}>
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
}
