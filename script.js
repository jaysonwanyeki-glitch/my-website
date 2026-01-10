document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");

  if (toggle) {
    // Load saved mode
    if (localStorage.getItem("darkMode") === "on") {
      document.body.classList.add("dark-mode");
      toggle.textContent = "🌙";
    }

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const dark = document.body.classList.contains("dark-mode");
      toggle.textContent = dark ? "🌙" : "💡";
      localStorage.setItem("darkMode", dark ? "on" : "off");
    });
  }
});
