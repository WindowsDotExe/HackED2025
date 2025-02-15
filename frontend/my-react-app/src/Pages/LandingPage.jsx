import { Link } from "react-router-dom";
import "../Styles/LandingPage.css";

export default function LandingPage() {
    return (
        <div className="landing-page">
            <h1>Mock Interview AI</h1>
            <p> Welcome to Mock Interview AI </p>
            <Link to="/ChatBot" className="chat-link">Let's Interview Now</Link>
        </div>
    )
}