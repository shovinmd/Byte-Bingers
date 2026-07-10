/* js/navbar.js - Reusable Dynamic Premium Navbar */

document.addEventListener("DOMContentLoaded", () => {
  const navbarContainer = document.getElementById("premium-navbar-container");
  if (!navbarContainer) return;

  // Determine active page
  const currentPath = window.location.pathname;
  const isIndex = currentPath.endsWith("index.html") || currentPath.endsWith("/");
  const isDetails = currentPath.includes("restaurant-details.html");
  const isBooking = currentPath.includes("booking-wizard.html");
  const isUserDash = currentPath.includes("user-dashboard.html");
  const isAdminDash = currentPath.includes("admin-dashboard.html");
  const isLogin = currentPath.includes("login.html") || currentPath.includes("signup.html");

  // Generate HTML
  navbarContainer.innerHTML = `
    <nav class="premium-nav" id="main-premium-nav">
      <a href="index.html" class="nav-brand" style="display: flex; align-items: center; gap: 8px;">
        <img src="logo.png" alt="Byte-Bingers Logo" style="height: 32px; width: 32px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,215,0,0.3);">
        Byte-Bingers
      </a>
      <ul class="nav-links">
        <li><a href="index.html" class="${isIndex ? 'active' : ''}">Discovery</a></li>
        <li><a href="booking-wizard.html" class="${isBooking ? 'active' : ''}">Book Table</a></li>
        <li><a href="user-dashboard.html" class="${isUserDash ? 'active' : ''}">Loyalty Hub</a></li>
        <li><a href="admin-dashboard.html" class="${isAdminDash ? 'active' : ''}">Admin Desk</a></li>
        <li><a href="login.html" class="nav-btn ${isLogin ? 'active' : ''}">Sign In</a></li>
      </ul>
    </nav>
  `;

  // Scroll effect
  const nav = document.getElementById("main-premium-nav");
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check in case page starts scrolled
    handleScroll();
  }
});
