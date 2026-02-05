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
function login() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const captchaInput = document.getElementById('captcha-input').value.trim();
    const captchaId = parseInt(localStorage.getItem('currentCaptchaId'));

    if(email.includes ("admin")){
        window.showToast("Please enter a valid email address", "error");
    return;
    }

    if (!email || !pass || !captchaInput) { 
        window.showToast("Please fill all fields", "error");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    window.showToast("Please enter a valid email address", "error");
    return;
  }
 
    if (!checkCaptcha(captchaInput, captchaId)) {
        window.showToast("Incorrect captcha. Please try again.", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem('eshop_users') || '[]');
    const found = users.find(u => u.email === email && u.password === pass);

    if (found) {
        localStorage.setItem('currentUser', found.username);
        window.showToast("Login successful", "success");

        setTimeout(() => {
            window.location.href = "./E-commerce-products.html";
        }, 1500);
    } else {
        window.showToast("Invalid credentials", "error");
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});

window.login = login;




