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
    const input = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('.Products .row');
    rows.forEach(row => {
        const productName = row.querySelector('.price h4');
        if (productName && productName.textContent.toLowerCase().includes(input)) {
            row.style.display = 'block';
        } else {
            row.style.display = 'none';
        }
    });
    // Fait défiler vers la section produits
    document.getElementById('trending').scrollIntoView({ behavior: 'smooth' });
}