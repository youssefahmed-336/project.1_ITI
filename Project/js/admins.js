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
function getAllUsers() {
    const users = localStorage.getItem('eshop_users');
    return users ? JSON.parse(users) : [];
}

function displayAdmins() {
    const container = document.getElementById('admins-grid');
    container.innerHTML = '';

    const users = getAllUsers();
    const admins = users.filter(user => user.role === 'admin');

    admins.forEach((admin) => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        const isProtectedAdmin = admin.id === 1;

        let actionButtons = '';
        if (isProtectedAdmin) {
            actionButtons = '<span class="badge  w-100"><i class="fas fa-lock me-1"></i>Protected Admin</span>';
        } else {
            actionButtons = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-warning flex-grow-1" onclick="openEditAdminModal(${admin.id})">
                        <i class="fas fa-edit me-1"></i>Edit
                    </button>
                    <button class="btn btn-sm btn-danger flex-grow-1" onclick="deleteAdmin(${admin.id})">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card user-card shadow-sm h-100" ${isProtectedAdmin ? 'style="  border-left: 4px solid #667eea;"' : ''}>
                <div class="card-body">
                    <h5 class="card-title">
                        <i class="fas fa-user-shield me-2" ${isProtectedAdmin ? 'style="  color: #667eea;"' : 'style="  color: #212529;"'}></i>${admin.username}
                        ${isProtectedAdmin ? '<span class="badge bg-success ms-2">Main Admin</span>' : ''}
                    </h5>
                    <p class="card-text text-muted mb-1">
                        <small><strong>Email:</strong> ${admin.email}</small>
                    </p>
                    <p class="card-text text-muted">
                        <small><strong>Password:</strong> ${admin.password || 'N/A'}</small>
                    </p>
                    ${actionButtons}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openAddAdminModal() {
    document.getElementById('admin-index').value = '-1';
    document.getElementById('admin-role').value = 'admin';
    document.getElementById('adminModalTitle').innerHTML = '<i class="fas fa-user-shield me-2"></i>Add New Admin';
    document.getElementById('adminForm').reset();
    new bootstrap.Modal(document.getElementById('adminModal')).show();
}
function saveAdmin() {
    const index = parseInt(document.getElementById('admin-index').value);
    const username = document.getElementById('admin-username').value.trim();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (!username || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    const users = getAllUsers();

    if (index === -1) {
        const newAdmin = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
            username,
            email,
            password,
            role: 'admin'
        };
        users.push(newAdmin);
        showToast('Admin added successfully!', 'success');
    } else {
        users[index].username = username;
        users[index].email = email;
        users[index].password = password;
        showToast('Admin updated successfully!', 'success');
    }

    localStorage.setItem('eshop_users', JSON.stringify(users));
    bootstrap.Modal.getInstance(document.getElementById('adminModal')).hide();
    displayAdmins();
}

function openEditAdminModal(adminId) {
    if (adminId === 1) {
        showToast('Cannot edit the main admin account!', 'error');
        return;
    }
    const users = getAllUsers();
    const admin = users.find(u => u.id === adminId);
    if (!admin) return;
    document.getElementById('admin-index').value = users.indexOf(admin);
    document.getElementById('admin-username').value = admin.username;
    document.getElementById('admin-email').value = admin.email;
    document.getElementById('admin-password').value = admin.password;
    document.getElementById('admin-role').value = 'admin';
    document.getElementById('adminModalTitle').innerHTML = '<i class="fas fa-user-shield me-2"></i>Edit Admin';
    new bootstrap.Modal(document.getElementById('adminModal')).show();
}
function deleteAdmin(adminId) {
    if (adminId === 1) {
        showToast('Cannot delete the main admin account!', 'error');
        return;
    }
    Swal.fire({
        title: "Are you sure ?",
        text: "Are you sure you want to delete this admin?",
        showCancelButton: true,
        confirmButtonText: "yes",
        cancelButtonText: "No"
    }).then((result) => {
        if (!result.isConfirmed) return;
        const users = getAllUsers();
        const filteredUsers = users.filter(u => u.id !== adminId);
        localStorage.setItem('eshop_users', JSON.stringify(filteredUsers));
        showToast('Admin deleted successfully!', 'error');
        displayAdmins();

    })


}



window.onload = function () {
    if (!checkAdminAuth()) return;
    displayAdmins();

};

