// Configuration de l'API
const API_URL = 'http://localhost:5000/api';

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
