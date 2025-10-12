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

let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.navmenu');
menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
}

function toggleSearchBar() {
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
function toggleProfilePanel() {
    const bar = document.getElementById('profile-panel');
    // Si le profil est affiché, on le cache. Sinon, on l'affiche.
    if (bar.style.display === 'block') {
        bar.style.display = 'none';
    } else {
        // Affiche seulement si l'utilisateur est connecté
        const user = localStorage.getItem('user');
        if (user) {
            bar.style.display = 'block';
        } else {
            alert("Connecte-toi d'abord !");
        }
    }
}
function toggleLoginPanel() {
    const panel = document.getElementById('login-panel');
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
}

function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');

    // Exemple simple : utilisateur = test, mot de passe = 1234
    if (username === "weshmill" && password === "1234") {
        localStorage.setItem('user', username);
        error.textContent = "";
        alert("Connexion réussie !");
        document.getElementById('login-panel').style.display = 'none';
        showProfile(username);
    } else {
        error.textContent = "Identifiants incorrects.";
    }
}

function showProfile(username) {
    document.getElementById('profile-panel').style.display = 'block';
    document.querySelector('.user-info h3').textContent = username;
}
function logoutUser() {
    localStorage.removeItem('user');
    document.getElementById('profile-panel').style.display = 'none';
    alert("Déconnecté !");
}
window.onload = function() {
    const user = localStorage.getItem('user');
    if (user) showProfile(user);
}
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCartPanel() {
    const panel = document.getElementById('cart-panel');
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    displayCart();
}

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(productName + " ajouté au panier !");
    displayCart && displayCart(); // Met à jour le panier si la fonction existe
}

function displayCart() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        itemsDiv.innerHTML += `
            <div>
                ${item.name} - $${item.price}
                <button onclick="removeFromCart(${index})">Supprimer</button>
            </div>
        `;
        total += parseFloat(item.price);
    });
    document.getElementById('cart-total').textContent = "Total : $" + total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
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
function showProductModal(imgSrc, title, price) {
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-price').textContent = price;
    // Ajoute l'URL de l'image dans le message WhatsApp
    const siteUrl = window.location.origin;
    const imageUrl = imgSrc.startsWith('http') ? imgSrc : siteUrl + '/' + imgSrc.replace('./', '');
    const message = encodeURIComponent(
        "Salut, je veux ce produit : " + title + " (" + price + ")\n" +
        "Photo : " + imageUrl
    );
    document.getElementById('modal-whatsapp').href = "https://wa.me/22397290271?text=" + message;
    document.getElementById('product-modal').style.display = 'flex';

    // Ajoute l'action "Ajouter au panier"
    const addCartBtn = document.getElementById('modal-add-cart');
    addCartBtn.replaceWith(addCartBtn.cloneNode(true)); // retire les anciens events
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
document.getElementById('product-modal').addEventListener('click', function(e) {
    if (e.target === this) closeProductModal();
});
function showContactModal() {
    // Ajoute l'URL de l'image dans le message WhatsApp
    document.getElementById('modal-whatsapp').href = "https://wa.me/22397290271?text=" + message;
    document.getElementById('modal-instagram').href = "https://www.instagram.com/its_weshmill/";
    document.getElementById('modal-snapchat').href = "https://www.snapchat.com/add/its_weshmill";
    document.getElementById('modal-facebook').href = "https://www.facebook.com/itsweshmill";
    document.getElementById('contact-modal').style.display = 'flex';
}