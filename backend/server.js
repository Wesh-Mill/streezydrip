require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcryptjs = require('bcryptjs');
const db = require('./database');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (uploads)
app.use('/public', express.static(path.join(__dirname, '../public')));

// Initialiser l'admin au démarrage
function initializeAdminAccount() {
    const adminEmail = 'admin@streezydrip.com';
    const adminPassword = 'Admin123456!';
    const hashedPassword = bcryptjs.hashSync(adminPassword, 10);

    // Vérifier si l'admin existe
    db.get('SELECT * FROM admins WHERE email = ?', [adminEmail], (err, admin) => {
        if (err) {
            console.error('Erreur:', err);
            return;
        }

        if (!admin) {
            // Créer l'admin
            db.run(
                'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
                [adminEmail, hashedPassword, 'Admin Streezy Drip'],
                (err) => {
                    if (err) {
                        console.error('Erreur création admin:', err);
                    } else {
                        console.log('✅ Admin créé: admin@streezydrip.com / Admin123456!');
                    }
                }
            );
        } else {
            console.log('✅ Admin existe déjà');
        }
    });
}

// Initialiser les produits au démarrage
function initializeProducts() {
    const products = [
        { name: 'Half Running Set', price: 99, category: 'Vêtements', description: 'Ensemble de running demi-complet', image: '/public/image/1.jpg', stock: 50 },
        { name: 'ZEINAB', price: 99, category: 'Vêtements', description: 'Collection ZEINAB premium', image: '/public/image/2.jpg', stock: 50 },
        { name: 'Half Set', price: 99, category: 'Vêtements', description: 'Ensemble demi-complet', image: '/public/image/3.jpg', stock: 50 },
        { name: 'Innocent_0.5', price: 99, category: 'Vêtements', description: 'Collection Innocent', image: '/public/image/4.jpg', stock: 50 },
        { name: 'Wesh Mill', price: 99, category: 'Vêtements', description: 'Collection Wesh Mill', image: '/public/image/5.jpg', stock: 50 },
        { name: 'Binta Dollars', price: 99, category: 'Vêtements', description: 'Binta Dollars exclusive', image: '/public/image/6.jpg', stock: 50 },
        { name: 'Lola', price: 99, category: 'Vêtements', description: 'Collection Lola', image: '/public/image/7.jpg', stock: 50 },
        { name: 'La Reine', price: 99, category: 'Vêtements', description: 'Collection La Reine', image: '/public/image/8.jpg', stock: 50 }
    ];

    // Vérifier si les produits existent
    db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
        if (err || result.count === 0) {
            console.log('Initialisation des produits...');
            products.forEach((product) => {
                db.run(
                    'INSERT OR IGNORE INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
                    [product.name, product.price, product.description, product.image, product.category, product.stock],
                    (err) => {
                        if (err) console.error(`Erreur produit ${product.name}:`, err);
                    }
                );
            });
            console.log('✅ Produits initialisés');
        } else {
            console.log(`✅ ${result.count} produits trouvés`);
        }
    });
}

// Initialiser au démarrage après 500ms (laisser le temps à la DB de se connecter)
setTimeout(() => {
    initializeAdminAccount();
    initializeProducts();
}, 500);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Routes de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Serveur Streezy Drip est actif!' });
});

// Gérer les erreurs CORS
app.options('*', cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur Streezy Drip lancé sur http://localhost:${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
