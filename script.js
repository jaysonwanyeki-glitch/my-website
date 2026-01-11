/* =========================
   WAIT FOR PAGE TO LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DARK MODE TOGGLE 💡
  ========================= */
  const toggle = document.getElementById("darkModeToggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      // Optional: remember mode
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  /* =========================
     SCROLL MICRO-ANIMATIONS
  ========================= */
  const animatedItems = document.querySelectorAll(".animate");

  if (animatedItems.length > 0) {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedItems.forEach(item => {
      item.style.opacity = "0";
      item.style.transform = "translateY(25px)";
      item.style.transition = "all 0.6s ease";
      observer.observe(item);
    });

  }

});
