const express = require('express');
const db = require('../database');
const { verifyToken } = require('../middleware');

const router = express.Router();

// Vérifier que c'est un admin
function verifyAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }
}

// GET tous les produits (public)
router.get('/', (req, res) => {
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(products);
    });
});

// GET un produit (public)
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        res.json(product);
    });
});

// CREATE produit (admin only)
router.post('/', verifyToken, verifyAdmin, (req, res) => {
    const { name, price, description, image, category, stock } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Nom et prix requis' });
    }

    db.run(
        'INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, description || '', image || '', category || 'Autre', stock || 0],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la création' });
            }
            res.json({
                id: this.lastID,
                message: 'Produit créé avec succès'
            });
        }
    );
});

// UPDATE produit (admin only)
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
    const { name, price, description, image, category, stock } = req.body;
    const id = req.params.id;

    if (!name || !price) {
        return res.status(400).json({ error: 'Nom et prix requis' });
    }

    db.run(
        'UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, stock = ? WHERE id = ?',
        [name, price, description || '', image || '', category || 'Autre', stock || 0, id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la modification' });
            }
            res.json({ message: 'Produit mis à jour avec succès' });
        }
    );
});

// DELETE produit (admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
        res.json({ message: 'Produit supprimé avec succès' });
    });
});

module.exports = router;
