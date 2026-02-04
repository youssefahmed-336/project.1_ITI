import { checkCaptcha, getCaptchaData } from '../captcha/checkCaptcha.js';
        window.addEventListener('load', function() {
            const captcha = getCaptchaData();
            document.getElementById('captcha-image').src = captcha.imgSrc;
            localStorage.setItem('currentCaptchaId', captcha.id);
        });

        window.reloadCaptcha = function() {
            const captcha = getCaptchaData();
            document.getElementById('captcha-image').src = captcha.imgSrc;
            localStorage.setItem('currentCaptchaId', captcha.id);
            document.getElementById('captcha-input').value = '';
        };
function register() {
    const user = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const captchaInput = document.getElementById('captcha-input').value.trim();
    const captchaId = parseInt(localStorage.getItem('currentCaptchaId'));

    
    if(email.includes ("admin")){
        window.showToast("Please enter a valid email address", "error");
    return;
    }

    if (!user || !email || !pass || !pass2 || !captchaInput) {
        showToast("Please fill all fields", "error");
        return;
    }
    
    if (user.length < 3) {
        showToast("Username must be at least 3 characters", "error");
        return;
    }
    
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email)) {
    showToast("Please enter a valid email address", "error");
    return;
}

    if (!isPasswordValid(pass)) {
        showToast("Password dosen't meet requirements", "error");
        return;
    }

    if (pass !== pass2) {
        showToast("Passwords dosen't match", "error");
        return;
    }

    if (!checkCaptcha(captchaInput, captchaId)) {
        showToast("Incorrect captcha. Please try again!", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem('eshop_users') || '[]');
    if (users.find(u => u.username === user) || users.find(u => u.email === email)) {
        showToast("Username or email already exists", "error");
        return;
    }

    let idG = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    users.push({
        username: user,
        email: email,
        password: pass,
        id: idG,
        role: "customer"
    });
    localStorage.setItem('eshop_users', JSON.stringify(users));
    showToast("Registration successful", "success");
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        register();
    }
});
window.register = register;


const passInput = document.getElementById("reg-pass");
const passRules = document.getElementById("pass-rules");

passInput.addEventListener("focus", function () {
    passRules.classList.remove("d-none");
});

passInput.addEventListener("input", function () {

    const passValue = passInput.value;

    const ruleLower = document.getElementById("rule-lower");
    const ruleUpper = document.getElementById("rule-upper");
    const ruleDigit = document.getElementById("rule-digit");
    const ruleLength = document.getElementById("rule-length");

    if (/[a-z]/.test(passValue)) {
        ruleLower.classList.remove("text-danger");
        ruleLower.classList.add("text-success");
    } else {
        ruleLower.classList.remove("text-success");
        ruleLower.classList.add("text-danger");
    }

    if (/[A-Z]/.test(passValue)) {
        ruleUpper.classList.remove("text-danger");
        ruleUpper.classList.add("text-success");
    } else {
        ruleUpper.classList.remove("text-success");
        ruleUpper.classList.add("text-danger");
    }

    if (/[0-9]/.test(passValue)) {
        ruleDigit.classList.remove("text-danger");
        ruleDigit.classList.add("text-success");
    } else {
        ruleDigit.classList.remove("text-success");
        ruleDigit.classList.add("text-danger");
    }

    if (passValue.length >= 8) {
        ruleLength.classList.remove("text-danger");
        ruleLength.classList.add("text-success");
    } else {
        ruleLength.classList.remove("text-success");
        ruleLength.classList.add("text-danger");
    }
});

function isPasswordValid(password) {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasLength = password.length >= 8;

    return hasLower && hasUpper && hasDigit && hasLength;
}

