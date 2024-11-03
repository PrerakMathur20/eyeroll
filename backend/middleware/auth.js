// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token
    if (!token) return res.status(403).json({ error: "A token is required for authentication" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });
        req.userId = decoded.userId; // Set userId from the token
        console.log(`Authenticated user ID: ${req.userId}`); // Debug log
        next();
    });
};

module.exports = verifyToken;
