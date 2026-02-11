function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showToast('Please login first', 'error');
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

function updateNav() {
    const cart = JSON.parse(localStorage.getItem('carts') || '[]');
    const totalQuantity = cart.length;
    document.getElementById('cart-nav').innerText = `Cart (${totalQuantity})`;
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('carts') || '[]');
    const itemsContainer = document.getElementById('cart-items');
    const totalItemsEl = document.getElementById('total-items');
    const totalPriceEl = document.getElementById('total-price');
    const itemsDetailsEl = document.getElementById('items-details');

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="text-center my-4">Your cart is empty.</p>';
        totalItemsEl.innerText = '0';
        totalPriceEl.innerText = '0.00';
        itemsDetailsEl.innerHTML = '<p class="text-center text-muted">No items</p>';
        return;
    }

    itemsContainer.innerHTML = '';
    itemsDetailsEl.innerHTML = '';
    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        totalQuantity += quantity;
        total += parseFloat(item.price) * quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item d-flex align-items-center';
        itemDiv.innerHTML = `
                    <img src="${item.image}" class="card-img-top" style="width: 80px;" alt="${item.title}">
                    <div class="ms-3 flex-grow-1">
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">$${parseFloat(item.price).toFixed(2)}</small>
                        <div >
                            <img src="images/minus.png" class="img-fluid qty-btn" alt="Minus" style="cursor:pointer; width:32px; height:32px;" onclick="decreaseQuantity(${index})">
                            <span class="mx-2" id="item-quantity-${index}">${quantity}</span>
                            <img src="images/plus.png" class="img-fluid qty-btn" alt="Plus" style="cursor:pointer; width:28px; height:28px;" onclick="increaseQuantity(${index})">
                        </div>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button>
                `;
        itemsContainer.appendChild(itemDiv);

        const detailDiv = document.createElement('div');
        detailDiv.className = 'mb-2 p-2 border-bottom';
        detailDiv.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <small>${item.title.substring(0, 20)}...</small>
                        <small class="fw-bold">x${quantity}</small>
                    </div>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">$${parseFloat(item.price).toFixed(2)}</small>
                        <small class="text-success">$${(parseFloat(item.price) * quantity).toFixed(2)}</small>
                    </div>
                `;
        itemsDetailsEl.appendChild(detailDiv);
    });

    totalItemsEl.innerText = totalQuantity;
    totalPriceEl.innerText = total.toFixed(2);
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('carts') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('carts', JSON.stringify(cart));
    displayCart();
    updateNav();
}

function increaseQuantity(index) {
    const quantityEl = document.getElementById(`item-quantity-${index}`);
    let productQ = parseInt(quantityEl.innerText);
    if (JSON.parse(localStorage.getItem('carts') || '[]')[index].stock > productQ){
    productQ++;
    quantityEl.innerText = productQ;
    let cart = JSON.parse(localStorage.getItem('carts') || '[]');
    cart[index]["quantity"] = productQ;
    localStorage.setItem('carts', JSON.stringify(cart));
    displayCart();
    updateNav();
    showToast("Quantity updated", "success");
    }
    else {
        showToast("Not enough quantity available", "error");
    }
}
function decreaseQuantity(index) {
    let productQ = JSON.parse(localStorage.getItem('carts') || '[]')[index]["quantity"] || 1;
    const quantityEl = document.getElementById(`item-quantity-${index}`);
    let quantity = parseInt(quantityEl.innerText);
    if (quantity > 1) {
        quantity--;
        quantityEl.innerText = quantity;
        let cart = JSON.parse(localStorage.getItem('carts') || '[]');
        cart[index]["quantity"] = quantity;
        localStorage.setItem('carts', JSON.stringify(cart));
        displayCart();
        updateNav();
    }
}

function clearCart() {
  document.getElementById("clearCartModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("clearCartModal").style.display = "none";
}

function confirmClearCart() {
  localStorage.setItem('carts', '[]');
  displayCart();
  updateNav();
  closeModal();
}


function checkout() {
    const cart = JSON.parse(localStorage.getItem('carts') || '[]');
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    const currentUser = localStorage.getItem('currentUser') || 'guest';
    const requestKey = "request_" + currentUser;
    const existingRequests = JSON.parse(localStorage.getItem(requestKey) || '[]');
    
    const newOrder = {
        time: new Date().toLocaleString(),
        items: cart,
        status: 'pending'
    };
    
    existingRequests.push(newOrder);
    localStorage.setItem(requestKey, JSON.stringify(existingRequests));
    
    localStorage.setItem('checkout', JSON.stringify(cart));
    showToast('Order placed successfully! Thank you', 'success');
    localStorage.setItem('carts', '[]');
    setTimeout(() => window.location.href = 'Paypal.html', 1500);
}

window.onload = () => {
    checkAuth();
    initProfileMenu();
    displayCart();
    updateNav();
};



