const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

toggle.addEventListener("click" , () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "open") {
    sidebar.classList.toggle("close");
}

function mobile(windowInnerWidth) {
    if (windowInnerWidth <= 768) {
        sidebar.classList.add("mobile");
    }
    else {
        sidebar.classList.remove("mobile");
    }
}

window.addEventListener('resize', function() {
    mobile(window.innerWidth);
}, true);


document.addEventListener("DOMContentLoaded", () => {
    let getMode = localStorage.getItem("mode");
    mobile(window.innerWidth);
    if (sidebar.classList.contains("mobile")) {
        sidebar.classList.add("close");
        localStorage.setItem("status", "close");
    }

    if (getMode && getMode === "light") {
    body.classList.toggle("dark");
    body.setAttribute("data-bs-theme", "light");
    }
    else if (getMode && getMode === "dark") {
    body.setAttribute("data-bs-theme", "dark");
    }
    else if (window.matchMedia) {
    // Check if the dark-mode Media-Query matches
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        localStorage.setItem("mode", "light");
        body.classList.toggle("dark");
        // var home = document.getElementById("home");
        body.setAttribute("data-bs-theme", "light");
        modeText.innerText = "Светлая тема";
        } else {
            localStorage.setItem("mode", "dark");
            modeText.innerText = "Темная тема";
            // var home = document.getElementById("home");
            body.setAttribute("data-bs-theme", "dark");
        }
    }
    else {
        // Default (when Media-Queries are not supported)
        body.setAttribute("data-bs-theme", "dark");
    }

    modeSwitch.addEventListener("click" , () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Светлая тема";
        localStorage.setItem("mode", "light");
        // var home = document.getElementById("home");
        body.setAttribute("data-bs-theme", "light");
    } else {
        modeText.innerText = "Темная тема";
        localStorage.setItem("mode", "dark");
        // var home = document.getElementById("home");
        body.setAttribute("data-bs-theme", "dark");
    }
    });
});