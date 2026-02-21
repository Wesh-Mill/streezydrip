// ==========================================
// CONFIGURATION POUR L'API STREEZY DRIP
// ==========================================

// LOCAL DEVELOPMENT
// ==========================================
// Si tu accèdes au site sur ton PC :
// - http://localhost/path/to/site → Backend sur localhost:5000 ✅
// - http://127.0.0.1/path/to/site → Backend sur localhost:5000 ✅

// RÉSEAU LOCAL (Téléphone sur même WiFi)
// ==========================================
// 1. Trouve l'IP de ton PC:
//    Windows: ouvre CMD et tape "ipconfig"
//    Cherche "IPv4 Address" (ex: 192.168.1.100)
//
// 2. Accède depuis téléphone:
//    http://192.168.1.100/path/to/site ✅
//    (Le backend doit être lancé sur le PC)

// PRODUCTION (GitHub Pages)
// ==========================================
// Option 1: Héberger le backend sur un serveur cloud
//   - Heroku (gratuit avec limitations)
//   - Vercel
//   - Railway
//   - Render
//
// Option 2: Utiliser Firebase ou Supabase

// ==========================================
// POUR FAIRE FONCTIONNER SUR TON TÉLÉPHONE
// ==========================================

// SOLUTION 1: Trouvez l'IP locale de votre PC
// 1. Windows: ouvre Terminal/CMD
// 2. Tape: ipconfig
// 3. Cherche "IPv4 Address" 
// 4. Exemple: 192.168.1.100
// 5. Remplace dans api.js: API_URL = 'http://192.168.1.100:5000/api'

// SOLUTION 2: Utilisez un service comme ngrok
// 1. Télécharge ngrok: https://ngrok.com/
// 2. Lance ton backend: npm start (sur port 5000)
// 3. Lance ngrok: ngrok http 5000
// 4. Tu obtiendras une URL publique: https://xxx-xxx.ngrok.io
// 5. Utilise cette URL dans api.js

// SOLUTION 3: Déploie le backend sur un serveur cloud
// Voir les instructions dans README.md

// ==========================================
// EN CAS DE PROBLÈME
// ==========================================
// 1. Ouvre la console (F12 sur PC, Ctrl+Shift+I sur mobile Chrome)
// 2. Cherche le message d'erreur
// 3. Vérifie que le backend tourne: npm start
// 4. Vérifie que tu accèdes avec la bonne adresse IP

console.log('%c📱 Configuration API Streezy Drip', 'font-size: 14px; color: #25D366; font-weight: bold;');
console.log('%cVoir config.md pour les instructions', 'color: #999;');
