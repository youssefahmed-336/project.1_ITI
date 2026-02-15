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
function loadCategories() {
    let savedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productCategories = [...new Set(products.map(p => p.category))];

    productCategories.forEach(catName => {
        const exists = savedCategories.find(c => c.name.toLowerCase() === catName.toLowerCase());
        if (!exists) {
            const newId = savedCategories.length > 0 ?
                Math.max(...savedCategories.map(c => c.id)) + 1 : 1;

            savedCategories.push({
                id: newId,
                name: catName,
                description: '',
                image: ""
            });
        }
    });

    localStorage.setItem('categories', JSON.stringify(savedCategories));

    const grid = document.getElementById('categories-grid');
    const countEl = document.getElementById('category-count');

    grid.innerHTML = '';
    countEl.textContent = savedCategories.length;

    const addCard = document.createElement('div');
    addCard.className = 'col-md-6 col-lg-3 ';
    addCard.innerHTML = `
            <div class="card add-category-card" onclick="openAddModal()">
                <div class="text-center">
                    <i class="fas fa-plus-circle add-icon"></i>
                    <p class="mt-3 fw-bold  fs-5">Add New Category</p>
                </div>
            </div>
        `;
    grid.appendChild(addCard);

    savedCategories.forEach((cat, index) => {
        const productCount = getProductCountForCategory(cat.name);
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3 ';
        col.innerHTML = `
              <div class="card category-card">
                  <img src="${cat.image}" 
                       class="category-image" 
                       alt="${cat.name}"
                     >
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                          <h5 class="category-name mb-0  text-capitalize">${cat.name}</h5>
                          <span class="product-count">
                              ${productCount} items
                          </span>
                      </div>
                      <p class="category-desc mb-3">${cat.description || 'No description'}</p>
                      <div class="d-flex gap-2">
                          <button class="btn btn-sm btn-primary flex-fill btn-view"  data-category="${cat.name}">
                              <i class="fas fa-eye me-1"></i>View
                          </button>
                          <button class="btn btn-sm btn-warning" onclick="editCategory(${index})" title="Edit">
                              <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-danger" onclick="deleteCategory(${index})" title="Delete">
                              <i class="fas fa-trash"></i>
                          </button>
                      </div>
                  </div>
              </div>
          `;
        grid.appendChild(col);
    });

    document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", function () {
            const category = this.dataset.category;
            viewProducts(category);
        });
    });
}

function getProductCountForCategory(categoryName) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).length;
}

function openAddModal() {
    document.getElementById('category-index').value = '-1';
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Add New Category';
    document.getElementById('categoryForm').reset();
    new bootstrap.Modal(document.getElementById('categoryModal')).show();
}

function editCategory(index) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const cat = categories[index];
    document.getElementById('category-index').value = index;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Category';
    document.getElementById('category-name').value = cat.name;
    document.getElementById('category-description').value = cat.description || '';
    document.getElementById('category-image').value = cat.image;


    new bootstrap.Modal(document.getElementById('categoryModal')).show();
}

function saveCategory() {
    const index = parseInt(document.getElementById('category-index').value);
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();
    const image = document.getElementById('category-image').value.trim();


    if (!name) {
        showToast("Please enter a category name", "error");
        return;
    } if (!image) {
        showToast("Please enter a category image URL", "error");
        return;
    }

    let categories = JSON.parse(localStorage.getItem('categories') || '[]');

    const duplicateIndex = categories.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (duplicateIndex !== -1 && duplicateIndex !== index) {
        showToast(" A category with this name already exists!", "error");
        return;
    }


    let idG = categories.length > 0 ? categories[categories.length - 1].id + 1 : 1;
    const categoryData = {
        id: index === -1 ? idG : categories[index].id,
        name,
        description,
        image: image,

    };





    if (index === -1) {
        categories.push(categoryData);
        showToast(" Product added successfully!", "success");

    } else {

        categories[index] = categoryData;
        showToast("Category updated successfully!", "success")

    }


    localStorage.setItem('categories', JSON.stringify(categories));
    bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
    loadCategories();
}



function deleteCategory(index) {
    Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delet it ?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (!result.isConfirmed) return;
        let categories = JSON.parse(localStorage.getItem("categories") || "[]");
        const categoryName = categories[index].name;

        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const hasProducts = products.some(p => p.category.toLowerCase() === categoryName.toLowerCase());

        if (hasProducts) {
            showToast("Cannot delete category with existing products!", "error");
            return;
        }

        categories.splice(index, 1);
        localStorage.setItem("categories", JSON.stringify(categories));
        loadCategories();
        showToast("Category deleted successfully", "success");

    });


}

function viewProducts(categoryName) {
    localStorage.setItem("category", categoryName);
    window.location.href = "products.html";
}

window.onload = () => {
    if (!checkAdminAuth()) return;
    loadCategories();
    document.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", function () {
            const category = this.dataset.category;

            viewProducts(category);
        });
    });

};













