/* =========================
   SWIFT COURIER - MAIN SCRIPT
   Secure Delivery Platform
========================= */

document.addEventListener("DOMContentLoaded", function() {

  // =========================
  // DARK MODE
  // =========================
  var toggle = document.getElementById("darkModeToggle");

  if (toggle) {
    toggle.addEventListener("click", function() {
      document.body.classList.toggle("dark");
      try {
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      } catch (e) {
        console.error("Theme save failed:", e);
      }
    });
  }

  // Load saved theme
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  } catch (e) {
    console.error("Theme load failed:", e);
  }

  // =========================
  // SCROLL ANIMATIONS
  // =========================
  var animatedItems = document.querySelectorAll(".animate");

  if (animatedItems.length > 0 && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    animatedItems.forEach(function(item) {
      observer.observe(item);
    });
  } else {
    // Fallback: show all
    animatedItems.forEach(function(item) {
      item.classList.add("visible");
    });
  }

  // =========================
  // ANIMATED COUNTERS
  // =========================
  var counters = document.querySelectorAll(".stat-number");

  if (counters.length > 0 && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target);
    if (isNaN(target)) return;

    var duration = 2000;
    var step = Math.max(1, Math.floor(target / (duration / 16)));
    var current = 0;

    var timer = setInterval(function() {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = current.toLocaleString();
      }
    }, 16);
  }

  // =========================
  // GEOLOCATION
  // =========================
  var locBtn = document.getElementById("getLocationBtn");
  var locInput = document.getElementById("location");

  if (locBtn) {
    locBtn.addEventListener("click", function() {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      locBtn.textContent = "⏳ Locating...";
      locBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        function(position) {
          var coords = position.coords.latitude + ", " + position.coords.longitude;
          if (locInput) {
            locInput.value = coords;
          }
          locBtn.textContent = "✅ Location captured!";
          setTimeout(function() {
            locBtn.textContent = "📍 Update Location";
            locBtn.disabled = false;
          }, 2000);
        },
        function(error) {
          var msg = "Unable to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = "Location access was denied. Please enable it in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              msg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              msg = "Location request timed out.";
              break;
          }
          alert(msg);
          locBtn.textContent = "📍 Use Current Location";
          locBtn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  // =========================
  // ORDER FORM
  // =========================
  var orderForm = document.getElementById("orderForm");

  if (orderForm) {
    // Phone validation
    var phoneInput = orderForm.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.setAttribute("pattern", "^(\\+?254|0)7\\d{8}$");
      phoneInput.setAttribute("title", "Kenyan phone: 0712345678 or +254712345678");
    }

    // URL params for pre-filling
    var urlParams = new URLSearchParams(window.location.search);
    var typeParam = urlParams.get("type");
    var zoneParam = urlParams.get("zone");

    if (typeParam) {
      var typeSelect = document.getElementById("orderType");
      if (typeSelect) {
        for (var i = 0; i < typeSelect.options.length; i++) {
          if (typeSelect.options[i].value === typeParam) {
            typeSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    if (zoneParam) {
      var pickupInput = document.getElementById("pickupInput");
      if (pickupInput && !pickupInput.value) {
        var zoneNames = {
          'cbd': 'Nairobi CBD',
          'westlands': 'Westlands, Nairobi',
          'kilimani': 'Kilimani, Nairobi',
          'eastleigh': 'Eastleigh, Nairobi',
          'karen': 'Karen, Nairobi',
          'thika': 'Thika Road',
          'mombasa': 'Mombasa Road'
        };
        pickupInput.value = zoneNames[zoneParam] || zoneParam;
      }
    }

    // Price estimation
    var orderTypeSelect = document.getElementById("orderType");
    var securitySelect = document.getElementById("securityLevel");

    function estimatePrice() {
      var type = orderTypeSelect ? orderTypeSelect.value : '';
      var security = securitySelect ? securitySelect.value : 'Standard';

      var basePrices = {
        'document': 200,
        'sensitive': 350,
        'parcel': 250,
        'business': 250,
        'express': 500,
        'multistop': 400,
        '': 0
      };

      var securityAdd = {
        'Standard': 0,
        'High': 50,
        'Maximum': 100
      };

      var base = basePrices[type] || 0;
      var add = securityAdd[security] || 0;
      var total = base + add;

      var priceEl = document.getElementById("priceValue");
      if (priceEl && total > 0) {
        priceEl.textContent = total;
        document.getElementById("estimatedPrice").style.display = "block";
      }
    }

    if (orderTypeSelect) {
      orderTypeSelect.addEventListener("change", estimatePrice);
    }
    if (securitySelect) {
      securitySelect.addEventListener("change", estimatePrice);
    }

    // Form submission
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // Validate phone
      var phone = phoneInput ? phoneInput.value.trim() : "";
      if (!phone || !/^(\+?254|0)7\d{8}$/.test(phone)) {
        alert("Please enter a valid Kenyan phone number (e.g. 0712345678).");
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Collect form data
      var formData = new FormData(orderForm);
      var order = {
        id: Date.now(),
        name: formData.get("name"),
        phone: phone,
        pickup: formData.get("pickup"),
        delivery: formData.get("delivery"),
        type: formData.get("type") || "parcel",
        security: formData.get("security") || "Standard",
        message: formData.get("message"),
        value: formData.get("value") || "",
        deliveryTime: formData.get("deliveryTime") || "asap",
        location: formData.get("location") || "",
        price: estimateFinalPrice(formData.get("type"), formData.get("security")),
        status: "Pending",
        rider: "",
        timestamp: Date.now()
      };

      // Save to localStorage
      try {
        var existing = JSON.parse(localStorage.getItem("orders")) || [];
        existing.push(order);
        localStorage.setItem("orders", JSON.stringify(existing));
      } catch (err) {
        console.error("Failed to save order:", err);
        alert("Could not save your order. Please try again or contact us via WhatsApp.");
        return;
      }

      // Send WhatsApp notification
      var whatsappMessage = "🔔 NEW ORDER\n" +
        "👤 " + (order.name || "") + "\n" +
        "📞 " + order.phone + "\n" +
        "📄 Type: " + order.type + "\n" +
        "🔒 Security: " + order.security + "\n" +
        "📍 Pickup: " + (order.pickup || "") + "\n" +
        "🏁 Delivery: " + (order.delivery || "") + "\n" +
        "💰 Est. Price: KSh " + order.price + "\n" +
        "📝 " + (order.message || "N/A");

      var win = window.open(
        "https://wa.me/254793676054?text=" + encodeURIComponent(whatsappMessage),
        "_blank"
      );

      if (!win) {
        alert("Pop-up was blocked. Your order was saved — please contact us on WhatsApp to confirm.");
      }

      orderForm.reset();
      alert("✅ Order placed successfully! We'll reach out shortly.");

      // Reset price display
      var priceEl = document.getElementById("priceValue");
      if (priceEl) priceEl.textContent = "0";
    });
  }

  function estimateFinalPrice(type, security) {
    var basePrices = {
      'document': 200,
      'sensitive': 350,
      'parcel': 250,
      'business': 250,
      'express': 500,
      'multistop': 400
    };
    var securityAdd = { 'Standard': 0, 'High': 50, 'Maximum': 100 };
    return (basePrices[type] || 250) + (securityAdd[security] || 0);
  }

  // =========================
  // SECURITY NOTE TOGGLE
  // =========================
  var securitySelectEl = document.getElementById("securityLevel");
  if (securitySelectEl) {
    securitySelectEl.addEventListener("change", function() {
      var note = document.querySelector(".security-note");
      if (note) {
        if (this.value === "High" || this.value === "Maximum") {
          note.style.background = "#fef3c7";
          note.querySelector("p").textContent = this.value + " Security selected: Your package will receive tamper-proof sealing, chain of custody tracking, and signature confirmation.";
        } else {
          note.style.background = "#f0fdf4";
          note.querySelector("p").textContent = "Your information is encrypted and secure. We never share customer data with third parties.";
        }
      }
    });
  }

});
