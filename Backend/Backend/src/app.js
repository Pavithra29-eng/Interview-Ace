const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

const app = express();

// 1. Trust Proxy (Must be first for Render deployments)
app.set("trust proxy", 1);

// 2. Global CORS Configuration (Handles Preflight & Request validation smoothly)
const allowedOrigins = [
    "https://preppulse-mu.vercel.app",                                    // production
    "https://preppulse-git-main-pavithra-lokesh-ms-projects.vercel.app",  // current preview
    "http://localhost:5173",                                             // local dev (adjust port if different)
];

function isOriginAllowed(origin) {
    if (!origin) return false;
    return (
        allowedOrigins.includes(origin) ||
        /^https:\/\/preppulse-.*\.vercel\.app$/.test(origin) // matches ALL preview URLs for this project
    );
}

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (curl, mobile apps, server-to-server)
        if (!origin) return callback(null, true);

        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS globally (this automatically catches preflight requests)
app.use(cors(corsOptions));

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

// Helper: sets CORS headers dynamically based on the actual request origin
function setCorsHeaders(req, res) {
    const origin = req.headers.origin;
    if (isOriginAllowed(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    }
}

// 5. Intercept Dead Frontend Auth Requests to avoid 404 header drops
app.get("/api/auth/get-me", (req, res) => {
    setCorsHeaders(req, res);
    return res.status(200).json({ user: { id: "guest", username: "Guest User" } });
});

// 6. Application Feature Routes
const interviewRouter = require("./routes/interview.routes");
app.use("/api/interview", interviewRouter);

// 7. 404 handler for unmatched routes
app.use((req, res) => {
    // Inject headers safely so Vercel doesn't read a 404 as a CORS block
    setCorsHeaders(req, res);
    res.status(404).json({ message: "Route not found" });
});

// 8. Centralized error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    // Inject headers safely so runtime errors aren't hidden behind a browser network drop
    setCorsHeaders(req, res);

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