

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


