const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware de vérification du token admin
function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        req.adminEmail = decoded.email;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
}

// Admin Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    db.get('SELECT * FROM users WHERE email = ? AND is_admin = 1', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const passwordMatch = bcryptjs.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, message: 'Connexion réussie' });
    });
});

// Get Admin Stats
router.get('/stats', verifyAdminToken, (req, res) => {
    const stats = {};

    // Total users
    db.get('SELECT COUNT(*) as count FROM users WHERE is_admin = 0', (err, row) => {
        if (err) return res.status(500).json({ error: 'Erreur' });
        stats.totalUsers = row.count;

        // Total orders
        db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
            if (err) return res.status(500).json({ error: 'Erreur' });
            stats.totalOrders = row.count;

            // Total revenue
            db.get('SELECT SUM(total) as total FROM orders', (err, row) => {
                if (err) return res.status(500).json({ error: 'Erreur' });
                stats.totalRevenue = row.total || 0;

                // Total products
                db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                    if (err) return res.status(500).json({ error: 'Erreur' });
                    stats.totalProducts = row.count;

                    res.json(stats);
                });
            });
        });
    });
});

// Get all products
router.get('/products', verifyAdminToken, (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du chargement des produits' });
        }
        res.json(rows || []);
    });
});

// Also handle /api/products for compatibility
router.get('/products', verifyAdminToken, (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du chargement des produits' });
        }
        res.json(rows || []);
    });
});

// Create product
router.post('/products', verifyAdminToken, (req, res) => {
    const { name, price, category, stock, description, image } = req.body;

    if (!name || !price || !category || stock === undefined) {
        return res.status(400).json({ error: 'Tous les champs requis' });
    }

    db.run(
        'INSERT INTO products (name, price, category, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, category, stock, description || '', image || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la création' });
            }
            res.status(201).json({ id: this.lastID, message: 'Produit créé' });
        }
    );
});

// Update product
router.put('/products/:id', verifyAdminToken, (req, res) => {
    const { id } = req.params;
    const { name, price, category, stock, description, image } = req.body;

    db.run(
        'UPDATE products SET name = ?, price = ?, category = ?, stock = ?, description = ?, image = ? WHERE id = ?',
        [name, price, category, stock, description || '', image || '', id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
            }
            res.json({ message: 'Produit mis à jour' });
        }
    );
});

// Delete product
router.delete('/products/:id', verifyAdminToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
        res.json({ message: 'Produit supprimé' });
    });
});

// Get all users
router.get('/users', verifyAdminToken, (req, res) => {
    db.all('SELECT id, username, email, created_at FROM users WHERE is_admin = 0', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du chargement des utilisateurs' });
        }
        res.json(rows || []);
    });
});

// Get all orders
router.get('/orders', verifyAdminToken, (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du chargement des commandes' });
        }
        res.json(rows || []);
    });
});

module.exports = router;
