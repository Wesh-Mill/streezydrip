# Streezy Drip - Installation et Utilisation

## 🚀 Démarrage du Projet

### 1. Installation de Node.js
Si tu n'as pas encore Node.js installé :
- Télécharge de [nodejs.org](https://nodejs.org/)
- Installe la version LTS
- Vérifie avec : `node --version` et `npm --version`

### 2. Installation des dépendances du Backend

```bash
cd backend
npm install
```

### 3. Lancer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## 📁 Structure du Projet

```
Essay HTML/
├── index.html          # Page principale
├── java.js             # JavaScript frontend
├── style.css           # Styles CSS
├── api.js              # Fonctions d'API
├── public/             # Images et ressources
└── backend/
    ├── server.js       # Serveur Express
    ├── database.js     # Configuration SQLite
    ├── middleware.js   # Authentification JWT
    ├── package.json    # Dépendances
    ├── .env            # Variables d'environnement
    └── routes/
        ├── auth.js     # Routes d'authentification
        └── orders.js   # Routes des commandes
```

---

## 🔐 Authentification

### Inscription
1. Clique sur l'icône utilisateur
2. Clique sur "S'inscrire"
3. Remplis les champs (username, email, mot de passe)
4. Clique sur "S'inscrire"

### Connexion
1. Clique sur l'icône utilisateur
2. Rentre ton email et mot de passe
3. Clique sur "Se connecter"

### Sécurité
- Les mots de passe sont hachés avec **bcryptjs**
- Les sessions utilisent des tokens **JWT** valides 24h
- Les données sont stockées dans une base **SQLite**

---

## 🛒 Panier et Paiement

### Ajouter des produits
1. Clique sur les produits
2. Clique sur "Ajouter au panier"
3. Le badge affiche le nombre d'articles

### Passer une commande
1. Ouvre le panier
2. Clique sur "Payer"
3. Choisis ton mode de paiement :
   - **Edinar** - Message WhatsApp
   - **Orange Money** - Message WhatsApp

### Voir mes commandes
1. Connecte-toi
2. Clique sur l'icône utilisateur
3. Va dans "Mes commandes"

---

## 🔧 Variables d'Environnement

Fichier `backend/.env` :
```
PORT=5000
JWT_SECRET=wesh_mill_secret_key_super_secure_2025
NODE_ENV=development
```

---

## 📊 Base de Données

SQLite crée automatiquement :
- **users** : username, email, password hashé
- **orders** : user_id, total, payment_method, products

---

## ⚠️ Troubleshooting

### "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Serveur ne démarre pas
- Vérifie que le port 5000 est libre
- Change le PORT dans `.env` si nécessaire

### Les données ne se sauvegardent pas
- Vérifie que le serveur backend est lancé
- Ouvre la console (F12) pour voir les erreurs

---

## 🎉 C'est tout !

Ton site Streezy Drip est maintenant sécurisé avec authentification en base de données ! 

**Utilisateurs peuvent maintenant :**
- ✅ S'inscrire avec email
- ✅ Se connecter de manière sécurisée
- ✅ Voir leurs commandes
- ✅ Passer des commandes avec paiement

Bon usage ! 🚀
