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
    bar.style.display = (bar.style.display === 'none') ? 'block' : 'none';
}
