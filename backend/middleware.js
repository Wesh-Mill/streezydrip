const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'secret_key_admin', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
