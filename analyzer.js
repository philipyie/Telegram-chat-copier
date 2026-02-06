require("dotenv").config();
const fs = require("fs");
const path = require("path");

// Load Config
const config = require("./investigation_config.json");

// --- UNIFIED AI REQUEST HANDLER ---
async function callAI(messages, jsonMode = false) {
    // Reload config to get latest settings
    delete require.cache[require.resolve("./investigation_config.json")];
    const currentConfig = require("./investigation_config.json");

    const provider = currentConfig.ai_provider || process.env.AI_PROVIDER || "local";
    let url, headers, body;

    if (provider === "groq") {
        url = "https://api.groq.com/openai/v1/chat/completions";
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentConfig.groq_api_key || process.env.GROQ_API_KEY}`
        };
        body = {
            model: "llama-3.1-8b-instant", // Latest fast model (replaced legacy 8b)
            messages: messages,
            temperature: 0.1,
            response_format: jsonMode ? { type: "json_object" } : undefined
        };
    } else {
        // Default: Local Ollama
        url = "http://127.0.0.1:11434/api/chat";
        headers = { "Content-Type": "application/json" };
        body = {
            model: "dolphin-llama3", // Uncensored Local
            messages: messages,
            stream: false,
            format: jsonMode ? "json" : undefined
        };
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`AI Provider (${provider}) Error ${response.status}: ${errText}`);
        }

        const data = await response.json();

        // Normalize Output (Ollama vs OpenAI format is similar for chat/completions)
        // OpenAI/Groq: choices[0].message.content
        // Ollama: message.content
        return data.choices ? data.choices[0].message.content : data.message.content;

    } catch (error) {
        console.error(`[AI Error - ${provider}]:`, error.message);
        throw error;
    }
}

// --- FUNCTIONS ---

async function analyzeMessage(messageText, metadata) {
    // Reload config
    delete require.cache[require.resolve("./investigation_config.json")];
    const currentConfig = require("./investigation_config.json");

    // 1. Keyword Pre-filter
    const lowerText = messageText.toLowerCase();
    const foundKeywords = (currentConfig.keywords || []).filter((kw) => lowerText.includes(kw.toLowerCase()));

    if (foundKeywords.length === 0) {
        return null; // Not suspicious
    }

    // 2. AI Risk Analysis
    console.log(`[Analyzer] Keywords found: ${foundKeywords.join(", ")}. Sending to AI...`);

    const defaultPrompt = `
    You are a digital forensics analyst.
    Analyze the following Telegram message for suspicious activity based on the providing keywords.
    `;
    const basePrompt = currentConfig.system_prompt || defaultPrompt;

    const systemPrompt = `
    ${basePrompt}
    Keywords matched: ${foundKeywords.join(", ")}
    Return a JSON object ONLY with the following schema:
    {
      "risk_level": "HIGH" | "MEDIUM" | "LOW",
      "summary": "Brief explanation",
      "entities": ["list", "of", "names", "or", "products"]
    }
    `;

    try {
        const content = await callAI([
            { role: "system", content: systemPrompt },
            { role: "user", content: `Message: "${messageText}"` }
        ], true);

        // Parse JSON
        let analysis;
        try {
            analysis = JSON.parse(content);
        } catch (e) {
            const match = content.match(/\{[\s\S]*\}/);
            analysis = match ? JSON.parse(match[0]) : { risk_level: "UNKNOWN", summary: "Parse Error", raw: content };
        }

        return {
            timestamp: new Date().toISOString(),
            ...metadata,
            keywords_found: foundKeywords,
            ai_analysis: analysis,
            raw_text: messageText,
        };

    } catch (error) {
        console.error("Analysis Failed:", error.message);
        return null;
    }
}

let evidenceCounter = 0;
function logEvidence(evidence) {
    if (!evidence) return;
    evidenceCounter++;
    const filePath = path.join(__dirname, "evidence.jsonl");
    const line = JSON.stringify(evidence) + "\n";
    fs.appendFileSync(filePath, line, "utf8");
    const snippet = evidence.raw_text ? evidence.raw_text.substring(0, 50).replace(/\n/g, " ") : "";
    console.log(`[EVIDENCE #${evidenceCounter}] Risk: ${evidence.ai_analysis.risk_level} | Msg: "${snippet}..."`);
}

async function chat(userMessage) {
    try {
        return await callAI([
            {
                role: "system",
                content: `Current Date: ${new Date().toLocaleString()}. You are an expert investigative assistant. Be direct and concise.`
            },
            { role: "user", content: userMessage }
        ], false);
    } catch (e) {
        return `Error: ${e.message}`;
    }
}

async function performDeepAnalysis(messages) {
    if (!messages || messages.length === 0) return null;

    console.log(`[Deep Analysis] Processing ${messages.length} messages...`);

    // 1. Statistical Analysis (Word Frequency) - Local CPU
    const stopWords = new Set(["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "is", "are", "was", "were", "has", "had", "can", "could", "should", "would"]);
    const wordCounts = {};
    const allText = messages.map(m => m.message || "").join(" ");
    const words = allText.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);

    for (const word of words) {
        if (word.length > 3 && !stopWords.has(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    }
    const topWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word, count]) => ({ word, count }));

    // 2. AI Analysis
    let aiResult = { summary: "Analysis failed", topics: [], sentiment: "Unknown" };

    delete require.cache[require.resolve("./investigation_config.json")];
    const currentConfig = require("./investigation_config.json");
    const contextHint = currentConfig.system_prompt ? `Role: ${currentConfig.system_prompt}` : "Context: Digital Forensics";

    const fullText = messages.map(m => `[${m.date}] ${m.sender}: ${m.message}`).join("\n");
    const chunkSize = 15000;

    try {
        let finalUserContent = "";
        let finalSystemPrompt = "";

        if (fullText.length <= chunkSize) {
            // Single Pass
            finalUserContent = `Chat Logs:\n${fullText}`;
            finalSystemPrompt = `
                You are an expert chat analyst. ${contextHint}
                Analyze this chat log.
                Return JSON ONLY: { "summary": "...", "topics": [], "sentiment": "..." }
            `;
        } else {
            // Map-Reduce
            console.log(`[Deep Analysis] Using Map-Reduce for ${fullText.length} chars...`);
            const chunks = [];
            for (let i = 0; i < fullText.length; i += chunkSize) chunks.push(fullText.substring(i, i + chunkSize));

            const chunkSummaries = [];
            for (let i = 0; i < chunks.length; i++) {
                try {
                    const chunkRes = await callAI([
                        { role: "system", content: "Summarize this chat section. Return plain text." },
                        { role: "user", content: chunks[i] }
                    ], false);
                    chunkSummaries.push(`[Section ${i + 1}]: ${chunkRes}`);
                } catch (e) {
                    console.error(`Chunk ${i} failed`);
                }
            }

            finalUserContent = `Summaries:\n${chunkSummaries.join("\n\n")}`;
            finalSystemPrompt = `
                You are an expert chat analyst. ${contextHint}
                Combine these summaries into a final report.
                Return JSON ONLY: { "summary": "...", "topics": [], "sentiment": "..." }
            `;
        }

        const content = await callAI([
            { role: "system", content: finalSystemPrompt },
            { role: "user", content: finalUserContent }
        ], true);

        try {
            aiResult = JSON.parse(content);
        } catch (e) {
            const match = content.match(/\{[\s\S]*\}/);
            aiResult = match ? JSON.parse(match[0]) : { summary: content, topics: [], sentiment: "Unknown" };
        }

    } catch (e) {
        console.error("Deep Analysis AI Failed:", e);
        aiResult = { summary: "Error: " + e.message, topics: [], sentiment: "Error" };
    }

    return {
        messageCount: messages.length,
        topWords: topWords,
        summary: aiResult.summary,
        topics: aiResult.topics || [],
        sentiment: aiResult.sentiment
    };
}

async function analyzeInvitation(inviteTitle, messageContext) {
    console.log(`[Analyzer] Auditing Invite: "${inviteTitle}"`);

    const systemPrompt = `
    You are a digital forensics crawler.
    Decide if we should join a Telegram channel based on its Title and Context.
    
    Criteria (Suspicious): Drugs, Cybercrime, Marketplaces, Hacking, Illegal.
    Ignore: Personal, Spam, Crypto Shilling (unless darknet related).

    Inputs:
    - Title: "${inviteTitle}"
    - Context: "${messageContext}"
    
    Return JSON ONLY:
    { "risk_level": "HIGH"|"MEDIUM"|"LOW", "should_join": true|false, "reason": "..." }
    `;

    try {
        const content = await callAI([
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze this invite." }
        ], true);

        try {
            return JSON.parse(content);
        } catch (e) {
            const match = content.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : { risk_level: "UNKNOWN", should_join: false };
        }
    } catch (e) {
        console.error("Invite Audit Failed:", e);
        return { risk_level: "UNKNOWN", should_join: false };
    }
}

module.exports = { analyzeMessage, logEvidence, chat, performDeepAnalysis, analyzeInvitation };
