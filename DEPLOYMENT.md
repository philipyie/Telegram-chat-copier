# Deployment Guide: Telegram Investigator

## 🚨 CRITICAL SECURITY WARNING 🚨
This application uses **YOUR personal Telegram Account** (`session` string).
If you host this on a public URL without a password, **ANYONE** can read your chats, join channels, and ban your account.

**BEFORE DEPLOYING:**
1.  Open `.env`
2.  Add a password: `APP_PASSWORD=MySecretPassword123`

---

## Option 1: Share with Others (Replit)
If you want *other people* to use this app with *their* Telegram accounts, they need their own private instance. The easiest way is **Replit**.

1.  **Repo**: Upload this code to GitHub.
2.  **Import**: Go to [Replit.com](https://replit.com), click "Import from GitHub".
3.  **Setup**:
    *   In Replit "Secrets" (Environment Variables), add:
        *   `API_ID`: (From my.telegram.org)
        *   `API_HASH`: (From my.telegram.org)
        *   `APP_PASSWORD`: (Required for security)
        *   `AI_PROVIDER`: `groq` (Cloud AI is recommended for Replit)
        *   `GROQ_API_KEY`: (From console.groq.com)
4.  **Run**: Click Run. Replit gives you a public URL (e.g., `https://my-app.replit.co`).
5.  **Login**: Visit the site, enter `admin` + your password. Then enter your Phone Number in the Replit Console when prompted.

---

## Option 2: Render.com (Best Free for Sharing)
Unlike Replit, **Render** does NOT require you to keep your tab open.
*   **Behavior**: It "sleeps" if nobody uses it.
*   **Wake Up**: When someone clicks your link, it wakes up (takes ~30 seconds).

1.  **GitHub**: Upload this code to a GitHub Repository.
2.  **Sign Up**: Go to [Render.com](https://render.com) (Log in with GitHub).
3.  **New Web Service**: Click "New +" -> "Web Service".
4.  **Connect Repo**: Select your `telegram-chat-copier` repo.
5.  **Settings**:
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: Free
6.  **Environment Variables**: Add your secrets here (`API_ID`, `APP_PASSWORD`, `GROQ_API_KEY`, etc).
7.  **Deploy**: It gives you a permanent `https://...onrender.com` link.

---

## Option 3: Host Your Own (Ngrok) - RECOMMENDED
Best for keeping **Local AI (Ollama)** support and persistent data.

1.  **Keep app running** on your PC (`node server.js`).
2.  **Install Ngrok**: [Download from ngrok.com](https://ngrok.com/download).
3.  **Run Command**:
    ```cmd
    ngrok http 3000
    ```
4.  **Share URL**: Ngrok gives you a link (e.g., `https://abc-123.ngrok-free.app`).
    *   You can open this on your phone/laptop anywhere.
    *   It connects securely to your running PC.
    *   **Password Protection** (from Step 1) keeps it safe.

---

## Option 4: Cloud VPS (DigitalOcean/Hetzner)
For advanced users.
1.  Rent a cheap VPS ($5/mo).
2.  Install Docker & Node.js.
3.  Clone repo & run `node server.js` using `pm2` to keep it alive.
4.  **Note**: Standard "Serverless" hosts (Vercel/Netlify) will NOT work because the Background Crawler will fall asleep.
