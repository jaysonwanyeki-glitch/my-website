/* =========================
   PAGE-SPECIFIC LOGIC
   (booking form, geolocation,
    order tracking)
   Shared utilities live in
   shared.js
========================= */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     GEOLOCATION BUTTON
  ========================= */
  const locBtn = document.getElementById("getLocationBtn");
  const locField = document.getElementById("location");

  if (locBtn && locField) {
    locBtn.addEventListener("click", () => {
      if (!navigator.geolocation) return;
      locBtn.textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locField.value = `${pos.coords.latitude},${pos.coords.longitude}`;
          locBtn.textContent = "Location captured!";
          locBtn.classList.add("location-captured");
        },
        () => {
          locBtn.textContent = "Could not get location";
        }
      );
    });
  }

  /* =========================
     ORDER / BOOKING FORM
  ========================= */
  const form = document.getElementById("orderForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const serviceNames = {
        parcel: "Parcel Delivery",
        express: "Express Delivery",
        business: "Business Delivery",
        bulk: "Bulk Order",
      };
      const servicePrices = {
        parcel: 200,
        express: 400,
        business: 300,
        bulk: 0,
      };

      const serviceKey = data.get("service") || "parcel";
      const trackingId = "SC-" + Date.now();

      const order = {
        id: trackingId,
        name: data.get("name"),
        phone: data.get("phone"),
        pickup: data.get("pickup"),
        delivery: data.get("delivery"),
        service: serviceNames[serviceKey] || serviceKey,
        urgency: data.get("urgency") || "standard",
        message: data.get("message"),
        location: data.get("location"),
        price: servicePrices[serviceKey] || 200,
        status: "Pending",
        date: new Date().toLocaleString(),
      };

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      const whatsappMsg =
        `📦 *NEW DELIVERY ORDER*%0A` +
        `🆔 Tracking: ${order.id}%0A` +
        `👤 Name: ${order.name}%0A` +
        `📞 Phone: ${order.phone}%0A` +
        `📍 Pickup: ${order.pickup}%0A` +
        `🏁 Delivery: ${order.delivery}%0A` +
        `🚀 Service: ${order.service}%0A` +
        `⏰ Urgency: ${order.urgency}%0A` +
        `💬 Details: ${order.message || "None"}`;

      window.open(
        `https://wa.me/254793676054?text=${whatsappMsg}`,
        "_blank"
      );

      showBookingConfirmation(order);
      form.reset();
    });
  }

  function showBookingConfirmation(order) {
    const container = form.closest(".booking-container") || form.parentElement;
    const confirmation = document.createElement("div");
    confirmation.className = "booking-confirmation";
    confirmation.innerHTML = `
      <div class="confirmation-icon">✅</div>
      <h3>Order Placed Successfully!</h3>
      <p>Your tracking ID is: <strong>${order.id}</strong></p>
      <p>Save this ID to track your delivery status.</p>
      <div class="confirmation-actions">
        <a href="tracking.html?id=${order.id}" class="btn-primary">Track My Order</a>
        <a href="contact.html" class="btn-outline">Place Another Order</a>
      </div>
    `;
    container.innerHTML = "";
    container.appendChild(confirmation);
  }

  /* =========================
     ORDER TRACKING
  ========================= */
  const trackBtn = document.getElementById("trackBtn");
  const trackInput = document.getElementById("trackingInput");

  if (trackBtn && trackInput) {
    const params = new URLSearchParams(window.location.search);
    const prefilledId = params.get("id");
    if (prefilledId) {
      trackInput.value = prefilledId;
      lookupOrder(prefilledId);
    }

    trackBtn.addEventListener("click", () => {
      const id = trackInput.value.trim();
      if (id) lookupOrder(id);
    });

    trackInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const id = trackInput.value.trim();
        if (id) lookupOrder(id);
      }
    });

    loadRecentOrders();
  }

  function lookupOrder(trackingId) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = orders.find((o) => o.id === trackingId);

    const resultEl = document.getElementById("trackingResult");
    const notFoundEl = document.getElementById("trackingNotFound");

    if (!order) {
      resultEl.style.display = "none";
      notFoundEl.style.display = "block";
      return;
    }

    notFoundEl.style.display = "none";
    resultEl.style.display = "block";

    document.getElementById("trackOrderId").textContent = order.id;
    document.getElementById("trackName").textContent = order.name;
    document.getElementById("trackPickup").textContent = order.pickup;
    document.getElementById("trackDelivery").textContent = order.delivery;
    document.getElementById("trackService").textContent = order.service || "Parcel Delivery";
    document.getElementById("trackPrice").textContent = order.price ? `KSh ${order.price}` : "TBD";
    document.getElementById("trackDate").textContent = order.date || "Just now";

    const statusBadge = document.getElementById("trackStatus");
    statusBadge.textContent = order.status || "Pending";
    statusBadge.className = "status-badge status-" + (order.status || "Pending").toLowerCase().replace(/\s+/g, "-");

    const statusMap = {
      "Pending": 1,
      "Confirmed": 2,
      "Pickup": 3,
      "In Transit": 4,
      "Assigned": 4,
      "Delivered": 5,
    };
    const progress = statusMap[order.status] || 1;
    const steps = ["booked", "confirmed", "pickup", "transit", "delivered"];
    steps.forEach((step, i) => {
      const el = document.getElementById("step-" + step);
      if (el) {
        el.className = "timeline-step" + (i < progress ? " completed" : i === progress ? " active" : "");
      }
    });

    const whatsAppLink = document.getElementById("trackWhatsApp");
    whatsAppLink.href = `https://wa.me/254793676054?text=Hi%20I'm%20checking%20on%20order%20${order.id}`;
  }

  function loadRecentOrders() {
    const container = document.getElementById("recentOrders");
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length === 0) {
      container.innerHTML = '<p class="no-orders">No recent orders. <a href="contact.html">Book your first delivery!</a></p>';
      return;
    }

    const recent = orders.slice(-5).reverse();
    container.innerHTML = recent
      .map(
        (o) => `
      <div class="recent-order-card" onclick="document.getElementById('trackingInput').value='${o.id}';document.getElementById('trackBtn').click();">
        <div class="recent-order-id">${o.id}</div>
        <div class="recent-order-route">${o.pickup} → ${o.delivery}</div>
        <span class="status-badge status-${(o.status || "pending").toLowerCase().replace(/\s+/g, "-")}">${o.status || "Pending"}</span>
      </div>
    `
      )
      .join("");
  }
});
