const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'streezydrip.db');
const db = new sqlite3.Database(dbPath);

// Ton email et mot de passe
const adminEmail = 'admin@streezydrip.com';
const adminPassword = 'Admin123456!';

// Hasher le mot de passe
const hashedPassword = bcryptjs.hashSync(adminPassword, 10);

// Insérer l'admin
db.run(
    'INSERT OR REPLACE INTO admins (email, password, name) VALUES (?, ?, ?)',
    [adminEmail, hashedPassword, 'Wesh Mill'],
    (err) => {
        if (err) {
            console.error('Erreur:', err);
        } else {
            console.log('✅ Admin créé avec succès!');
            console.log(`Email: ${adminEmail}`);
            console.log(`Mot de passe: ${adminPassword}`);
        }
        db.close();
    }
);
