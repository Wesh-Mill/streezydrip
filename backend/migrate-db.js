const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'streezydrip.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
});

// Vérifier et ajouter la colonne is_admin si elle n'existe pas
db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }

    const hasIsAdmin = rows.some(col => col.name === 'is_admin');
    
    if (!hasIsAdmin) {
        console.log('Ajout du champ is_admin...');
        db.run('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0', (err) => {
            if (err) {
                console.error('Erreur lors de l\'ajout:', err);
            } else {
                console.log('✅ Colonne is_admin ajoutée');
            }
            process.exit(0);
        });
    } else {
        console.log('✅ Colonne is_admin existe déjà');
        process.exit(0);
    }
});
