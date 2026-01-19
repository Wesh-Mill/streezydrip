const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", this.window.scrollY > 0);
})

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ownerUsername = 'its_weshmill';
    const ownerPassword = 'Wesh0404Mill';
    if (username === ownerUsername && password === ownerPassword) {
        alert('Login successful! Welcome, ' + username + '!');
        localStorage.setItem('isOwner', "true");
        window.location.href = 'add-product.html';
    } else {
        alert("Access denied!");
    }
    return false;
}

// Menu hamburger
let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.navmenu');
if (menu) {
    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navmenu.classList.toggle('open');
    }
}

// Barre de recherche
function toggleSearchBar(event) {
    if (event) event.preventDefault();
    const bar = document.getElementById('search-bar');
    bar.style.display = (bar.style.display === 'none') ? 'block' : 'none';
}

function searchProduct() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const rows = document.querySelectorAll('.Products .row');

    rows.forEach(row => {
        const productNameEl = row.querySelector('.price h4');
        const productName = productNameEl ? productNameEl.textContent.toLowerCase() : '';
        // affiche ou cache chaque produit
        row.style.display = productName.includes(input) ? 'block' : 'none';
    });

    // si besoin, scroll vers la section produits
    if (input.length > 0) {
        document.getElementById('trending').scrollIntoView({ behavior: 'smooth' });
    }
}

// Panel Profil
function toggleProfilePanel() {
    const bar = document.getElementById('profile-panel');
    const user = localStorage.getItem('user');
    if (bar.style.display === 'block') {
        bar.style.display = 'none';
    } else {
        if (user) {
            bar.style.display = 'block';
        } else {
            alert("Connecte-toi d'abord !");
        }
    }
    return false;
}

function closeProfileContent() {
    const profilePanel = document.getElementById('profile-panel');
    if (profilePanel) {
        profilePanel.style.display = 'none';
    }
    return false;
}

// Panel Login
function toggleLoginPanel(event) {
    if (event) event.stopPropagation();
    const user = localStorage.getItem('user');
    
    // Si l'utilisateur est déjà connecté, affiche le panel profil
    if (user) {
        toggleProfilePanel();
    } else {
        // Sinon affiche le formulaire de login
        const loginPanel = document.getElementById('login-panel');
        const registerPanel = document.getElementById('register-panel');
        loginPanel.style.display = (loginPanel.style.display === 'none') ? 'block' : 'none';
        if (registerPanel) registerPanel.style.display = 'none';
    }
    return false;
}

function toggleRegisterPanel(event) {
    if (event) event.stopPropagation();
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    registerPanel.style.display = (registerPanel.style.display === 'none') ? 'block' : 'none';
    if (loginPanel) loginPanel.style.display = 'none';
    return false;
}

// Soumettre le formulaire de login
async function submitLogin(event) {
    if (event) event.stopPropagation();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');

    error.textContent = '';

    if (!email || !password) {
        error.textContent = 'Email et mot de passe requis';
        return;
    }

    // Vérifier d'abord si c'est un admin
    const isAdmin = await loginAdmin(email, password);
    
    if (isAdmin) {
        // C'est un admin!
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        
        // Afficher l'interface admin après 500ms
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 500);
        return;
    }

    // Sinon, essayer de connecter comme client normal
    const success = await loginUser(email, password);
    if (success) {
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    }
}

// Soumettre le formulaire d'inscription
async function submitRegister(event) {
    if (event) event.stopPropagation();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('register-confirm-password').value.trim();
    const error = document.getElementById('register-error');

    error.textContent = '';

    if (!username || !email || !password || !confirmPassword) {
        error.textContent = 'Tous les champs sont requis';
        return;
    }

    const success = await registerUser(username, email, password, confirmPassword);
    if (success) {
        // Vider les champs
        document.getElementById('register-username').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-confirm-password').value = '';
        
        // Fermer le panel d'inscription et afficher le panel de login
        document.getElementById('register-panel').style.display = 'none';
        document.getElementById('login-panel').style.display = 'block';
    }
}

function showProfile(user) {
    if (typeof user === 'string') {
        // Ancien format
        document.getElementById('profile-panel').style.display = 'block';
        document.querySelector('.user-info h3').textContent = user;
    } else {
        // Nouveau format avec objet utilisateur
        document.getElementById('profile-panel').style.display = 'block';
        document.querySelector('.user-info h3').textContent = user.username;
        // Afficher les commandes
        displayUserOrders();
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.getElementById('profile-panel').style.display = 'none';
    alert("Vous avez été déconnecté !");
    window.location.reload();
}

// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCartPanel() {
    const panel = document.getElementById('cart-panel');
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    displayCart();
    return false;
}

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge(); // Met à jour le badge
}

