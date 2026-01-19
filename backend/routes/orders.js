const express = require('express');
const db = require('../database');
const { verifyToken } = require('../middleware');

const router = express.Router();

// Créer une commande
router.post('/create', verifyToken, (req, res) => {
    const { total, paymentMethod, products } = req.body;
    const userId = req.user.id;

    if (!total || !paymentMethod || !products) {
        return res.status(400).json({ message: 'Données manquantes' });
    }

    db.run(
        'INSERT INTO orders (user_id, total, payment_method, products) VALUES (?, ?, ?, ?)',
        [userId, total, paymentMethod, JSON.stringify(products)],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la création de la commande' });
            }

            res.status(201).json({
                message: 'Commande créée avec succès',
                orderId: this.lastID
            });
        }
    );
});

// Récupérer les commandes d'un utilisateur
router.get('/my-orders', verifyToken, (req, res) => {
    const userId = req.user.id;

    db.all(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, orders) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
            }

            // Parser les produits
            const parsedOrders = orders.map(order => ({
                ...order,
                products: JSON.parse(order.products)
            }));

            res.json(parsedOrders);
        }
    );
});

// Récupérer TOUTES les commandes (admin only)
router.get('/all', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }

    db.all(
        'SELECT * FROM orders ORDER BY created_at DESC',
        (err, orders) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
            }

            res.json(orders);
        }
    );
});

module.exports = router;
