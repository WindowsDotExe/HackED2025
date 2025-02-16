import "../Styles/ChatBot.css";
import React, { useState } from 'react';

export default function ChatBot() {
    // Define the messages state as an array of objects
    const [messages, setMessages] = useState([
        {
            text: "What are your future goals?",
            isBot: true
        },
        {
            text: "I want to be a software engineer",
            isBot: false
        }
    ]);

    return (
        <div className="container">
            <div className="chat-box">
                <div className="col-1">
                    <div className="bot-message-box">
                        <div className="bot-message">
                            <p> What are your future goals</p>
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="user-message-box">
                        <div className="user-message">
                            <p> I want to be a software engineer</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-box">
                <input className="answer" type="text" placeholder="Type your message here" />
                <button className="submit">Send</button>
            </div>
        </div>
    )
}
