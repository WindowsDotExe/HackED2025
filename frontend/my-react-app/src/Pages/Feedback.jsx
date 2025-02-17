"use client"

import React, { useState } from "react";
import "../Styles/Feedback.css";

const feedbackData = [
  {
    id: 1,
    summary: "Sentence 1",
    details: "Detailed feedback for sentence 1.",
  },
  {
    id: 2,
    summary: "Sentence 2",
    details: "Detailed feedback for sentence 2.",
  },
  {
    id: 3,
    summary: "Sentence 3",
    details: "Detailed feedback for sentence 3.",
  },
  {
    id: 4,
    summary: "Sentence 4",
    details: "Detailed feedback for sentence 4.",
  },
  {
    id: 5,
    summary: "Sentence 5",
    details: "Detailed feedback for sentence 5.",
  },
];

const Feedback = () => {
  const [activeId, setActiveId] = useState(null);

  // Open modal with details of the clicked sentence
  const openModal = (id) => {
    setActiveId(id);
  };

  // Close modal
  const closeModal = () => {
    setActiveId(null);
  };

  // We get the data object corresponding to the active sentence
  const activeItem = feedbackData.find((item) => item.id === activeId);

  return (
    <div className="feedback-container">
      {/* 1) List of Sentences */}
      {feedbackData.map((item) => (
        <div
          key={item.id}
          className="feedback-sentence"
          onClick={() => openModal(item.id)}
        >
          {item.summary}
        </div>
      ))}

      {/* 2) Modal for showing details (only when a sentence is clicked) */}
      {activeId !== null && (
        <div className="feedback-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <p>{activeItem?.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
