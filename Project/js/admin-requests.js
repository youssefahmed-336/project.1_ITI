function checkAdminAuth() {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
        showToast("Please login as admin first", "error");
        window.location.href = "admin-login.html";
        return false;
    }
    document.getElementById("admin-name").textContent = `Welcome, ${adminUser}`;
    return true;
}

function logout() {
    Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('adminUser');
            window.location.href = "admin-login.html";

        }
    });

}
function displayRequests() {

    const container = document.getElementById('requests-container');
    container.innerHTML = '';

    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('request_')) {
            found = true;
            const requests = JSON.parse(localStorage.getItem(key) || '[]');

            if (requests.length === 0) continue;

            const userSection = document.createElement('div');
            userSection.className = 'mb-4';

            let requestsHtml = '';
            requests.forEach((order, index) => {
                const orderDate = order.time || 'Unknown Date';
                const items = Array.isArray(order.items) ? order.items : [];
                const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0).toFixed(2);
                const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                const status = order.status || 'pending';

                let statusBadge = '';
                if (status === 'accepted') {
                    statusBadge = '<span class="badge bg-success fs-6"><i class="fas fa-check-circle me-1"></i>Accepted</span>';
                } else if (status === 'rejected') {
                    statusBadge = '<span class="badge bg-danger fs-6"><i class="fas fa-times-circle me-1"></i>Rejected</span>';
                } else {
                    statusBadge = '<span class="badge bg-warning text-dark fs-6"><i class="fas fa-clock me-1"></i>Pending</span>';
                }

                const actions = status === 'pending' ? `
                    <button class="btn btn-success me-2" onclick="handleRequest('${key}', ${index}, 'accepted')">
                        <i class="fas fa-check me-1"></i> Accept
                    </button>
                    <button class="btn btn-danger" onclick="handleRequest('${key}', ${index}, 'rejected')">
                        <i class="fas fa-times me-1"></i> Reject
                    </button>
                ` : '<span class="text-muted fst-italic"><i class="fas fa-info-circle me-1"></i>No actions available</span>';

                let itemsListHtml = items.map(item => `
                    <div class="item-row d-flex flex-column justify-content-center align-items-center gap-2 mb-3 p-2 ">
                        <img src="${item.image}" alt="${item.title}" class="item-img " style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                        <div class="flex-grow-1">
                            <small class="text-muted">
                                ${item.size ? `<i class="fas fa-tag me-1"></i>Size: ${item.size}` : ''}
                                ${item.color ? `<span class="mx-2">•</span><i class="fas fa-palette me-1"></i>Color: ${item.color}` : ''}
                            </small>
                        </div>
                        <div class="text-center">
                            <span class="qty-badge mb-2 d-block">
                                <i class="fas fa-cubes me-1"></i>Quantity: ${item.quantity || 1}
                            </span>
                            <span class="price-tag">$${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                    </div>
                `).join('');

                requestsHtml += `
                    <div class="order-card shadow-sm mb-4">
                        <div class="order-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1"><i class="fas fa-receipt me-2"></i>Order #${index + 1}</h5>
                                <small><i class="far fa-calendar me-1"></i> ${orderDate}</small>
                            </div>
                            ${statusBadge}
                        </div>
                        
                        <div class="order-body p-3">
                            <div class="items-list d-flex justify-content-center flex-wrap">${itemsListHtml}</div>
                        </div>
                        
                        <div class="order-footer p-3 d-flex flex-column gap-4 justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">
                                    <i class="fas fa-dollar-sign me-1"></i>
                                    Total: <span class="text-success fw-bold">$${total}</span>
                                </h5>
                                <small class="text-muted">
                                    <i class="fas fa-boxes me-1"></i>${totalItems} items total
                                </small>
                            </div>
                            <div>${actions}</div>
                        </div>
                    </div>
                `;
            });

            userSection.innerHTML = `
                <div class="customer-section-header p-3 mb-3 rounded shadow-sm">
                    <h4 class="mb-0 text-white">
                        <i class="fas fa-user me-2"></i>Customer: ${key.replace('request_', '')}
                    </h4>
                </div>
                <div class="orders-container d-flex flex-wrap gap-3">
                    ${requestsHtml || '<div class="alert alert-info">No orders found.</div>'}
                </div>
            `;
            container.appendChild(userSection);
        }
    }

    if (!found) {
        container.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>No customer orders found.</div>';
    }
}

function handleRequest(storageKey, orderIndex, action) {
    Swal.fire({
        title: "Are you sure?",
        Text: `Are you sure you want to ${action} this order?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (!result.isConfirmed) return;
        const requests = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (requests[orderIndex]) {
            requests[orderIndex].status = action;
            localStorage.setItem(storageKey, JSON.stringify(requests));
            displayRequests();
            const message = action === 'accepted' ? 'Order accepted successfully!' : 'Order rejected successfully!';
            const type = action === "accepted" ? "success" : "error";
            showToast(message, type);

        }




    });

}

window.onload = function () {
    if (!checkAdminAuth()) return;
    displayRequests();
};