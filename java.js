const header = document.Selector("header");

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

menu.onlick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
}