const dotenv = require("dotenv");
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const path = require('path');
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const app = express();
const port = 8000;

app.use(express.json());

// ✅ Configure CORS properly
app.use(cors({
    origin: "*", // Allow all origins (for development only)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ Ensure CORS headers are included in responses
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (for development only)
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// ✅ Handle CORS preflight requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (for development only)
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SERVICE_ACCOUNT_SECRET_KEY,
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
});

app.get("/api/v1/question", async (req, res) => {
    let interviewType = req.query.type || "general"; // Default to "general"

    try {
        const { data, error } = await supabase
            .from("interview_questions")
            .select("*")
            .eq("category", interviewType)

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ question: "No questions available." });
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        res.json({ question: data[randomIndex].question });
    } catch (error) {
        console.error("❌ Supabase Error:", error);
        res.status(500).json({ error: "Error fetching interview question." });
    }
});

async function getAIResponse(answer, interview_qn, interview_type) {
    try {
        let system_prompt = `You are a professional interviewer conducting a ${interview_type} interview. 
        The user has been asked an interview question and has provided their response.
        Your job is to evaluate the response **without** asking any follow-up questions.
        - Assess the response based on **clarity, structure, relevance, and professionalism**.
        - Identify **strengths** in the response.
        - Provide **constructive feedback** for improvement.
        - **Do not ask another question** or continue the conversation beyond feedback.
        - Keep your feedback professional, clear, and concise.
        - **Do not use any HTML formatting, bullet points, or markdown. Respond in a single concise paragraph.** 
        
        Interview Type: ${interview_type} 
        Interview Question: ${interview_qn}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: answer },
            ],
            temperature: 0.7,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "Error processing response";
    }
}

async function testDBConnection() {
    try {
        const { data, error } = await supabase.from("interview_questions").select("id").limit(1);
        if (error) throw error;
        console.log("✅ Supabase connection successful and accessible!");
    } catch (error) {
        console.error("❌ Failed to connect to Supabase:", error.message);
    }
}

app.post("/api/v1/answer", async (req, res) => {
    console.log(req.body);
    let answer = req.body.answer;
    let interview_qn = req.body.interview_qn;
    let interview_type = req.body.interview_type || "general";

    if (!answer) {
        return res.status(400).json({ error: "Missing 'answer' in request body." });
    }

    // const interview_qn = await getRandomInterviewQuestion(interview_type);

    const response = await getAIResponse(answer, interview_qn, interview_type);

    res.json({ question: interview_qn, feedback: response });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`✅ Backend server LIVE on port ${port}`);
    testDBConnection();
});
