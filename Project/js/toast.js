
(function () {

  
  function getToastContainer() {
    let container = document.getElementById("toast-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    return container;
  }

  window.showToast = function (
    message,
    type = "success",
    duration = 3000
  ) {
    const container = getToastContainer();

    const toast = document.createElement("div");
    toast.classList.add("toast-msg", `toast-${type}`);

    const text = document.createElement("span");
    text.innerText = message;

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.classList.add("toast-close");
    closeBtn.onclick = () => removeToast(toast);

    const progress = document.createElement("div");
    progress.classList.add("toast-progress");
    progress.style.animationDuration = duration + "ms";

  
    toast.appendChild(text);
    toast.appendChild(closeBtn);
    toast.appendChild(progress);
    container.appendChild(toast);

    let timeout = setTimeout(() => {
      removeToast(toast);
    }, duration);

    toast.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
      progress.style.animationPlayState = "paused";
    });

    toast.addEventListener("mouseleave", () => {
      progress.style.animationPlayState = "running";

      timeout = setTimeout(() => {
        removeToast(toast);
      }, 1500);
    });
  };

  function removeToast(toast) {
    toast.style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => toast.remove(), 500);
  }

})();
