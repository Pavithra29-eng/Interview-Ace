require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const session = require('express-session')
const passport = require('passport')

// Import your passport configuration setup
require('./src/config/passport')

// 1. Connect to MongoDB Atlas
connectToDB()

// 2. Configure Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'interview_ace_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// 3. Initialize Passport Engine Middlewares
app.use(passport.initialize())
app.use(passport.session())

// 4. Use process.env.PORT for Cloud Deployment
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// 5. Keep your AI timeout setting
server.timeout = 120000;
