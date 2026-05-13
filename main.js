const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const express = require('express');
const app = express();

// Parse JSON body even for GET requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Generate function returns text
const generate = async (prompt) => {
    try {
        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        return "Error generating content";
    }
}

// GET endpoint that reads body
app.get("/api/content", async (req, res) => {
    try {
        const question = req.query.question; // read from URL
        if (!question) {
            return res.status(400).send({ error: "Question query parameter is required" });
        }
        const result = await generate(question);
        res.send({ result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
