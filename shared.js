/* =========================
   SHARED SITE COMPONENTS
   Single source of truth for
   header, footer, WhatsApp
   float, dark mode & scroll
   animations.
========================= */

/* ---- constants ---- */
const WHATSAPP_NUMBER = "254793676054";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const SITE_NAME = "Swift Courier";
const COPYRIGHT_YEAR = 2026;

const NAV_LINKS = [
  { href: "index.html",    label: "Home" },
  { href: "about.html",    label: "About Us" },
  { href: "services.html", label: "Services" },
  { href: "pricing.html",  label: "Pricing" },
  { href: "contact.html",  label: "Contact" },
];

/* ---- helpers ---- */
function currentPage() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf("/") + 1) || "index.html";
  return file;
}

/* ---- header / nav ---- */
function renderHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  const page = currentPage();
  const links = NAV_LINKS.map(
    (l) =>
      `<a href="${l.href}"${l.href === page ? ' class="active"' : ""}>${l.label}</a>`
  ).join("\n    ");

  target.outerHTML = `<header>
  <h1>${SITE_NAME}</h1>
  <nav>
    ${links}
    <button id="darkModeToggle" title="Toggle Dark Mode">\u{1F4A1}</button>
  </nav>
</header>`;
}

/* ---- footer ---- */
function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;

  target.outerHTML = `<footer>
  <p>\u{1F4DE} WhatsApp: <a href="${WHATSAPP_URL}">+254 793 676 054</a></p>
  <p>&copy; ${COPYRIGHT_YEAR} ${SITE_NAME} Services</p>
</footer>`;
}

/* ---- WhatsApp floating button ---- */
function renderWhatsAppFloat() {
  const target = document.getElementById("whatsapp-float");
  if (!target) return;

  target.outerHTML = `<a href="${WHATSAPP_URL}" class="whatsapp-float">\u{1F4AC}</a>`;
}

/* ---- dark mode ---- */
function initDarkMode() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });
}

/* ---- scroll micro-animations ---- */
function initScrollAnimations() {
  const items = document.querySelectorAll(".animate");
  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(25px)";
    item.style.transition = "all 0.6s ease";
    observer.observe(item);
  });
}

/* ---- bootstrap everything on DOMContentLoaded ---- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderWhatsAppFloat();
  initDarkMode();
  initScrollAnimations();
});