function displayCart() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        // Extrait le premier prix de la plage (ex: "$99 - $129" → 99)
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        
        itemsDiv.innerHTML += `
            <div>
                ${item.name} - $${item.price}
                <button onclick="removeFromCart(${index}); event.stopPropagation();" style="display:inline-block; margin-top:10px; margin-left:10px; background:red; background-size: 20px; color:white; padding:0px 0px; border:none; border-radius:5px; cursor:pointer; margin-left:8px; font-weight:bold; font-size:13px; white-space:nowrap; line-height:1.5;">Supprimer</button>
            </div>
        `;
        total += isNaN(priceValue) ? 0 : priceValue;
    });
    
    // Calcul et affichage du total
    document.getElementById('cart-total').textContent = "Total : $" + total.toFixed(2);
    updateCartBadge(); // Met à jour le badge
}

// Fonction pour mettre à jour le badge du panier
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    badge.textContent = cart.length;
    
    // Cache le badge si le panier est vide
    if (cart.length === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge(); // Met à jour le badge
}

function checkoutCart() {
    if(cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    alert("Paiement fictif : Merci pour votre commande !");
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Modal de Paiement
function showPaymentModal() {
    if(cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    
    // Calcule le total en extrayant le prix numérique
    let total = cart.reduce((sum, item) => {
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        return sum + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
    
    // Affiche le total dans le modal
    document.getElementById('payment-total').textContent = "Total à payer : $" + total.toFixed(2);
    document.getElementById('payment-modal').style.display = 'flex';
    toggleCartPanel(); // Ferme le panier
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function payWithEdinar() {
    let total = cart.reduce((sum, item) => {
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        return sum + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
    
    const cartDetails = cart.map(item => {
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        return `${item.name} - $${isNaN(priceValue) ? item.price : priceValue.toFixed(2)}`;
    }).join('\n');
    
    const message = encodeURIComponent(
        "Bonjour, je voudrais payer ma commande de $" + total.toFixed(2) + " avec Edinar.\n\n" +
        "Détails de la commande:\n" + cartDetails
    );
    
    // Créer la commande dans la base de données
    const token = localStorage.getItem('token');
    if (token) {
        createOrder(total, 'Edinar', cart);
    }
    
    // Redirection vers WhatsApp pour le paiement Edinar
    window.location.href = "https://wa.me/22397290271?text=" + message;
    
    // Vider le panier après
    setTimeout(() => {
        alert("Merci pour votre paiement Edinar !");
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        closePaymentModal();
        updateCartBadge();
    }, 1000);
}

function payWithOrangeMoney() {
    let total = cart.reduce((sum, item) => {
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        return sum + (isNaN(priceValue) ? 0 : priceValue);
    }, 0);
    
    const cartDetails = cart.map(item => {
        const priceValue = parseFloat(item.price.toString().replace(/[^\d.-]/g, '').split('-')[0]);
        return `${item.name} - $${isNaN(priceValue) ? item.price : priceValue.toFixed(2)}`;
    }).join('\n');
    
    const message = encodeURIComponent(
        "Bonjour, je voudrais payer ma commande de $" + total.toFixed(2) + " avec Orange Money.\n\n" +
        "Détails de la commande:\n" + cartDetails
    );
    
    // Créer la commande dans la base de données
    const token = localStorage.getItem('token');
    if (token) {
        createOrder(total, 'Orange Money', cart);
    }
    
    // Redirection vers WhatsApp pour le paiement Orange Money
    window.location.href = "https://wa.me/22397290271?text=" + message;
    
    // Vider le panier après
    setTimeout(() => {
        alert("Merci pour votre paiement Orange Money !");
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        closePaymentModal();
        updateCartBadge();
    }, 1000);
}

// Modal Produit
function showProductModal(imgSrc, title, price) {
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-price').textContent = price;
    const siteUrl = window.location.origin;
    const imageUrl = imgSrc.startsWith('http') ? imgSrc : siteUrl + '/' + imgSrc.replace('./', '');
    const message = encodeURIComponent(
        "Salut, je veux ce produit : " + title + " (" + price + ")\n" +
        "Photo : " + imageUrl
    );
    document.getElementById('modal-whatsapp').href = "https://wa.me/22397290271?text=" + message;
    document.getElementById('product-modal').style.display = 'flex';

    const addCartBtn = document.getElementById('modal-add-cart');
    addCartBtn.replaceWith(addCartBtn.cloneNode(true));
    const newAddCartBtn = document.getElementById('modal-add-cart');
    newAddCartBtn.onclick = function(e) {
        e.preventDefault();
        addToCart(title, price);
        closeProductModal();
    };
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Ferme le modal si on clique en dehors du contenu
if (document.getElementById('product-modal')) {
    document.getElementById('product-modal').addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });
}

function showContactModal() {
    document.getElementById('modal-whatsapp').href = "https://wa.me/22397290271?text=Salut";
    document.getElementById('modal-instagram').href = "https://www.instagram.com/its_weshmill/";
    document.getElementById('modal-snapchat').href = "https://www.snapchat.com/add/its_weshmill";
    document.getElementById('modal-facebook').href = "https://www.facebook.com/itsweshmill";
    document.getElementById('contact-modal').style.display = 'flex';
}

// Ferme les panneaux quand on clique en dehors (SAUF sur les boutons d'ouverture)
document.addEventListener('click', function(event) {
    const profilePanel = document.getElementById('profile-panel');
    const profileContainer = document.querySelector('.profile-container');
    const loginPanel = document.getElementById('login-panel');
    const cartPanel = document.getElementById('cart-panel');
    
    // Vérifie si on clique sur un bouton d'ouverture
    const clickedElement = event.target;
    const isOnProfileButton = clickedElement.closest('[onclick*="toggleProfilePanel"]');
    const isOnLoginButton = clickedElement.closest('[onclick*="toggleLoginPanel"]');
    const isOnCartButton = clickedElement.closest('[onclick*="toggleCartPanel"]');

    // Ferme le panel profil si on clique ailleurs
    if (profilePanel && profilePanel.style.display === 'block' && !isOnProfileButton) {
        if (!profileContainer || !profileContainer.contains(clickedElement)) {
            profilePanel.style.display = 'none';
        }
    }

    // Ferme le panel login si on clique ailleurs
    if (loginPanel && loginPanel.style.display === 'block' && !isOnLoginButton) {
        if (!loginPanel.contains(clickedElement)) {
            loginPanel.style.display = 'none';
        }
    }

    // Ferme le panier si on clique ailleurs
    if (cartPanel && cartPanel.style.display === 'block' && !isOnCartButton) {
        if (!cartPanel.contains(clickedElement)) {
            cartPanel.style.display = 'none';
        }
    }
});

window.onload = async function() {
    // Vérifier les token JWT
    const token = localStorage.getItem('token');
    if (token) {
        const user = await verifyToken();
        if (user) {
            showProfile(user);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    } else {
        // Compatibilité avec l'ancien système
        const user = localStorage.getItem('user');
        if (user) showProfile(user);
    }
    
    updateCartBadge(); // Met à jour le badge au chargement
    
    // Charger les produits depuis la base de données
    await loadProducts();
}

// ===== CHARGER PRODUITS DYNAMIQUEMENT =====
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const container = document.getElementById('products-container');
        if (!container) return;
        
        container.innerHTML = ''; // Vider le conteneur
        
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1/-1;">Aucun produit disponible pour le moment.</p>';
            return;
        }
        
        // Créer une ligne HTML pour chaque produit
        products.forEach(product => {
            const productHTML = `
                <div class="row">
                    <a href="#" onclick="showProductModal('${product.image || './public/image/1.jpg'}', '${product.name}', '${product.price}'); return false;">
                        <img src="${product.image || './public/image/1.jpg'}" alt="${product.name}" onerror="this.src='./public/image/1.jpg'">
                    </a>
                    <div class="Products-text">
                        <h5>${product.category || 'Nouveau'}</h5>
                        <a href="#" class="btn" onclick="addToCart('${product.name}', '${product.price}'); return false;">Add to Cart</a>
                    </div>
                    <div class="heart-icon">
                        <i class='bx bx-heart'></i>
                    </div>
                    <div class="ratting">
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star'></i>
                        <i class='bx bxs-star-half'></i>
                    </div>
                    <div class="price">
                        <h4>${product.name}</h4>
                        <p>${product.price} TND</p>
                    </div>
                </div>
            `;
            container.innerHTML += productHTML;
        });
    } catch (error) {
        console.error('Erreur chargement produits:', error);
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1/-1;">Erreur du chargement des produits.</p>';
        }
    }
}
