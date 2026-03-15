require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));

// Fichier de données
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel
  ? path.join(os.tmpdir(), 'streezydrip-data')
  : path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const productsFile = path.join(dataDir, 'products.json');
const usersFile = path.join(dataDir, 'users.json');
const adminsFile = path.join(dataDir, 'admins.json');

// Créer les fichiers s'ils n'existent pas
function ensureFiles() {
    if (!fs.existsSync(productsFile)) {
        const products = [
            { id: 1, name: 'Half Running Set', price: 99, category: 'Vêtements', description: 'Ensemble de running demi-complet', image: '/public/image/1.jpg', stock: 50 },
            { id: 2, name: 'ZEINAB', price: 99, category: 'Vêtements', description: 'Collection ZEINAB premium', image: '/public/image/2.jpg', stock: 50 },
            { id: 3, name: 'Half Set', price: 99, category: 'Vêtements', description: 'Ensemble demi-complet', image: '/public/image/3.jpg', stock: 50 },
            { id: 4, name: 'Innocent_0.5', price: 99, category: 'Vêtements', description: 'Collection Innocent', image: '/public/image/4.jpg', stock: 50 },
            { id: 5, name: 'Wesh Mill', price: 99, category: 'Vêtements', description: 'Collection Wesh Mill', image: '/public/image/5.jpg', stock: 50 },
            { id: 6, name: 'Binta Dollars', price: 99, category: 'Vêtements', description: 'Binta Dollars exclusive', image: '/public/image/6.jpg', stock: 50 },
            { id: 7, name: 'Lola', price: 99, category: 'Vêtements', description: 'Collection Lola', image: '/public/image/7.jpg', stock: 50 },
            { id: 8, name: 'La Reine', price: 99, category: 'Vêtements', description: 'Collection La Reine', image: '/public/image/8.jpg', stock: 50 }
        ];
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
        console.log('✅ Produits initialisés');
    }

    if (!fs.existsSync(adminsFile)) {
        const adminPassword = bcryptjs.hashSync('Admin123456!', 10);
        const admins = [
            { id: 1, email: 'admin@streezydrip.com', password: adminPassword, name: 'Admin Streezy Drip' }
        ];
        fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));
        console.log('✅ Admin créé');
    }

    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
    }
}

// Lancer l'initialisation
ensureFiles();

// ===== ROUTES PRODUITS =====
app.get('/api/products', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ===== ROUTES AUTHENTIFICATION =====
app.post('/api/auth/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
        let users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        
        if (users.some(u => u.email === email || u.username === username)) {
            return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            created_at: new Date()
        };

        users.push(newUser);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        
        res.status(201).json({ message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.TOKEN_SECRET || 'secret_key_user',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/auth/verify', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'secret_key_user', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        res.json({ valid: true, user: decoded });
    });
});

// ===== ROUTES ADMIN =====
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        const admins = JSON.parse(fs.readFileSync(adminsFile, 'utf8'));
        const admin = admins.find(a => a.email === email);

        if (!admin) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = bcryptjs.compareSync(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.TOKEN_SECRET || 'secret_key_admin',
            { expiresIn: '24h' }
        );

        res.json({ message: 'Connexion admin réussie', token, admin: { id: admin.id, email: admin.email } });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.get('/api/admin/verify', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'secret_key_admin', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        res.json({ valid: true, user: decoded });
    });
});

// ===== ROUTE TEST =====
app.get('/api/test', (req, res) => {
    res.json({ message: 'Serveur Streezy Drip est actif!' });
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`✅ Serveur Streezy Drip lancé sur port ${PORT}`);
        console.log(`📦 API disponible sur http://localhost:${PORT}/api`);
    });
}

module.exports = app;
