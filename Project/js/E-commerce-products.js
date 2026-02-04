


let allProducts = [];


function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showToast('Please login first', 'error');
        setTimeout(() => window.location.href = 'login.html', 1500);
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carts') || '[]');
    document.getElementById('cart-nav').innerText = `Cart (${cart.length})`;
}

function loadProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data.map(p => ({ ...p, stock: Math.floor(Math.random() * 10) + 1 }));
            localStorage.setItem('products', JSON.stringify(allProducts));
            buildCategoryFilter();
            renderProducts(allProducts);
            updateCartCount();
        })
        .catch(() => {
            document.getElementById('products-container').innerHTML = `<div class="text-danger text-center">Failed to load products</div>`;
        });
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (!products.length) {
        container.innerHTML = `<div class="text-center text-muted">No products found</div>`;
        return;
    }

    products.forEach(product => {
        const col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML = `
<div class="card shadow-sm h-100 reveal-card">
    <img src="${product.image}" class="card-img-top">
    <div class="card-body d-flex flex-column">

        <h5 class="card-title text-truncate text-dark">${product.title}</h5>
        <p class="card-text text-truncate muted">${product.description}</p>

        <div class="mt-auto">
            <div class="price-tag">$${product.price}</div>
            <span class="category-pill">#${product.category}</span>
        </div>

        <div class="card-footer-line"></div>

        <div class="d-flex align-items-center gap-2 mb-1">
            <div id="stars-${product.id}" class="d-flex"></div>
            <small class="text-muted">${product.rating.rate} (${product.rating.count})</small>
            <button class="comments-btn btn btn-outline-secondary ms-auto" onclick="showFeedback(${product.id})">
                <img src="images/comments.png" alt="Comments">
            </button>
        </div>

        <p class="small ${product.stock == 0 ? 'text-danger' : 'text-success'}">
            Quantity: ${product.stock}
        </p>

        <div class="d-flex gap-2 mt-2">
            <button class="btn btn-brand flex-grow-1" 
                onclick="addToCart(${product.id})" 
                ${product.stock == 0 ? 'disabled' : ''}>
                Add to Cart
            </button>

            <button onclick="addToWishlist(${product.id})" 
                class="btn btn-outline-danger d-flex align-items-center justify-content-center wishlist-btn">
                &#10084;
            </button>
        </div>

    </div>
</div>
`;

        container.appendChild(col);
        renderStars(product.rating.rate, `stars-${product.id}`);
    });

    const cards = container.querySelectorAll('.reveal-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 60}ms`;
        requestAnimationFrame(() => card.classList.add('is-visible'));
    });
}

function buildCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const select = document.getElementById('categoryFilter');

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function filterProducts() {
    allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const search = document.getElementById('searchBox').value.toLowerCase();
    const category = document.getElementById('categoryFilter')?.value || "All Categories";
    let filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(search) &&
        (category === "All Categories" || p.category === category)
    );

    renderProducts(filtered);
}

function renderStars(rating, containerId) {
    const starSVG = `
  <svg viewBox="0 0 24 24" width="32" height="32">
    <defs>
      <linearGradient id="grad{INDEX}-${containerId}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="gold"/>
        <stop offset="{PERCENT}%" stop-color="gold"/>
        <stop offset="{PERCENT}%" stop-color="lightgray"/>
        <stop offset="100%" stop-color="lightgray"/>
      </linearGradient>
    </defs>
    <path d="M12 .587l3.668 7.431 8.21 1.195-5.938 5.787 1.402 8.18L12 18.897l-7.342 3.863 1.402-8.18L.122 9.213l8.21-1.195z" fill="url(#grad{INDEX}-${containerId})"/>
  </svg>
  `;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let fill = Math.max(0, Math.min(1, rating - i));
        let percent = fill * 100;

        let svg = starSVG
            .replaceAll('{INDEX}', i)
            .replaceAll('{PERCENT}', percent);

        const div = document.createElement("div");
        div.classList.add("star");
        div.innerHTML = svg;

        container.appendChild(div);
    }
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let product = allProducts.find(p => p.id === productId);

    if (!wishlist.find(p => p.id === productId)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast("Added to wishlist", "success");
    } else {
        showToast("Already in wishlist","error");
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('carts') || '[]');
    let product = allProducts.find(p => p.id === productId);

    if (!product) return;

    let existingItem = cart.find(item => item.id === productId);
    if (existingItem && existingItem.stock < existingItem.quantity + 1) {
        showToast("Not enough quantity available", "error");
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
        showToast("Quantity updated in cart", "success");
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast("Added to cart", "success");
    }

    localStorage.setItem('carts', JSON.stringify(cart));
    updateCartCount();
}

function showFeedback(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductPrice').textContent = `$${product.price}`;

    const feedbacksData = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const productFeedbacks = feedbacksData.filter(f => f.productId == productId);

    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';

    if (productFeedbacks.length === 0) {
        feedbackList.innerHTML = '<p class="text-muted">No feedbacks yet</p>';
    } else {
        const renderRatingStars = (rating) => {
            if (!rating) {
                return '<span class="feedback-rating muted">No rating</span>';
            }
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += i <= rating ? '&#9733;' : '&#9734;';
            }
            return `<span class="feedback-rating">${stars}</span>`;
        };

        productFeedbacks.forEach(feedback => {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('feedback-item');
            feedbackDiv.innerHTML = `
                        <div class="feedback-username">${feedback.username}</div>
                        ${renderRatingStars(feedback.rating)}
                        <div class="feedback-text">${feedback.feedback}</div>
                        <div class="feedback-date">${feedback.date}</div>
                    `;
            feedbackList.appendChild(feedbackDiv);
        });
    }

    const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    modal.show();
}

window.onload = () => {
    if (!checkAuth()) return;
    initProfileMenu();

    if (!localStorage.getItem('products')) {
        loadProducts();
    } else {
        allProducts = JSON.parse(localStorage.getItem('products'));
        buildCategoryFilter();
        renderProducts(JSON.parse(localStorage.getItem('products')));
        updateCartCount();
    }
};

