const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, 'streezydrip.db');
const db = new sqlite3.Database(dbPath);

console.log('Initialisation de la base de données...');

// Créer les tables
db.serialize(() => {
    // Table users
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur users:', err);
        else console.log('✅ Table users créée');
    });

    // Table orders
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL,
            payment_method TEXT NOT NULL,
            products TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error('Erreur orders:', err);
        else console.log('✅ Table orders créée');
    });

    // Table admins
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur admins:', err);
        else console.log('✅ Table admins créée');
    });

    // Table products
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT,
            stock INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erreur products:', err);
        else console.log('✅ Table products créée');
    });
});

// Initialiser l'admin
setTimeout(() => {
    const adminEmail = 'admin@streezydrip.com';
    const adminPassword = 'Admin123456!';
    const hashedPassword = bcryptjs.hashSync(adminPassword, 10);

    db.get('SELECT * FROM admins WHERE email = ?', [adminEmail], (err, admin) => {
        if (!admin) {
            db.run(
                'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
                [adminEmail, hashedPassword, 'Admin Streezy Drip'],
                (err) => {
                    if (err) console.error('Erreur création admin:', err);
                    else console.log('✅ Admin créé: admin@streezydrip.com / Admin123456!');
                }
            );
        } else {
            console.log('✅ Admin existe déjà');
        }
    });
}, 500);

// Initialiser les produits
setTimeout(() => {
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

    db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
        if (err || result.count === 0) {
            products.forEach((product, index) => {
                db.run(
                    'INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
                    [product.name, product.price, product.description, product.image, product.category, product.stock],
                    (err) => {
                        if (err) console.error(`Erreur produit ${index}:`, err);
                        else console.log(`✅ Produit créé: ${product.name}`);
                    }
                );
            });
        } else {
            console.log('✅ Produits existent déjà');
        }
    });
}, 1000);

// Fermer la connexion après 3 secondes
setTimeout(() => {
    db.close();
    console.log('\n✅ Initialisation terminée!');
}, 3000);
