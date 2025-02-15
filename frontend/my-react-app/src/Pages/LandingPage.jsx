import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <h1>Welcome to my React App!</h1>
            <p>click here to start chatting</p>
            {/* make the link button a nice blue box */}
            <Link to="/ChatBot" style={{backgroundColor: 'blue', color: 'white', padding: '10px', borderRadius: '5px'}}>Chat Now</Link>
        </div>
    )
}