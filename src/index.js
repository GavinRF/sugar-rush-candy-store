// JS Goes here - ES6 supported

import "./css/main.scss";
import "./js/main.js";

const mobileMenu = document.querySelector("[data-mobile-menu]");
const nav = document.querySelector("[data-nav]");

function toggleMobileMenu() {
  nav.classList.toggle("menu-open");
  const isOpen = nav.classList.contains("menu-open");
  mobileMenu.setAttribute("aria-expanded", isOpen);
}

mobileMenu.addEventListener("click", toggleMobileMenu);

// Add explosion effect to all buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', (e) => {
    if (typeof addExplosion === 'function') {
      addExplosion(button, e);
    }
  });
});

// Say hello
// eslint-disable-next-line no-console
console.log("🦊 Hello! Edit me in src/index.js");
