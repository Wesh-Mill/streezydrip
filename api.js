// Configuration de l'API - Modifiez cette URL selon votre environnement
let API_URL = 'http://localhost:5000/api';

// Détecte automatiquement si on est en production ou local
function initializeAPI() {
    // Sur localhost ou 127.0.0.1 → utiliser localhost:5000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_URL = 'http://localhost:5000/api';
    } 
    // Sur un téléphone/réseau local → utiliser l'adresse IP du PC
    // À personnaliser avec votre adresse IP locale (ex: 192.168.x.x)
    else if (window.location.hostname.includes('github.io')) {
        // En production sur GitHub - à configurer avec votre backend distant
        // API_URL = 'https://votre-backend-heroku.herokuapp.com/api';
        console.warn('Backend non configuré pour GitHub Pages. Utilisation du mode hors ligne.');
    }
    else {
        // Sur un réseau local avec IP
        API_URL = `http://${window.location.hostname}:5000/api`;
    }
    
    console.log('API URL:', API_URL);
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', initializeAPI);

// ===== AUTHENTIFICATION =====

// Inscription
async function registerUser(username, email, password, confirmPassword) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, confirmPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return false;
        }

        alert(data.message);
        return true;
    } catch (error) {
        alert('Erreur de connexion au serveur');
        console.error('Erreur:', error);
        return false;
    }
}

// Connexion
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return false;
        }

        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(data.message);
        window.location.reload(); // Rafraîchir la page
        return true;
    } catch (error) {
        alert('Erreur de connexion au serveur');
        console.error('Erreur:', error);
        return false;
    }
}

// Déconnexion
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Vous avez été déconnecté');
    window.location.reload();
}

// Vérifier le token
async function verifyToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.valid) {
            return data.user;
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    } catch (error) {
        console.error('Erreur de vérification:', error);
        return null;
    }
}

// ===== COMMANDES =====

// Créer une commande
async function createOrder(total, paymentMethod, products) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Vous devez être connecté');
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ total, paymentMethod, products })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return false;
        }

        alert(data.message);
        return true;
    } catch (error) {
        alert('Erreur lors de la création de la commande');
        console.error('Erreur:', error);
        return false;
    }
}

// Récupérer les commandes de l'utilisateur
async function getUserOrders() {
    const token = localStorage.getItem('token');

    if (!token) {
        return [];
    }

    try {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Afficher les commandes dans le profil
async function displayUserOrders() {
    const orders = await getUserOrders();
    const ordersDiv = document.getElementById('orders');

    if (!ordersDiv) return;

    if (orders.length === 0) {
        ordersDiv.innerHTML = '<p>Vous n\'avez pas encore de commande.</p>';
        return;
    }

    ordersDiv.innerHTML = '<h2>Mes commandes</h2>';
    orders.forEach(order => {
        ordersDiv.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; margin:10px 0; border-radius:5px;">
                <p><strong>Commande #${order.id}</strong></p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p>Paiement: ${order.payment_method}</p>
                <p>Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
        `;
    });
}

// ===== ADMIN =====

// Login Admin
async function loginAdmin(email, password) {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Erreur de connexion');
            return false;
        }

        // Sauvegarder le token admin
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        
        return true;
    } catch (error) {
        alert('Erreur de connexion au serveur');
        console.error('Erreur:', error);
        return false;
    }
}

// Vérifier si c'est un admin
async function verifyAdmin() {
    const token = localStorage.getItem('admin_token');

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/admin/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.admin;
        } else {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin');
            return null;
        }
    } catch (error) {
        console.error('Erreur de vérification admin:', error);
        return null;
    }
}

// Logout Admin
function logoutAdmin() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    window.location.reload();
}
