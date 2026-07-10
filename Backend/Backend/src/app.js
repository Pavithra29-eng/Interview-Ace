const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Initialize passport strategy configuration
require("./config/passport");

const app = express();

// 1. Trust Proxy (Must be first for Render)
app.set("trust proxy", 1);

// 2. CORS (Must be BEFORE body/cookie parsers and routes)
app.use(cors({
    origin: ["http://localhost:5173", "https://interview-ace-eta.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Session & Passport Middleware Stack (Required for OAuth state tracking)
app.use(session({
    secret: process.env.SESSION_SECRET || 'interview_ace_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if running production on HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// 5. Google OAuth Specific Routing Endpoints
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        // FIXED: Redirecting to root '/' to match your Home route
        res.redirect('http://localhost:5173/');
    }
);

// 6. Application Feature Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 7. 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 8. Centralized error handler
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