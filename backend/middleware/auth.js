const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token
    if (!token) return res.status(403).json({ error: "A token is required for authentication" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });
        req.username = decoded.username; // Set username from the token
        console.log(`Authenticated username: ${req.username}`); // Debug log
        console.log(`Decoded token: ${JSON.stringify(decoded)}`); // Debug log
        next();
    });
};

module.exports = verifyToken;
