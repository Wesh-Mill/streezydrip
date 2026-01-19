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

// Initialiser l'admin après 1 seconde (laisser le temps à la DB de se connecter)
setTimeout(initializeAdminAccount, 1000);

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
