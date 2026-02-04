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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carts') || '[]');
    document.getElementById('cart-nav').innerText = `Cart (${cart.length})`;
}

let activeFeedbackProduct = null;

function getFeedbacks() {
    try {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        return Array.isArray(feedbacks) ? feedbacks : [];
    } catch {
        return [];
    }
}

function setFeedbacks(feedbacks) {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function getCurrentUsername() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return '';
    try {
        const parsed = JSON.parse(currentUser);
        if (parsed && typeof parsed === 'object') {
            return parsed.username || parsed.email || '';
        }
    } catch {
    }
    return currentUser;
}

function hasUserFeedback(productId, username) {
    const feedbacks = getFeedbacks();
    return feedbacks.some(
        (f) => String(f.productId) === String(productId) && f.username === username
    );
}

function setRating(value) {
    const stars = document.querySelectorAll('#ratingStars .rating-star');
    stars.forEach((star) => {
        const starValue = Number(star.dataset.value);
        star.classList.toggle('active', starValue <= value);
    });
    const ratingInput = document.getElementById('ratingValue');
    if (ratingInput) ratingInput.value = String(value);
}

function openFeedbackModal(product) {
    activeFeedbackProduct = product;
    document.getElementById('feedbackProductTitle').textContent = product.title || '';
    document.getElementById('feedbackProductImage').src = product.image || '';
    document.getElementById('feedbackText').value = '';
    setRating(0);

    const modal = new bootstrap.Modal(document.getElementById('addFeedbackModal'));
    modal.show();
}

function submitFeedback() {
    const username = getCurrentUsername();
    if (!username) {
        alert('Please login first');
        return;
    }
    if (!activeFeedbackProduct) {
        alert('No product selected');
        return;
    }

    const rating = Number(document.getElementById('ratingValue')?.value || 0);
    const feedbackText = document.getElementById('feedbackText').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }
    if (!feedbackText) {
        alert('Please write your feedback');
        return;
    }
    if (hasUserFeedback(activeFeedbackProduct.id, username)) {
        alert('You already submitted feedback for this product');
        return;
    }

    const feedbacks = getFeedbacks();
    feedbacks.push({
        productId: String(activeFeedbackProduct.id),
        username,
        rating,
        feedback: feedbackText,
        date: new Date().toISOString().slice(0, 10)
    });

    setFeedbacks(feedbacks);
    alert('Feedback submitted successfully');

    const modalEl = document.getElementById('addFeedbackModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    displayRequests();
}

function displayRequests() {
    const container = document.getElementById('requests-container');
    container.innerHTML = '';

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        container.innerHTML = '<div class="alert alert-warning">Please login to view your orders.</div>';
        return;
    }
    const username = getCurrentUsername();

    const requestKey = 'request_' + currentUser;
    const requests = JSON.parse(localStorage.getItem(requestKey) || '[]');

    if (requests.length === 0) {
        container.innerHTML = '<div class="alert alert-info">You have no orders yet.</div>';
        return;
    }

    requests.reverse().forEach((order, index) => {
        const orderDate = order.time || 'Unknown Date';
        const items = Array.isArray(order.items) ? order.items : [];
        let total = 0;
        let totalQuantity = 0;
        
        items.forEach(item => {
            const quantity = item.quantity || 1;
            totalQuantity += quantity;
            total += parseFloat(item.price) * quantity;
        });
        
        const status = order.status || 'pending';

        let statusClass = 'bg-warning';
        let statusText = 'Pending';
        if (status === 'accepted') {
            statusClass = 'bg-success';
            statusText = 'Accepted';
        } else if (status === 'rejected') {
            statusClass = 'bg-danger';
            statusText = 'Rejected';
        }

        const orderCard = document.createElement('div');
        orderCard.className = 'card order-card mb-4';
        
        const itemsDetailHTML = items.map(item => {
            const quantity = item.quantity || 1;
            return `
                        <div class="mb-2 p-2 border-bottom">
                            <div class="d-flex justify-content-between">
                                <small>${item.title.substring(0, 25)}...</small>
                                <small class="fw-bold">x${quantity}</small>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">$${parseFloat(item.price).toFixed(2)}</small>
                                <small class="text-success">$${(parseFloat(item.price) * quantity).toFixed(2)}</small>
                            </div>
                        </div>
                    `;
        }).join('');
        
        orderCard.innerHTML = `
                    <div class="card-header order-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Order #${requests.length - index} - ${orderDate}</h5>
                        <span class="badge ${statusClass} status-badge">${statusText}</span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="mb-3">Items in Order</h6>
                                <div>
                                    ${items.map(item => `
                                        <div class="d-flex align-items-center mb-2 p-2 border rounded bg-white">
                                            <img src="${item.image}" class="item-thumb" title="${item.title}" alt="${item.title}" style="width: 60px; height: 60px; margin-right: 10px;">
                                            <div>
                                                <small class="d-block fw-bold">${item.title.substring(0, 25)}...</small>
                                                <small class="d-block text-muted">Quantity: ${item.quantity || 1}</small>
                                                ${status === 'accepted' && !hasUserFeedback(item.id, username) ? `
                                                    <button class="btn btn-sm btn-outline-primary mt-2 add-feedback-btn"
                                                        data-product-id="${item.id}"
                                                        data-product-title="${item.title.replace(/"/g, '&quot;')}"
                                                        data-product-image="${item.image}">
                                                        Add Feedback
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card order-summary p-3">
                                    <h6 class="mb-2" style="font-size: 0.95rem;">Order Summary</h6>
                                    <div class="mb-1">
                                        <small class="d-flex justify-content-between" style="font-size: 0.8rem;">
                                            <span>Total Items:</span>
                                            <strong>${totalQuantity}</strong>
                                        </small>
                                    </div>
                                    <div class="mb-2 p-1 border rounded" style="max-height: 180px; overflow-y: auto;">
                                        ${itemsDetailHTML}
                                    </div>
                                    <hr style="margin: 0.5rem 0;">
                                    <div class="fw-bold d-flex justify-content-between" style="font-size: 0.9rem;">
                                        <span>Total Price:</span>
                                        <span class="price-pill">$${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(orderCard);
    });
}

window.onload = () => {
    checkAuth();
    initProfileMenu();
    displayRequests();
    updateCartCount();

    const ratingStars = document.getElementById('ratingStars');
    if (ratingStars) {
        ratingStars.addEventListener('click', (event) => {
            const target = event.target.closest('.rating-star');
            if (!target) return;
            const value = Number(target.dataset.value || 0);
            setRating(value);
        });
    }

    const container = document.getElementById('requests-container');
    if (container) {
        container.addEventListener('click', (event) => {
            const btn = event.target.closest('.add-feedback-btn');
            if (!btn) return;
            const productId = btn.dataset.productId;
            const productTitle = btn.dataset.productTitle || '';
            const productImage = btn.dataset.productImage || '';
            const username = getCurrentUsername();
            if (!username) {
                alert('Please login first');
                return;
            }
            if (hasUserFeedback(productId, username)) {
                alert('You already submitted feedback for this product');
                return;
            }
            openFeedbackModal({
                id: productId,
                title: productTitle,
                image: productImage
            });
        });
    }
};

