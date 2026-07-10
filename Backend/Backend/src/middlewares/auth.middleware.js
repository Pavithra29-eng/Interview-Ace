const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    // 1. Check if the user is already authenticated via Passport (Google OAuth)
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // 2. Fall back to standard JWT Token validation if no Passport session exists
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        });
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    });

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }
}

module.exports = { authUser };