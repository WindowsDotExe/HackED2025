const dotenv = require("dotenv");
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");

dotenv.config();
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SERVICE_ACCOUNT_SECRET_KEY,
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
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

app.post('/api/v1/answer', async (req, res) => {
    console.log(req.body);
    let answer = req.body.answer;
    let interview_type = req.body.interview_type || "general"; // Default to "general"

    if (!answer) {
        return res.status(400).json({ error: "Missing 'answer' in request body." });
    }

    const response = await getAIResponse(answer, interview_type);
    res.json({ response });
});

app.listen(port, () => {
    console.log(`AI Interview Prep running on port ${port}`);
});
