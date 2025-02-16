require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 8000;

// Initialize OpenAI with env variables
const openai = new OpenAI({
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_SERVICE_ACCOUNT_SECRET_KEY, // Service Account API Key
});

app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, "audio.wav"),
});
const upload = multer({ storage });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API to handle audio upload & transcription
app.post("/transcribe", upload.single("audio"), async (req, res) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-1",
        });

        fs.unlinkSync(req.file.path); // Clean up uploaded file
        res.json({ text: transcription.text });
    } catch (error) {
        console.error("Transcription error:", error);
        res.status(500).json({ error: "Transcription failed" });
    }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
