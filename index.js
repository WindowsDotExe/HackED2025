const dotenv = require("dotenv");
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors"); // ✅ Import CORS

dotenv.config();
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors()); // ✅ Allow all cross-origin requests

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SERVICE_ACCOUNT_SECRET_KEY,
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
});

async function getAIResponse(answer) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: answer }],
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "Error processing response";
    }
}

app.post('/api/v1/answer', async (req, res) => {
    let answer = req.body.answer;

    if (!answer) {
        return res.status(400).json({ error: "Missing 'answer' in request body." });
    }

    const response = await getAIResponse(answer);
    res.json({ response });
});

app.listen(port, () => {
    console.log(`AI Interview Prep running on port ${port}`);
});
