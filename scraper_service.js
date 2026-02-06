require("dotenv").config();
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
const { analyzeMessage, logEvidence, chat } = require("./analyzer");
const config = require("./investigation_config.json");
const EventEmitter = require("events");

class TelegramScraper extends EventEmitter {
    constructor() {
        super();
        this.client = null;
        this.isRunning = false;
        this.apiId = parseInt(process.env.API_ID);
        this.apiHash = process.env.API_HASH;
        this.stringSession = new StringSession(process.env.STRING_SESSION || "");
    }

    log(msg) {
        console.log(msg); // Keep console for debugging
        this.emit("log", msg);
    }

    async connect() {
        if (this.client) return; // Already connected

        this.log("Initializing Telegram Client...");
        try {
            this.client = new TelegramClient(this.stringSession, this.apiId, this.apiHash, {
                connectionRetries: 5,
            });

            await this.client.start({
                phoneNumber: async () => await input.text("Please enter your number: "),
                password: async () => await input.text("Please enter your password: "),
                phoneCode: async () => await input.text("Please enter the code you received: "),
                onError: (err) => this.log("Telegram Error: " + err),
            });

            this.log(`Connected as: ${(await this.client.getMe()).username}`);
        } catch (error) {
            this.log("Connection Error: " + error.message);
            this.client = null; // Reset on failure
            throw error;
        }
    }

    async start() {
        if (this.isRunning) {
            this.log("Scraper is already running.");
            return;
        }

        if (!this.apiId || !this.apiHash) {
            this.log("Error: Missing API_ID or API_HASH in .env");
            return;
        }

        try {
            await this.connect();

            this.isRunning = true;

            // Phase 1: Scan Targets
            await this.scanTargets();

            if (!this.isRunning || !this.client) {
                this.log("Scraper stopped during scan.");
                return;
            }

            // Phase 2: Live Listener
            this.log("Entering Live Surveillance Mode...");
            this.client.addEventHandler(this.handleNewMessage.bind(this), new NewMessage({}));

            // Phase 3: Global Crawler (Background)
            this.startGlobalCrawler();

        } catch (error) {
            this.log("Fatal Error: " + error.message);
            this.isRunning = false;
        }
    }

    async startGlobalCrawler() {
        // Run immediately then every 15 minutes
        const loop = async () => {
            if (!this.isRunning) return;

            // Reload config
            delete require.cache[require.resolve("./investigation_config.json")];
            const currentConfig = require("./investigation_config.json");

            if (!currentConfig.crawler_mode) return;

            const keywords = currentConfig.keywords || [];
            if (keywords.length === 0) return;

            this.log(`[Global Hunter] Starting global scan for ${keywords.length} keywords...`);

            for (const keyword of keywords) {
                if (!this.isRunning) break;

                try {
                    // Random delay 2-5s to be safe
                    await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));

                    const result = await this.client.invoke(
                        new Api.contacts.Search({
                            q: keyword,
                            limit: 5 // Top 5 per keyword
                        })
                    );

                    for (const chat of result.chats) {
                        try {
                            if (!chat.username) continue; // Skip private without link
                            if (currentConfig.target_channels.includes(chat.username)) continue; // Already tracking

                            // AI Audit
                            const { analyzeInvitation } = require("./analyzer");
                            this.log(`[Global Hunter] Auditing: ${chat.title} (@${chat.username})`);

                            // We use the Title + Username as "Context"
                            const audit = await analyzeInvitation(chat.title, `Result for keyword "${keyword}". Username: @${chat.username}`);

                            if (audit.should_join) {
                                this.log(`[Global Hunter] !!! MATCH FOUND !!! Joining @${chat.username}`);

                                await this.client.invoke(new Api.channels.JoinChannel({ channel: chat.username }));

                                // Persist
                                if (!currentConfig.target_channels.includes(chat.username)) {
                                    currentConfig.target_channels.push(chat.username);
                                    const fs = require('fs');
                                    const path = require('path');
                                    fs.writeFileSync(path.join(__dirname, "investigation_config.json"), JSON.stringify(currentConfig, null, 2));
                                }

                                // Analyze immediately
                                setTimeout(() => {
                                    this.getDeepAnalysis(chat.username, 200).catch(e => console.error(e));
                                }, 5000);
                            }

                        } catch (itemErr) {
                            // ignore individual item fails
                        }
                    }

                } catch (searchErr) {
                    this.log(`[Global Hunter] Search error for "${keyword}": ${searchErr.message}`);
                    if (searchErr.message.includes("FLOOD")) {
                        await new Promise(r => setTimeout(r, 60000)); // Cool down
                    }
                }
            }

