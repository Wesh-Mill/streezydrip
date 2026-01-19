const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'streezydrip.db');
const db = new sqlite3.Database(dbPath);

// Les produits existants du site
const products = [
    {
        name: 'Half Running Set',
        price: 99,
        description: 'Ensemble de course confortable et élégant',
        image: './public/image/1.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'ZEINAB',
        price: 99,
        description: 'Tenue stylée ZEINAB',
        image: './public/image/2.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'Half Set',
        price: 99,
        description: 'Ensemble Half Set premium',
        image: './public/image/3.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'Innocent_0.5',
        price: 99,
        description: 'Collection Innocent édition 0.5',
        image: './public/image/4.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'Wesh Mill',
        price: 99,
        description: 'Ligne Wesh Mill exclusive',
        image: './public/image/5.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'Binta Dollars',
        price: 99,
        description: 'Vêtements Binta Dollars',
        image: './public/image/6.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'Lola',
        price: 99,
        description: 'Collection Lola',
        image: './public/image/1.jpg',
        category: 'Vêtements',
        stock: 50
    },
    {
        name: 'La Reine',
        price: 99,
        description: 'La Reine - Collection royale',
        image: './public/image/2.jpg',
        category: 'Vêtements',
        stock: 50
    }
];

// Insérer les produits s'ils n'existent pas
products.forEach(product => {
    db.get(
        'SELECT * FROM products WHERE name = ?',
        [product.name],
        (err, row) => {
            if (err) {
                console.error('Erreur:', err);
                return;
            }

            if (!row) {
                // Le produit n'existe pas, l'ajouter
                db.run(
                    'INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
                    [product.name, product.price, product.description, product.image, product.category, product.stock],
                    (err) => {
                        if (err) {
                            console.error('Erreur insertion:', err);
                        } else {
                            console.log(`✅ ${product.name} ajouté`);
                        }
                    }
                );
            } else {
                console.log(`⏭️ ${product.name} existe déjà`);
            }
        }
    );
});

// Fermer la BD après 2 secondes
setTimeout(() => {
    db.close();
    console.log('✅ Initialisation terminée');
}, 2000);
