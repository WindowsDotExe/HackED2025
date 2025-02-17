// ProgressBar.jsx
import React from "react";
import "../Styles/ProgressBar.css";

const ProgressBar = ({ total, current }) => {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current - 1;
        return (
          <div
            key={index}
            className={`progress-ball ${isActive ? "active" : ""}`}
          ></div>
        );
      })}
    </div>
  );
};

export default ProgressBar;