addEventListener("DOMContentLoaded", () => {
  // Highlight active navigation link
  const navLinks = document.querySelectorAll("nav li a");
  const pathname = window.location.pathname;
  for (const navLink of navLinks) {
    const url = new URL(navLink.href);
    if (url.pathname === "/") {
      if (pathname === "/") {
        navLink.classList.add("active");
        break;
      }
    } else {
      if (pathname.startsWith(url.pathname)) {
        navLink.classList.add("active");
      }
    }
  }

  // Toggle hamburger menu

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("menu-open"); // Use a distinct class for toggling
    hamburger.classList.toggle("menu-open");
  });
});
