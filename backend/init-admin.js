const bcryptjs = require('bcryptjs');
const db = require('./database');

// Créer un utilisateur admin avec de nouveaux identifiants
const adminEmail = 'wesh@admin.tn';
const adminPassword = 'WeshMill2025';
const adminUsername = 'weshmill';

const hashedPassword = bcryptjs.hashSync(adminPassword, 10);

db.run(
    `INSERT OR REPLACE INTO users (username, email, password, is_admin) 
     VALUES (?, ?, ?, 1)`,
    [adminUsername, adminEmail, hashedPassword],
    (err) => {
        if (err) {
            console.error('Erreur:', err);
        } else {
            console.log('\n✅ Admin créé avec succès!\n');
            console.log('📌 Nouveaux identifiants admin:');
            console.log('   Email:', adminEmail);
            console.log('   Mot de passe:', adminPassword);
            console.log('\n⚠️  Changez le mot de passe après la première connexion!\n');
        }
        process.exit(0);
    }
);
