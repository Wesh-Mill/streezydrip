let API_URL = '';
let ADMIN_TOKEN = '';

// Initialize API URL
function initializeAPI() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_URL = 'http://localhost:5000/api';
    } else {
        API_URL = `http://${window.location.hostname}:5000/api`;
    }
    console.log('API URL:', API_URL);
}

// Check if admin is logged in
window.onload = () => {
    initializeAPI();
    const token = localStorage.getItem('admin_token');
    
    if (token) {
        ADMIN_TOKEN = token;
        document.getElementById('admin-section').style.display = 'flex';
        document.getElementById('login-section').style.display = 'none';
        loadDashboard();
        loadProducts();
        loadOrders();
        loadUsers();
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('admin-section').style.display = 'none';
    }
};

// Admin Login
document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert('❌ ' + (data.error || 'Erreur de connexion'));
            return;
        }
        
        // Save token and reload
        localStorage.setItem('admin_token', data.token);
        ADMIN_TOKEN = data.token;
        
        alert('✅ Connexion réussie!');
        location.reload();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion');
    }
});

// Logout Admin
function logoutAdmin() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
        localStorage.removeItem('admin_token');
        location.reload();
    }
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove active class from menu items
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to menu item
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
}

// Load Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        });
        
        const stats = await response.json();
        
        const statsGrid = document.getElementById('stats-grid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Utilisateurs</h3>
                <div class="number">${stats.totalUsers}</div>
            </div>
            <div class="stat-card">
                <h3>Commandes</h3>
                <div class="number">${stats.totalOrders}</div>
            </div>
            <div class="stat-card">
                <h3>Revenus</h3>
                <div class="number">${stats.totalRevenue.toFixed(2)} TND</div>
            </div>
            <div class="stat-card">
                <h3>Produits</h3>
                <div class="number">${stats.totalProducts}</div>
            </div>
        `;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        });
        
        const products = await response.json();
        const tbody = document.getElementById('products-tbody');
        
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price} TND</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-secondary" onclick="editProduct(${product.id})" style="padding: 5px 10px; font-size: 12px;">Modifier</button>
                    <button class="btn-danger" onclick="deleteProduct(${product.id})" style="padding: 5px 10px; font-size: 12px;">Supprimer</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Add Product
// Preview image
document.getElementById('product-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('preview-img').src = event.target.result;
            document.getElementById('preview-img').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = '';
    const imageFile = document.getElementById('product-image').files[0];
    
    // Upload l'image si fournie
    if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
            const uploadResponse = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`
                },
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (!uploadResponse.ok) {
                alert('❌ Erreur upload image: ' + (uploadData.error || 'Erreur'));
                return;
            }
            
            imageUrl = uploadData.imageUrl;
        } catch (error) {
            console.error('Erreur upload:', error);
            alert('Erreur lors de l\'upload de l\'image');
            return;
        }
    }
    
    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        description: document.getElementById('product-description').value,
        image: imageUrl
    };
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_TOKEN}`
            },
            body: JSON.stringify(product)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert('❌ ' + (data.error || 'Erreur'));
            return;
        }
        
        alert('✅ Produit ajouté avec succès!');
        document.getElementById('product-form').reset();
        document.getElementById('preview-img').style.display = 'none';
        loadProducts();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du produit');
    }
});

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        });
        
        if (response.ok) {
            alert('✅ Produit supprimé!');
            loadProducts();
        } else {
            alert('❌ Erreur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Load Orders
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/all`, {
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        });
        
        const orders = await response.json();
        const tbody = document.getElementById('orders-tbody');
        
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>User ${order.user_id}</td>
                <td>${order.total} TND</td>
                <td>${order.payment_method}</td>
                <td>${new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                <td>${order.products}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('orders-tbody').innerHTML = '<tr><td colspan="6">Erreur de chargement</td></tr>';
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/auth/all-users`, {
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        });
        
        const users = await response.json();
        const tbody = document.getElementById('users-tbody');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('users-tbody').innerHTML = '<tr><td colspan="4">Erreur de chargement</td></tr>';
    }
}

// Edit Product (placeholder)
function editProduct(id) {
    alert('Fonctionnalité à venir - Éditer produit #' + id);
}
