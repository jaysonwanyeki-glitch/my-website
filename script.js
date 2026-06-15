/* =========================
   WAIT FOR PAGE TO LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DARK MODE TOGGLE
  ========================= */
  const toggle = document.getElementById("darkModeToggle");

  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      try {
        if (document.body.classList.contains("dark")) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      } catch (e) {
        console.error("Failed to save theme preference:", e);
      }
    });
  }

  // Load saved theme
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  } catch (e) {
    console.error("Failed to read theme preference:", e);
  }

  /* =========================
     CONTACT FORM VALIDATION
  ========================= */
  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    const phoneInput = orderForm.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.setAttribute("pattern", "^(\\+?254|0)7\\d{8}$");
      phoneInput.setAttribute("title", "Kenyan phone number, e.g. 0712345678 or +254712345678");
    }

    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const phone = phoneInput ? phoneInput.value.trim() : "";
      if (!/^(\+?254|0)7\d{8}$/.test(phone)) {
        alert("Please enter a valid Kenyan phone number (e.g. 0712345678).");
        return;
      }

      const data = new FormData(orderForm);
      const order = {
        id: Date.now(),
        name: data.get("name"),
        phone: phone,
        pickup: data.get("pickup"),
        delivery: data.get("delivery"),
        message: data.get("message"),
        location: data.get("location"),
        price: 0,
        status: "Pending"
      };

      var orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      alert("Order placed! We will contact you shortly.");
      orderForm.reset();
    });
  }

  /* =========================
     GEOLOCATION BUTTON
  ========================= */
  const locBtn = document.getElementById("getLocationBtn");
  const locInput = document.getElementById("location");
  if (locBtn && locInput) {
    locBtn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      locBtn.textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          locInput.value = pos.coords.latitude + "," + pos.coords.longitude;
          locBtn.textContent = "Location captured";
        },
        function () {
          alert("Unable to get your location.");
          locBtn.textContent = "Try again";
        }
      );
    });
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

  /* =========================
     ORDER FORM HANDLING
  ========================= */
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(orderForm);
      const order = {
        id: Date.now(),
        name: formData.get("name"),
        phone: formData.get("phone"),
        pickup: formData.get("pickup"),
        delivery: formData.get("delivery"),
        location: formData.get("location"),
        message: formData.get("message"),
        status: "Pending"
      };

      try {
        const existing = JSON.parse(localStorage.getItem("orders")) || [];
        existing.push(order);
        localStorage.setItem("orders", JSON.stringify(existing));
      } catch (e) {
        console.error("Failed to save order:", e);
        alert("Could not save your order. Please try again or contact us via WhatsApp.");
        return;
      }

      const whatsappMessage = `New Order from ${order.name}\nPhone: ${order.phone}\nPickup: ${order.pickup}\nDelivery: ${order.delivery}\nDetails: ${order.message || "N/A"}`;
      const win = window.open(
        `https://wa.me/254793676054?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
      );

      if (!win) {
        alert("Pop-up was blocked. Your order was saved — please contact us on WhatsApp to confirm.");
      }

      orderForm.reset();
      alert("Order placed! We'll reach out shortly.");
    });
  }

  /* =========================
     GEOLOCATION BUTTON
  ========================= */
  const locationBtn = document.getElementById("getLocationBtn");
  const locationField = document.getElementById("location");

  if (locationBtn) {
    locationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      locationBtn.textContent = "Locating...";
      locationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          if (locationField) {
            locationField.value = coords;
          }
          locationBtn.textContent = "📍 Location captured!";
          setTimeout(() => {
            locationBtn.textContent = "📍 Use Current Location";
            locationBtn.disabled = false;
          }, 2000);
        },
        (error) => {
          let msg;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location access was denied. Please enable it in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              msg = "Location request timed out. Please try again.";
              break;
            default:
              msg = "An unknown error occurred while getting your location.";
          }
          alert(msg);
          locationBtn.textContent = "📍 Use Current Location";
          locationBtn.disabled = false;
        }
      );
    });
  }

});
