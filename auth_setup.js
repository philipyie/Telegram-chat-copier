const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

if (!apiId || !apiHash) {
    console.error("Error: API_ID or API_HASH missing in .env");
    process.exit(1);
}

// Check if session already exists
if (process.env.STRING_SESSION) {
    console.log("STRING_SESSION already found in .env. Overwriting...");
}

// Prevent background timeouts from crashing the script
process.on('unhandledRejection', (reason, p) => {
    console.log('Handled Rejection (suppressing background timeout):', reason);
});

async function main() {
    console.log("Starting Telegram Authentication...");
    const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
        connectionRetries: 5,
        useWSS: false, // Reverting WSS as it didn't fix it
        deviceModel: "Desktop Script",
        appVersion: "1.0.0",
        systemVersion: "Windows 10",
        langCode: "en",
        systemLangCode: "en"
    });

    try {
        await client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () => await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err),
        });

        console.log("Authentication successful!");
        const sessionString = client.session.save();

        // Save to .env
        const envPath = path.join(__dirname, ".env");
        let envContent = fs.readFileSync(envPath, "utf8");

        // Remove existing STRING_SESSION if any
        const lines = envContent.split("\n").filter(line => !line.startsWith("STRING_SESSION="));
        lines.push(`STRING_SESSION="${sessionString}"`);

        fs.writeFileSync(envPath, lines.join("\n"));
        console.log("Session string saved to .env");

        await client.disconnect();

    } catch (error) {
        console.error("Authentication failed:", error);
    }
}

main();
