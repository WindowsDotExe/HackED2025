
export default function ChatBot() {
    return (
        <div>
            <h1>Interview Prep ChatBot</h1>
            <p className="message bot">
            Tell me about yourself
            </p>
            <p className="message user">
            I am a software engineer
            </p>
            <form className="input form">
                {/* This will be the form where users can input their questions and then a call is made to api.post("/api/v1/answers") and in the body w eprovide the answer(input from user) */}
                <input type="text" placeholder="Enter your question" />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}
