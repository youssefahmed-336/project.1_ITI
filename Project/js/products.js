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
function loadProducts() {
    document.getElementById("cat-name").textContent =
        localStorage.getItem("category");
    const products = JSON.parse(localStorage.getItem("products") || "[]").filter(
        (p) => p.category === localStorage.getItem("category"),
    );

    const tbody = document.getElementById("product-list");
    const countEl = document.getElementById("product-count");
    tbody.innerHTML = "";
    countEl.textContent = products.length;

    if (products.length === 0) {
        tbody.innerHTML =
            '<tr><td colspan="6" class="text-center py-4 text-muted">No products yet</td></tr>';
        return;
    }

    products.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.image}" class="product-img" alt="${p.title}"></td>
            <td class="text-capitalize">${p.title}</td>
            <td>$${parseFloat(p.price).toFixed(2)}</td>
            <td>${p.stock || 0}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editProduct(${p.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openAddModal() {
    document.getElementById("product-index").value = "-1";
    document.getElementById("modalTitle").innerHTML =
        '<i class="fas fa-plus-circle me-2"></i>Add New Product';
    document.getElementById("productForm").reset();
    new bootstrap.Modal(document.getElementById("productModal")).show();
}

function saveProduct() {
    const index = parseInt(document.getElementById("product-index").value);
    const title = document.getElementById("p-title").value.trim();
    const price = parseFloat(document.getElementById("p-price").value);
    const category = localStorage.getItem("category");
    const stock = parseInt(document.getElementById("p-stock").value);
    const image =
        document.getElementById("p-image").value.trim();

    if (!title || isNaN(price) || !category || isNaN(stock)) {
        showToast("Please fill all required fields correctly", "error");
        return;
    }

    let allProducts = JSON.parse(localStorage.getItem("products") || "[]");

    const duplicateProduct = allProducts.find((p, i) =>
        p.category === category &&
        p.title.toLowerCase() === title.toLowerCase() &&
        i !== index
    );

    if (duplicateProduct) {
        showToast("A Product with this name already exists!", "error");
        return;
    }

    if (index === -1) {
        const newId = allProducts.length > 0 ?
            Math.max(...allProducts.map(p => p.id)) + 1 : 1;

        const productData = {
            id: newId,
            title,
            price,
            category,
            stock,
            image,
            description: `${title} - High quality product`,
            rating: { rate: 0, count: 0 },
        };

        allProducts.push(productData);
        showToast("Product added successfully!", "success");
    } else {
        allProducts[index] = {
            ...allProducts[index],
            title,
            price,
            category,
            stock,
            image,
            description: `${title} - High quality product`,
        };
        showToast("Product updated successfully!", "success");
    }

    localStorage.setItem("products", JSON.stringify(allProducts));
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    loadProducts();
}

function editProduct(productId) {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const index = allProducts.findIndex(p => p.id === productId);

    if (index === -1) {
        showToast("Product not found!", "error");
        return;
    }

    const p = allProducts[index];
    document.getElementById("product-index").value = index;
    document.getElementById("p-title").value = p.title;
    document.getElementById("p-price").value = p.price;
    document.getElementById("p-stock").value = p.stock || 0;
    document.getElementById("p-image").value = p.image || "";
    document.getElementById("modalTitle").innerHTML =
        '<i class="fas fa-edit me-2"></i>Edit Product';
    new bootstrap.Modal(document.getElementById("productModal")).show();
}



function deleteProduct(productId) {

    Swal.fire({
        title: "Are You Sure ?",
        text: "Are you sure you want to delete this product?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (!result.isConfirmed) return;

        let allProducts = JSON.parse(localStorage.getItem("products") || "[]");
        const index = allProducts.findIndex(p => p.id === productId);

        if (index === -1) {
            showToast("Product not found!", "error");
            return;
        }

        allProducts.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(allProducts));
        loadProducts();
        showToast("Product deleted successfully!", "success");

    })

}

window.onload = () => {
    if (!checkAdminAuth()) return; loadProducts();
};

