
var captchaData = [
  { id:1,answer: '46HHGN',imgSrc:'captcha/1.png' },
  { id:2,answer: 'tR4f4B',imgSrc:'captcha/2.png' },
  { id:3,answer: 'Ae4d89',imgSrc:'captcha/3.png' },
  { id:4,answer: 'Gh7jk3',imgSrc:'captcha/4.png' },
  { id:5,answer: 'Fk5R8z',imgSrc:'captcha/5.png' },
]


function checkCaptcha(userInput, captchaId) {
    var captcha = captchaData.find(c => c.id === captchaId);
    if (captcha && captcha.answer === userInput) {
        return true;
    }
    return false;
}


function getCaptchaData() {
    var randomIndex = Math.floor(Math.random() * captchaData.length);
    return {id: captchaData[randomIndex].id, imgSrc: captchaData[randomIndex].imgSrc};
}

export {checkCaptcha, getCaptchaData};

