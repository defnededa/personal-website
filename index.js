addEventListener("DOMContentLoaded", () => {
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
});
