require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// 1. Enforce strict CORS handling at the absolute network entry point
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://preppulse-mu.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// 2. Connect to MongoDB Atlas
connectToDB();

// 3. Use process.env.PORT for Cloud Deployment
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 4. Keep your AI timeout setting
server.timeout = 120000;