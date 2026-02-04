function initAdminAccount() {
  if (
    JSON.parse(localStorage.getItem("eshop_users") || "[]").find(
      (u) => u.role === "admin",
    ) === undefined
  ) {
    const defaultAdmins = [
      {
        id: 1,
        username: "admin",
        email: "admin@eshop.com",
        password: "admin123",
        role: "admin",
      },
    ];
    localStorage.setItem("eshop_users", JSON.stringify(defaultAdmins));
  }
}

function adminLogin() {
  const email = document.getElementById("admin-email").value.trim();
  const pass = document.getElementById("admin-pass").value;

  if (!email || !pass) {
    showToast("Please fill all fields", "error");

    return;
  }


  const admins = JSON.parse(localStorage.getItem("eshop_users") || "[]");
  const found = admins.find(
    (a) => a.email === email && a.password === pass && a.role === "admin",
  );

  if (found) {
    localStorage.setItem("adminUser", found.username);
    showToast("Admin login successful!", "success");

    setTimeout(() => {
      window.location.href = "categories.html";
    }, 2000);

  } else {
    showToast("Invalid admin credentials!", "error");

  }
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    adminLogin();
  }
});

window.onload = () => {
  initAdminAccount();
};
