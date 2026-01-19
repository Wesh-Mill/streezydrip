const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { verifyToken } = require('../middleware');

const router = express.Router();

// Inscription
router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Hasher le mot de passe
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Insérer l'utilisateur
    db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
                }
                return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
            }

            res.status(201).json({ message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
        }
    );
});

// Connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = bcryptjs.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.TOKEN_SECRET || 'secret_key_user',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});

// Vérifier le token
router.get('/verify', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'secret_key_user', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        res.json({
            valid: true,
            user: decoded
        });
    });
});

// Get all users (admin only)
router.get('/all-users', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    db.all('SELECT id, username, email, created_at FROM users', (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(users);
    });
});

module.exports = router;

