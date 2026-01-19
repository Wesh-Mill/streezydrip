const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { verifyToken } = require('../middleware');

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!admin) {
            return res.status(401).json({ error: 'Admin non trouvé' });
        }

        // Vérifier le mot de passe
        const isValid = bcryptjs.compareSync(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.TOKEN_SECRET || 'secret_key_admin',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: 'admin'
            }
        });
    });
});

// Vérifier token admin
router.get('/verify', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }

    res.json({ admin: req.user });
});

// Dashboard Stats
router.get('/stats', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    // Total users
    db.get('SELECT COUNT(*) as count FROM users', (err, users) => {
        if (err) return res.status(500).json({ error: 'Erreur' });

        // Total orders
        db.get('SELECT COUNT(*) as count, SUM(total) as total_revenue FROM orders', (err, orders) => {
            if (err) return res.status(500).json({ error: 'Erreur' });

            // Total products
            db.get('SELECT COUNT(*) as count FROM products', (err, products) => {
                if (err) return res.status(500).json({ error: 'Erreur' });

                res.json({
                    totalUsers: users.count,
                    totalOrders: orders.count,
                    totalRevenue: orders.total_revenue || 0,
                    totalProducts: products.count
                });
            });
        });
    });
});

module.exports = router;
