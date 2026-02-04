const USERS_KEY = 'eshop_users';
const CURRENT_USER_KEY = 'currentUser';
const DEFAULT_PHOTO = 'images/profile.png';

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

function getCurrentUserRecord(users) {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            if (parsed.id != null) {
                return users.find((u) => u.id === parsed.id) || null;
            }
            if (parsed.username) {
                return users.find((u) => u.username === parsed.username) || null;
            }
            if (parsed.email) {
                return users.find((u) => u.email === parsed.email) || null;
            }
        }
    } catch {
    }

    return users.find((u) => u.username === raw || u.email === raw) || null;
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.toggle('active');
}

function initProfileMenu() {
    const users = getUsers();
    const currentUser = getCurrentUserRecord(users);
    const img = document.getElementById('navProfileImg');
    if (img) {
        img.src = currentUser?.photo || DEFAULT_PHOTO;
    }

    window.addEventListener('click', (event) => {
        const dropdown = document.getElementById('dropdownMenu');
        if (!dropdown) return;
        if (!event.target.closest('.profile-dropdown')) {
            dropdown.classList.remove('active');
        }
    });
}

