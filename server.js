require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const scraper = require("./scraper_service");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const basicAuth = require('express-basic-auth');

const CONFIG_FILE = path.join(__dirname, "investigation_config.json");
const EVIDENCE_FILE = path.join(__dirname, "evidence.jsonl");

// --- SECURITY: Basic Auth ---
// Only protect if APP_PASSWORD is set in .env
if (process.env.APP_PASSWORD) {
    console.log("🔒 Basic Auth Enabled");
    app.use(basicAuth({
        users: { 'admin': process.env.APP_PASSWORD },
        challenge: true
    }));
} else {
    console.log("⚠️ WARNING: Basic Auth Disabled (Set APP_PASSWORD in .env to enable)");
}

// --- API Endpoints ---

// 1. Status
app.get("/api/status", (req, res) => {
    res.json({ isRunning: scraper.isRunning });
});

// 2. Control
app.post("/api/start", async (req, res) => {
    if (scraper.isRunning) return res.status(400).json({ msg: "Already running" });
    scraper.start();
    res.json({ msg: "Started" });
});

app.post("/api/stop", async (req, res) => {
    if (!scraper.isRunning) return res.status(400).json({ msg: "Not running" });
    await scraper.stop();
    res.json({ msg: "Stopped" });
});

// 3. Config
app.get("/api/config", (req, res) => {
    let config = {};
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            config = JSON.parse(fs.readFileSync(CONFIG_FILE));
        } catch (e) {
            console.error("Error reading config file:", e);
        }
    }

    // Overlay Environment Variables (Cloud Hosting Support)
    if (process.env.AI_PROVIDER) config.ai_provider = process.env.AI_PROVIDER;
    if (process.env.GROQ_API_KEY) config.groq_api_key = process.env.GROQ_API_KEY;

    res.json(config);
});

app.post("/api/config", (req, res) => {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body, null, 2));
    res.json({ msg: "Config Saved" });
});

// 4. Evidence
app.get("/api/evidence", (req, res) => {
    if (!fs.existsSync(EVIDENCE_FILE)) return res.json([]);
    const content = fs.readFileSync(EVIDENCE_FILE, "utf-8");
    const records = content.split("\n")
        .filter(l => l.trim())
        .map(l => JSON.parse(l))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(records);
});

// 5. Chat
app.post("/api/chat", async (req, res) => {
    const response = await scraper.chat(req.body.message);
    res.json({ response });
});

// 6. Search
app.post("/api/search", async (req, res) => {
    try {
        const results = await scraper.searchPublicChats(req.body.query);
        // Serialize results to simple objects to avoid circular references/big payloads
        const safeResults = results.map(chat => ({
            id: chat.id.toString(),
            title: chat.title || "No Title",
            username: chat.username,
            participantsCount: chat.participantsCount
        }));
        res.json(safeResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Socket.io (Real-time Logs) ---
io.on("connection", (socket) => {
    console.log("Client connected to socket");
});

// Event Listeners from Scraper
scraper.on("log", (msg) => {
    io.emit("log", { timestamp: new Date(), msg });
});

scraper.on("evidence", (evidence) => {
    io.emit("evidence", evidence);
});

// 7. Deep Analysis
app.post("/api/analyze-chat", async (req, res) => {
    try {
        const { target, limit } = req.body;
        if (!target) return res.status(400).json({ error: "Target username required" });

        const result = await scraper.getDeepAnalysis(target, limit || 200);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Start Server ---
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Web Interface running at http://localhost:${PORT}`);
});
