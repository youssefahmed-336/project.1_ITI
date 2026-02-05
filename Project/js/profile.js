const USERS_KEY = 'eshop_users';
const CURRENT_USER_KEY = 'currentUser';
const DEFAULT_PHOTO = 'images/profile.png';

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

window.onclick = function (event) {
    if (!event.target.matches('.profile-icon, .profile-icon img')) {
        const dropdown = document.getElementById('dropdownMenu');
        if (dropdown && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    }
};

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('preview');
        if (output) {
            output.src = reader.result;
        }
    };
    reader.readAsDataURL(event.target.files[0]);
}

function getStoredUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function setStoredUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedUsersIfMissing() {
    const users = getStoredUsers();
    if (users.length > 0) return users;

    const seeded = [
        { id: 1, username: 'admin', email: 'admin@eshop.com', password: 'admin123', role: 'admin', photo: DEFAULT_PHOTO },
        { id: 2, username: 'amr', email: 'am2873328@gmail.com', password: '1234', role: 'customer', photo: DEFAULT_PHOTO },
        { id: 3, username: 'amr2', email: 'am2873327@gmail.com', password: '1234', role: 'customer', photo: DEFAULT_PHOTO },
        { id: 4, username: 'admin2', email: 'admin2@eshop.com', password: 'admin2', role: 'admin', photo: DEFAULT_PHOTO }
    ];

    setStoredUsers(seeded);
    return seeded;
}

function ensureUsersHavePhoto(users) {
    let changed = false;
    const updated = users.map((user) => {
        if (!user.photo) {
            changed = true;
            return { ...user, photo: DEFAULT_PHOTO };
        }
        return user;
    });

    if (changed) {
        setStoredUsers(updated);
    }

    return updated;
}

function getCurrentUserRecord(users) {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            if (parsed.id != null) {
                const byId = users.find((u) => u.id === parsed.id);
                if (byId) return byId;
            }
            if (parsed.username) {
                const byUsername = users.find((u) => u.username === parsed.username);
                if (byUsername) return byUsername;
            }
            if (parsed.email) {
                const byEmail = users.find((u) => u.email === parsed.email);
                if (byEmail) return byEmail;
            }
        }
    } catch {
    }

    return users.find((u) => u.username === raw || u.email === raw) || null;
}

function setProfileImageSrc(src) {
    const profileImg = document.getElementById('profileimg');
    if (profileImg) {
        profileImg.setAttribute('src', src);
    }

    const navProfileImg = document.getElementById('navProfileImg');
    if (navProfileImg) {
        navProfileImg.setAttribute('src', src);
    }
}

function updateUserPhoto(userId, photoValue) {
    const users = getStoredUsers();
    const updated = users.map((user) =>
        user.id === userId ? { ...user, photo: photoValue } : user
    );
    setStoredUsers(updated);
}

function updateUserEmail(userId, emailValue) {
    const users = getStoredUsers();
    const updated = users.map((user) =>
        user.id === userId ? { ...user, email: emailValue } : user
    );
    setStoredUsers(updated);
}

function updateUserPassword(userId, passwordValue) {
    const users = getStoredUsers();
    const updated = users.map((user) =>
        user.id === userId ? { ...user, password: passwordValue } : user
    );
    setStoredUsers(updated);
}

function initProfilePhoto() {
    const seeded = seedUsersIfMissing();
    const users = ensureUsersHavePhoto(seeded);
    const currentUser = getCurrentUserRecord(users);
    setProfileImageSrc(currentUser?.photo || DEFAULT_PHOTO);

    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.value = currentUser?.email || '';
    }
}

document.addEventListener('DOMContentLoaded', initProfilePhoto);

function triggerClick() {
    const input = document.querySelector('#imageInput');
    if (input) input.click();
}

function displayImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const dataUrl = e.target.result;
            setProfileImageSrc(dataUrl);

            const users = getStoredUsers();
            const currentUser = getCurrentUserRecord(users);
            if (currentUser) {
                updateUserPhoto(currentUser.id, dataUrl);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateEmail() {
    const users = getStoredUsers();
    const currentUser = getCurrentUserRecord(users);
    if (!currentUser) {
       showToast("Please login first", "error");
        return;
    }

    const emailInput = document.getElementById('emailInput');
    const newEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const currentPasswordInput = document.getElementById('emailCurrentPassword');
    const currentPassword = currentPasswordInput ? currentPasswordInput.value : '';
    if (!newEmail) {
       showToast("Please enter an email", "error");
        return;
    }
    if (!currentPassword) {
      showToast("Please enter your current password", "error");
        return;
    }
    if (currentPassword !== currentUser.password) {
      showToast("Current password is incorrect", "error");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
     showToast("Please enter a valid email format", "error");
        return;
    }

    const emailExists = users.some(
        (user) => user.email === newEmail && user.id !== currentUser.id
    );
    if (emailExists) {
       showToast("this email is already used", "error");
        return;
    }

    updateUserEmail(currentUser.id, newEmail);

    const rawCurrent = localStorage.getItem(CURRENT_USER_KEY);
    if (rawCurrent) {
        try {
            const parsed = JSON.parse(rawCurrent);
            if (parsed && typeof parsed === 'object') {
                const updated = { ...parsed, email: newEmail };
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
            } else if (rawCurrent === currentUser.email) {
                localStorage.setItem(CURRENT_USER_KEY, newEmail);
            }
        } catch {
            if (rawCurrent === currentUser.email) {
                localStorage.setItem(CURRENT_USER_KEY, newEmail);
            }
        }
    }

    if (currentPasswordInput) {
        currentPasswordInput.value = '';
    }
   showToast("Email updated successfully", "success");
}

function Change() {
    const users = getStoredUsers();
    const currentUser = getCurrentUserRecord(users);
    if (!currentUser) {
       showToast("Please login first", "error");
        return;
    }

    const currentPassword = document.getElementById('currentpassword')?.value || '';
    const newPassword = document.getElementById('newpassword')?.value || '';
    const confirmPassword = document.getElementById('confirmpassword')?.value || '';

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill all password fields", "error");
        return;
    }

    if (currentPassword !== currentUser.password) {
        showToast("Current password is incorrect", "error");
        return;
    }

    if (newPassword.length < 8) {
        showToast("New password must be at least 8 characters", "error");
        return;
    }

    if (newPassword !== confirmPassword) {
       showToast("Passwords dosen`t match", "error");
        return;
    }

    updateUserPassword(currentUser.id, newPassword);
    document.getElementById('currentpassword').value = '';
    document.getElementById('newpassword').value = '';
    document.getElementById('confirmpassword').value = '';
   showToast("Password updated successfully", "success");
}

