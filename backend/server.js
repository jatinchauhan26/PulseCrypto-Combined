const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Parser = require("rss-parser");
require("dotenv").config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- Middleware ----------------

const FRONTEND_URLS = [
    "https://pulse-crypto-frontend-x34v.vercel.app",
    "http://localhost:5500"
];

// Universal CORS middleware
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || FRONTEND_URLS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Automatically handle OPTIONS preflight for all routes
app.options("*", cors());

// Body parser
app.use(bodyParser.json());

// Serve public and frontend folders
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../frontend/public")));

// ---------- Helper: validate email ----------
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// ---------- POST route for sending alerts ----------
app.post("/send-alert", cors({
    origin: function(origin, callback) {
        if (!origin || FRONTEND_URLS.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}), (req, res) => {
    const { coin, currentPrice, targetPrice, userEmail } = req.body;
    if (!coin || !currentPrice || !targetPrice || !userEmail) {
        return res.status(400).json({ message: "Missing data" });
    }
    if (!isValidEmail(userEmail)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    const msg = {
        to: userEmail,
        from: { name: "PulseCrypto Alerts", email: process.env.SENDGRID_SENDER },
        replyTo: process.env.SENDGRID_SENDER,
        subject: `🚨 Crypto Alert: ${coin} reached your target!`,
        text: `${coin} has reached $${currentPrice}, your target was $${targetPrice}.`,
        html: `<div style="font-family:Arial,sans-serif; color:#333">
                 <h2 style="color:#ff960b">Crypto Alert!</h2>
                 <p><strong>${coin}</strong> reached <strong>$${currentPrice}</strong>.</p>
                 <p>Your target was <strong>$${targetPrice}</strong>.</p>
               </div>`
    };

    sgMail.send(msg)
        .then(() => res.json({ message: `Email sent to ${userEmail}` }))
        .catch(error => {
            console.error("SendGrid error:", error);
            res.status(500).json({ message: "Email sending failed", error });
        });
});

// ---------- Crypto News Endpoint (RSS) ----------
const parser = new Parser();
let cachedNews = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

app.get("/api/news", async (req, res) => {
    try {
        const now = Date.now();
        if (cachedNews && now - cacheTimestamp < CACHE_DURATION) return res.json(cachedNews);

        const feed = await parser.parseURL("https://www.coindesk.com/arc/outboundfeeds/rss/");
        const news = feed.items.map(item => ({
            title: item.title,
            url: item.link,
            publishedDate: item.pubDate,
            contentSnippet: item.contentSnippet || "",
            source: "CoinDesk"
        }));

        cachedNews = news;
        cacheTimestamp = now;
        res.json(news);
    } catch (error) {
        console.error("RSS fetch error:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

// ---------- Catch-all SPA route (must be last) ----------
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ---------- Start server ----------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
