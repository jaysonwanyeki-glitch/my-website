/* =========================
   PAGE-SPECIFIC LOGIC
   (contact form, geolocation)
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
      navigator.geolocation.getCurrentPosition((pos) => {
        locField.value = `${pos.coords.latitude},${pos.coords.longitude}`;
        locBtn.textContent = "Location captured!";
      });
    });
  }

  /* =========================
     ORDER FORM SUBMISSION
  ========================= */
  const form = document.getElementById("orderForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const order = {
        id: Date.now(),
        name: data.get("name"),
        phone: data.get("phone"),
        pickup: data.get("pickup"),
        delivery: data.get("delivery"),
        message: data.get("message"),
        location: data.get("location"),
        price: 200,
        status: "Pending",
      };

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      const whatsappMsg = `New Order from ${order.name}%0APhone: ${order.phone}%0APickup: ${order.pickup}%0ADelivery: ${order.delivery}%0ADetails: ${order.message}`;
      window.open(
        `https://wa.me/254793676054?text=${whatsappMsg}`,
        "_blank"
      );

      form.reset();
    });
  }

});
