const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("wa-theme");
if (savedTheme === "light") {
  root.setAttribute("data-theme", "light");
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem("wa-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("wa-theme", "light");
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav a").forEach((link) => {
  link.classList.toggle("active", link.getAttribute("href") === currentPage);
});

if (window.gsap) {
  gsap.from(".sidebar", { opacity: 0, x: -16, duration: 0.65, ease: "power2.out" });
  gsap.from(".topbar", { opacity: 0, y: -12, duration: 0.55, delay: 0.05, ease: "power2.out" });
  gsap.from(".item, .panel, .stat-card", { opacity: 0, y: 12, stagger: 0.035, duration: 0.45, delay: 0.1, ease: "power2.out" });
}

const toggles = document.querySelectorAll(".toggle-switch");
toggles.forEach((toggleEl) => {
  toggleEl.addEventListener("click", () => toggleEl.classList.toggle("active"));
});