            this.log("[Global Hunter] Scan complete. Sleeping 15m...");
            setTimeout(loop, 15 * 60 * 1000);
        };

        loop();
    }

    async stop() {
        if (!this.isRunning) return;
        this.log("Stopping Scraper...");
        this.isRunning = false; // Set immediately to stop loops

        if (this.client) {
            await this.client.disconnect();
            this.client = null;
        }
        this.log("Scraper Stopped.");
    }

    async scanTargets() {
        this.log(`Starting Scan of ${config.target_channels.length} targets...`);

        for (const target of config.target_channels) {
            if (!this.isRunning) break;
            try {
                this.log(`Processing target: ${target}`);
                let entity;
                try {
                    entity = await this.client.getEntity(target);
                } catch (e) {
                    this.log(`Skipping ${target}: Not found or not joined.`);
                    continue;
                }

                const messages = await this.client.getMessages(entity, { limit: config.scan_history_limit });
                let flagCount = 0;

                for (const msg of messages) {
                    if (!this.isRunning) break; // Check interrupt
                    if (!msg.message) continue;
                    const meta = this.createMeta(msg, entity, target);
                    const evidence = await analyzeMessage(msg.message, meta);

                    if (evidence) {
                        logEvidence(evidence);
                        flagCount++;
                        this.emit("evidence", evidence);
                    }
                }
                this.log(`-> Finished ${target}. Flags: ${flagCount}`);

            } catch (e) {
                this.log(`Error scanning ${target}: ${e.message}`);
            }
        }
    }

    async handleNewMessage(event) {
        if (!this.isRunning) return;
        const message = event.message;
        if (!message || !message.message) return;

        // Check if message is from a target channel
        // Note: Filtering by ID would be more robust here, simplified for demo

        const preview = message.message.substring(0, 50).replace(/\n/g, " ");
        this.log(`[Live] New msg in ${message.chatId}: "${preview}..."`);

        const meta = {
            channel_id: message.chatId ? message.chatId.toString() : "unknown",
            message_id: message.id,
            sender_id: message.fromId ? message.fromId.toString() : "unknown",
            date: message.date
        };

        const evidence = await analyzeMessage(message.message, meta);
        if (evidence) {
            this.log("!!! LIVE MATCH DETECTED !!!");
            logEvidence(evidence);
            this.emit("evidence", evidence);
        }

        // --- CRAWLER LOGIC ---
        // Regex for t.me links (public or private invite)
        const linkRegex = /(?:https?:\/\/)?t\.me\/(?:\+|joinchat\/|[a-zA-Z0-9_]{5,32})/g;
        const links = message.message.match(linkRegex);

        if (links && links.length > 0) {
            for (const link of links) {
                await this.processDiscoveredLink(link, message.message);
            }
        }
    }

    async processDiscoveredLink(link, context) {
        // Reload config to check crawler settings
        delete require.cache[require.resolve("./investigation_config.json")];
        const currentConfig = require("./investigation_config.json");

        if (!currentConfig.crawler_mode) return; // Only run if enabled

        // Deduplication: Don't check the same link twice in one session (or persist it)
        if (this.discoveredLinks && this.discoveredLinks.has(link)) return;
        if (!this.discoveredLinks) this.discoveredLinks = new Set();
        this.discoveredLinks.add(link);

        this.log(`[Crawler] Found link: ${link}`);

        try {
            // 1. Resolve Link Metadata
            // This does NOT join the channel yet, just peeks at it
            // We need to extract the "hash" or "username" from the link
            let hashOrUser = link.split("t.me/")[1].replace("joinchat/", "").replace("+", "").split("/")[0];

            // Basic validation
            if (!hashOrUser) return;

            let inviteInfo;
            try {
                // If it's a private invite code
                if (link.includes("+") || link.includes("joinchat")) {
                    inviteInfo = await this.client.invoke(new Api.messages.CheckChatInvite({ hash: hashOrUser }));
                } else {
                    // Public username
                    const entity = await this.client.getEntity(hashOrUser);
                    inviteInfo = { title: entity.title, chat: entity };
                }
            } catch (e) {
                this.log(`[Crawler] Check failed for ${link}: ${e.message}`);
                return;
            }

            const title = inviteInfo.title || (inviteInfo.chat ? inviteInfo.chat.title : "Unknown");

            // 2. Pre-Check Audit (AI)
            // Import analyzeInvitation helper
            const { analyzeInvitation } = require("./analyzer");
            const audit = await analyzeInvitation(title, context);

            this.log(`[Crawler] Audit for "${title}": Risk=${audit.risk_level}, Join=${audit.should_join}`);

            if (audit.should_join) {
                // 3. Auto-Join
                this.log(`[Crawler] !!! HIGH RISK INVITE !!! Auto-joining ${title}...`);

                try {
                    // Join
                    if (link.includes("+") || link.includes("joinchat")) {
                        await this.client.invoke(new Api.messages.ImportChatInvite({ hash: hashOrUser }));
                    } else {
                        await this.client.invoke(new Api.channels.JoinChannel({ channel: hashOrUser }));
                    }

                    // 4. Add to Targets (Persistence)
                    if (!currentConfig.target_channels.includes(hashOrUser) && !currentConfig.target_channels.includes(title)) { // simplified check
                        currentConfig.target_channels.push(title); // Store title if private, or username
                        // In a real app we'd resolve robustly. For now just push to list so UI sees it.
                        const fs = require('fs');
                        const path = require('path');
                        fs.writeFileSync(path.join(__dirname, "investigation_config.json"), JSON.stringify(currentConfig, null, 2));
                    }

                    this.log(`[Crawler] Successfully joined ${title}.`);

                    // 5. Immediate Deep Analysis
                    // We need to resolve the entity ID now
                    // Triggering via existing method (might need retry if entity not immediately ready)
                    setTimeout(() => {
                        this.getDeepAnalysis(title, 200).catch(err => console.error("Post-join analysis err:", err));
                    }, 5000);

                } catch (joinErr) {
                    this.log(`[Crawler] Join Failed: ${joinErr.message}`);
                }
            }

        } catch (e) {
            console.error(`[Crawler] Error processing link ${link}:`, e);
        }
    }

    createMeta(msg, entity, targetName) {
        return {
            channel_id: entity.id.toString(),
            channel_name: entity.title || targetName,
            message_id: msg.id,
            sender_id: msg.fromId ? msg.fromId.toString() : "unknown",
            date: msg.date
        };
    }

    async searchPublicChats(query) {
        if (!this.client) {
            await this.connect();
        }

        this.log(`Searching for: ${query}`);
        try {
            // Use contacts.Search to find channels/chats
            const results = await this.client.invoke(
                new Api.contacts.Search({
                    q: query,
                    limit: 10,
                })
            );
            return results.chats;
        } catch (error) {
            this.log(`Search error: ${error.message}`);
            throw error; // Propagate for UI handling
        }
    }
    async getDeepAnalysis(target, limit = 200) {
        if (!this.client) await this.connect();

        this.log(`Deep Analyzing ${target} (Limit: ${limit})...`);
        try {
            const entity = await this.client.getEntity(target);
            const messages = await this.client.getMessages(entity, { limit: limit });

            const cleanMessages = messages
                .filter(m => m.message)
                .map(m => ({
                    message: m.message,
                    sender: m.fromId ? m.fromId.toString() : "anon",
                    date: new Date(m.date * 1000).toISOString()
                }));

            const { performDeepAnalysis } = require("./analyzer");
            const analysis = await performDeepAnalysis(cleanMessages);

            return { target, ...analysis };

        } catch (error) {
            this.log(`Analysis Error: ${error.message}`);
            throw error;
        }
    }

    chat(msg) {
        return chat(msg);
    }
}

module.exports = new TelegramScraper();
