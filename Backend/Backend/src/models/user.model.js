const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
    },

    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true,
    },

    password: {
        type: String,
        required: false // Changed to false so Google signups don't trigger validation failures
    },

    googleId: {
        type: String,
        required: false,
        unique: true // Prevents duplicate OAuth associations
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel