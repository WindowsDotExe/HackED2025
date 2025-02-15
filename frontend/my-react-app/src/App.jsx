import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import ChatBot from './Pages/ChatBot';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ChatBot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}
