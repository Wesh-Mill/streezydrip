const express = require('express');
const db = require('../database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const jwt = require('jsonwebtoken');

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

// Get all products
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors du chargement des produits' });
        }
        res.json(rows || []);
    });
});

// Create product (admin only)
router.post('/', verifyAdminToken, (req, res) => {
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

// Update product (admin only)
router.put('/:id', verifyAdminToken, (req, res) => {
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

// Delete product (admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
        res.json({ message: 'Produit supprimé' });
    });
});

module.exports = router;
