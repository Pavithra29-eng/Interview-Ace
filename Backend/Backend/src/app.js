const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

const app = express();

// 1. Trust Proxy (Must be first for Render deployments)
app.set("trust proxy", 1);

// 2. Strict Custom Headers & CORS Middleware Override
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://preppulse-mu.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Instantly intercept and handle preflight OPTIONS checks
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Alternative standard CORS safety package fallbacks
app.use(cors({
    origin: "https://preppulse-mu.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Session Middleware Stack
app.use(session({
    secret: process.env.SESSION_SECRET || 'preppulse_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none'
    }
}));

// 5. Application Feature Routes
const interviewRouter = require("./routes/interview.routes");
app.use("/api/interview", interviewRouter);

// 6. 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 7. Centralized error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Resume file is too large. Maximum allowed size is 3MB." });
    }

    if (err.code === 11000) {
        return res.status(400).json({ message: "Account already exists with this email address or username" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    res.status(err.status || 500).json({ message: err.message || "Internal server error." });
});

module.exports = app;