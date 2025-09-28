const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
const Parser = require("rss-parser"); // RSS parser
require("dotenv").config();

const app = express();
const PORT = 3000;

// ---------------- Middleware ----------------
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// ---------- Nodemailer setup ----------
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
});

transporter.verify((error, success) => {
    if (error) console.log("Email transporter error:", error);
    else console.log("Email transporter ready");
});

// ---------- POST route for sending alerts ----------
app.post("/send-alert", (req, res) => {
    const { coin, currentPrice, targetPrice, userEmail } = req.body;
    if (!coin || !currentPrice || !targetPrice || !userEmail) {
        return res.status(400).json({ message: "Missing data" });
    }

    const mailOptions = {
        from: `"PulseCrypto Alerts" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Crypto Alert: ${coin} reached your target!`,
        text: `${coin} reached $${currentPrice}, your target was $${targetPrice}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
            return res.status(500).json({ message: "Email sending failed" });
        }
        console.log(`Email sent to ${userEmail}: ${info.response}`);
        res.json({ message: `Email sent to ${userEmail}` });
    });
});

// ---------- Crypto News Endpoint (RSS) ----------
const parser = new Parser();
let cachedNews = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes


app.get("/api/news", async (req, res) => {
    try {
        const now = Date.now();
        if (cachedNews && now - cacheTimestamp < CACHE_DURATION) {
            return res.json(cachedNews);
        }

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
        console.error("Error fetching RSS news:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

// ---------- Start server ----------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
