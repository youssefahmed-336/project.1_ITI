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
    window.location.href = "admin-login.html";

  }
});

}

let mainAdmin = localStorage.getItem("adminUser");
window.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname.split("/").pop();
    const navMap = {
        "categories.html": "categories",
        "admin-requests.html": "orders",
        "admins.html": "admins"
    };
    const activeKey = navMap[path];
    if (activeKey) {
        const activeLink = document.querySelector(`a.nav-link[data-nav="${activeKey}"]`);
        if (activeLink) activeLink.classList.add("active");
    }

    if (!(mainAdmin === "admin")) {
        const adminsNavItem = document.querySelector(
            'a.nav-link[href="admins.html"]',
        ).parentElement;
        adminsNavItem.style.display = "none";
    }
});


