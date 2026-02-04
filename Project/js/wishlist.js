function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    if (confirm('Logout now?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

function showToast(msg) {
    document.getElementById('toast-msg').innerText = msg;
    new bootstrap.Toast(document.getElementById('toast')).show();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('carts') || '[]');
    document.getElementById('cart-nav').innerText = `Cart (${cart.length})`;
}

function loadWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const container = document.getElementById('wishlist-container');
    container.innerHTML = '';

    if (!wishlist.length) {
        container.innerHTML = `<div class="text-center text-muted fs-5">No items in wishlist ??</div>`;
        return;
    }

    wishlist.forEach(product => {
        const col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML = `
        <div class="card shadow-sm">
            <img src="${product.image}" class="card-img-top">
            <div class="card-body d-flex flex-column">

                <h5 class="card-title text-truncate">${product.title}</h5>
                <p class="card-text text-truncate">${product.description}</p>

                <p class="fw-bold mt-auto">$${product.price}</p>
                <p class="small text-muted">Category: ${product.category}</p>

                <button class="btn btn-brand mb-2" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn btn-outline-danger" onclick="removeFromWishlist(${product.id})">Remove ??</button>

            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

function addToCart(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let cart = JSON.parse(localStorage.getItem('carts') || '[]');
    let product = wishlist.find(p => p.id === productId);

    if (!product) return;

    let existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    localStorage.setItem('carts', JSON.stringify(cart));
    updateCartCount();
    showToast("Added to cart!");
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(p => p.id !== productId);

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();
    showToast("Removed from wishlist");
}

window.onload = () => {
    if (checkAuth()) {
        initProfileMenu();
        updateCartCount();
        loadWishlist();
    }
};

